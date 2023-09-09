import React, {useState, useEffect, useMemo} from 'react'
import { Modal, Button, Table } from '@app/compLibrary'
// react-hot-toast 
import toast from 'react-hot-toast'
// styles
import classNames from 'classnames/bind'
import styles from './index.module.scss'
// types
import CommonModalI from '../commonTypes'
import { MtrlTableAllAdminUsers, PostUserSubscriptions } from '@app/api/Types/queryReturnTypes/Admin'
import { useQuery } from 'react-query'
import { GetSubscriptions } from '@app/api/Queries/Getters'
import { CheckObjOrArrForNull } from '@utils/helpers'
import { SubscriptionToPost, TableNameType } from '@app/Types/utils'
import DropDownSelect from '@app/components/DropDownSelect/DropDownSelect'
import { Axios, AxiosError } from 'axios';
import moment from 'moment'
import { setSubscToUser } from '@app/api/Queries/Post'

interface SubscriptionModalType extends CommonModalI {
  data: MtrlTableAllAdminUsers[]
  translation:Function
  onSuccess: () => void
}

const cx = classNames.bind(styles)
const SubscriptionModal = (props: SubscriptionModalType) => {
    const {
        show, 
        setShow, 
        data, 
        translation, 
        onSuccess
    } = props

    // queries
    const {
      data: subscribtionsData, 
      isLoading, isError
    }  = useQuery(['getSubscribtions',show], () => GetSubscriptions(), {enabled: show})   
    // states 
    const [usersList, setUsersList] = useState<MtrlTableAllAdminUsers[]>()
    const [dropdownPosition, setDropdownPosition] = useState<{position: 'down' | 'up', origin: "topRight" | "bottomRight" | "topLeft" | "bottomLeft" }>({
      position: 'down',
      origin: 'topRight'
    })
    const [subscForPost, setSubscForPost] = useState<SubscriptionToPost>({
      label: "", value:"", purch_price: "", valid_in_days: 0
    })

    // mems
    const subscribtionsMem = useMemo(() => {
      if(CheckObjOrArrForNull(subscribtionsData))
        return subscribtionsData?.map(item => {
          return {
            value: item.subsc_guid, 
            label: item.subsc_name + ' - '.repeat(2) + item.subsc_price_value + 'TMT',
            purch_price: parseInt(item.subsc_price_value), // not visible in dropdown, used only just for the FN
            valid_in_days: item.subsc_valid_in_days // not visible in dropdown, used only just for the FN
          } 
        })
      return []
    }, [subscribtionsData])

    useEffect(() => {
      if(CheckObjOrArrForNull(data))
        setUsersList(data)
    }, [data])

    useEffect(() => {
      if(CheckObjOrArrForNull(usersList) && usersList!?.length >= 3)
        setDropdownPosition(prev => ({...prev, position: 'up', origin: 'bottomRight'}))
      else 
        setDropdownPosition(prev => ({...prev, position: 'down', origin: 'topRight'}))
    }, [usersList])

    useEffect(() => {
      if(CheckObjOrArrForNull(subscribtionsMem)){
        setSubscForPost(subscribtionsMem?.[subscribtionsMem.length - 1]!)
      }
    }, [subscribtionsMem])

    const handleSubmit = async () => {
      try {
        if(CheckObjOrArrForNull(usersList)){
          const now = new Date()
          const response:any = await setSubscToUser<PostUserSubscriptions>({
            subsc_guid: subscForPost.value,
            subsc_purch_price: subscForPost.purch_price, 
            subsc_start_date: moment(now).format('YYYY-MM-DD hh:mm:ss'), 
            subsc_end_date: moment(now).add(subscForPost.valid_in_days, 'days').format('YYYY-MM-DD hh:mm:ss'),
            user_guids: usersList!?.map(item => item.user_guid as string)
          })
          // console.log('response from server', response)
          if(response.message === 'Users subscriptions successfully activated'){
            onSuccess()
            setShow()
          }

        }else toast.error(translation('selectAtLeastAUser'))
      } catch (error) {
        if(error instanceof AxiosError){
          return console.log('axios error', error)
        }
        return console.log("error", error)
      }
    }

  return (
    <Modal
        isOpen={show}
        close={setShow}
        className={styles.editModal}
        header={
          <div className={styles.header}>
            {translation('subsOperations')}
          </div>
        }
    >

      <div className={styles.wrapper}>
        <Table 
              bodyData={usersList!}
              headData={[
                translation('userName'), 
                translation('phoneNumber'), 
                translation('balance')
              ]}
              renderHead={(data, index) => {
                return <th key={index}>{data}</th>;
              }}
              renderBody={(data, index) => {
                return (
                  <tr key={index}>
                    <td>{data.user_name}</td>
                    <td>{data.user_login}</td>
                    <td>{data.user_balance}</td>
                  </tr>
                )
              }}
              onClick={() => {}}
          />

          <div className={styles.operation}>
            <div className={`${styles.filterInput} ${styles.filterSelect}`}>
              <DropDownSelect 
                data={subscribtionsMem}
                fetchStatuses={{isLoading, isError}}
                dropDownContentStyle={{right: '0'}}
                position={dropdownPosition.position}
                transformOrigin={dropdownPosition.origin}
                onChange={(item) => {
                  if(!item.label.startsWith('Free') && !item.label.startsWith('Trial'))
                    setUsersList(data.filter(user => {
                      if(Number(+user.user_balance >= +item.purch_price!)){
                        return user
                      }
                    }))
                  else 
                    setUsersList(data) /// set it default data if not

                  setSubscForPost(item)
                }}
                title={CheckObjOrArrForNull(subscribtionsMem) ? subscribtionsMem?.[subscribtionsMem.length - 1]?.label : ""}
              />
            </div>

            <div className={styles.submitters}>
              <Button 
                type='contained'
                color='theme'
                rounded
                onClick={handleSubmit}
                className={styles.applyBtn}
              >
                {translation('apply')}
              </Button>
            </div>

          </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal