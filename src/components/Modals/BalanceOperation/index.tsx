import React,{useEffect, useMemo, useState} from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik';
import { Button, Input, Modal, Table } from '@app/compLibrary'
// styles 
import styles from './index.module.scss'
import classNames from 'classnames/bind';
import CommonModalI from '../commonTypes'
import {  MtrlTableAllAdminUsers, PostUserBalanceType } from '@app/api/Types/queryReturnTypes/Admin'
import { CheckObjOrArrForNull, convertToNumber, isNegativeNumber, isNullOrUndefined, isStrEmpty } from '@utils/helpers'

import DropDownSelect from '@app/components/DropDownSelect/DropDownSelect';
import { useQuery } from 'react-query';
import { GetOperationTypes } from '@app/api/Queries/Getters';
import { changeUserBalance } from '@app/api/Queries/Post';
import { TableNameType } from '@app/Types/utils';

    // const themeMode = useAppSelector(state => state.themeReducer.mode)
    // const phoneNumberRegex = new RegExp(/^\+9936[1-5]/)
    // const formikRef:any = useRef(null)
    // const validationSchema = Yup.object().shape(
    //   data.reduce((acc, item) => {
    //     return {
    //       ...acc,
    //       [`user__${item.user_guid}`]: Yup.string().required(translation('phoneRequired')).matches(phoneNumberRegex, translation("onlyDigit")).min(12, translation('exactDigit')).max(12, translation('exactDigit')),
    //     };
    //   }, {})
    // )

type FormikTypes ={
  balance:string
}

interface BalanceOperationsType extends CommonModalI {
  data: MtrlTableAllAdminUsers[]
  translation:Function
  onSuccess: () => void
}

const cx = classNames.bind(styles)
const Edit = (props: BalanceOperationsType) => {
    const {
        show, 
        setShow,
        data,
        translation, 
        onSuccess
    } = props

    // queries
    const {
      data: operationTypesData, 
      isLoading, 
      isError
    } = useQuery(['getOperationTypes', show], () => GetOperationTypes(), {enabled: show})
    ///states 
    const [operationType, setOperationType] = useState<TableNameType>({
      label: "", value:""
    })

    const formik = useFormik<FormikTypes>({
      initialValues: {
        balance:""
      }, 
      validationSchema: Yup.object().shape({
        balance: Yup.string().required(translation('requiredField')),
      }), 
      onSubmit: async(values:FormikTypes, {resetForm}) => {
        const postData:PostUserBalanceType={
          optTypeGuid: operationType.value, 
          operationAmount: values.balance,
          users:[]
        }
        for(let i = 0; i < data.length; i++){
          const item = data[i]
            postData.users.push({ 
              userGuid:item.user_guid, 
              phoneNumber:item.user_login, 
              resultOperationAmount: item.balance_sum, 
              userBalance: parseInt(item.user_balance)
            })
        }
        const response:any = await changeUserBalance(postData)
        // console.log('postData', postData)
        // console.log('res', response)
        if(response.message === 'Users balance operation success.'){
          setOperationType(prev => ({...prev, label: '', value: ''}))
          formik.setFieldValue('balance', "")
          onSuccess()
          setShow()
        }
      }
    })

    const operationsMem = useMemo(() => {
      if(CheckObjOrArrForNull(operationTypesData)){
        return operationTypesData?.map(item => {
          return {
            value: item.operation_type_guid, 
            label: item.operation_type_name, 
          }
        })
      }
      return []
    }, [operationTypesData])

    useEffect(() => {
      if(CheckObjOrArrForNull(operationsMem))
        setOperationType(operationsMem![0])
    }, [operationsMem])

    useEffect(() => {
      if(isStrEmpty(formik.values.balance)){
          for(let i = 0; i < data.length; i++){
            const item = data[i]
            const fieldBalance = formik.values.balance
            if(operationType.label.startsWith('Increase')){
              item.balance_sum = Number(+item.user_balance + +fieldBalance)
              item.red_target = false
            }
            else { // when descrease
                if(isNegativeNumber(item.user_balance)){
                  item.balance_sum = 0
                  item.red_target = false
                }
                else {
                  if(Number(+item.user_balance < +fieldBalance)){
                    item.balance_sum = convertToNumber(item.user_balance)
                    item.red_target = true
                  }
                  else {
                    item.balance_sum = Number(+item.user_balance - +fieldBalance)
                    item.red_target = false
                  }
                    
                }
              }              
          }
      }else 
        for(let i = 0; i < data.length; i++){
          data[i].balance_sum = isNullOrUndefined(data[i].user_balance) 
                                    && isNegativeNumber(data[i].user_balance) ? 0 : convertToNumber(data[i].user_balance)
        }
    }, [formik.values.balance])

    // useEffect(() => {
    //   console.log('usrArrData', usrArrData)
    // }, [usrArrData])

  return (
    <Modal
        isOpen={show}
        close={() => {
          setShow()
          formik.setFieldValue('balance', "")
        }}
        className={styles.editModal}
        header={
          <div className={styles.header}>
            {translation('balanceOperations')}
          </div>
        }
    >

      <div className={styles.wrapper}>
          <Table 
            bodyData={data ?? []}
            headData={[
              translation('userName'), 
              translation('phoneNumber'), 
              translation('balance'), 
              translation('result')
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
                  <td 
                    className={cx({
                      redify: data.red_target
                    })}
                  >{data.balance_sum}</td>
                </tr>
              )
            }}
            onClick={() => {}}
          />

            
          <div className={styles.opeation}>
            <div className={`${styles.filterInput} ${styles.filterSelect}`}>
              <DropDownSelect 
                dropDownContentStyle={{right: '0'}}
                position='up'
                transformOrigin='bottomRight'
                title={CheckObjOrArrForNull(operationsMem) ? operationsMem?.[0]?.label : ""}
                data={operationsMem}
                onChange={(item) => {
                  if(isStrEmpty(formik.values.balance)){
                      for(let i = 0; i < data.length;  i++){
                        const fieldBalance = formik.values.balance
                        if(item.label.startsWith('Increase')){
                          data[i].balance_sum = Number(+data[i].user_balance + +fieldBalance)
                          data[i].red_target = false
                        }
                        else { // when decrease
                          if(isNegativeNumber(data[i].user_balance)){
                            data[i].balance_sum = 0
                            data[i].red_target = false
                          }
                          else {
                            if(Number(+data[i].user_balance < +fieldBalance)){
                              data[i].balance_sum = convertToNumber(data[i].user_balance)
                              data[i].red_target = true
                            }
                            else {
                              data[i].balance_sum = Number(+data[i].user_balance - +fieldBalance)
                              data[i].red_target = false
                            }
                          }
                        }
                      }
                  }
                  setOperationType(item)
                }}
                fetchStatuses={{isLoading, isError}}
              />
            </div>

              {/* submittters */}
              
            <div className={styles.submitters}>
              <div className={styles.balanceContainer}>
                <Input 
                  type='text'
                  className={styles.field}
                  placeholder={translation('balance')}
                  name='balance'
                  value={formik.values.balance}
                  onChange={e => {
                    formik.handleChange(e)
                    formik.setFieldTouched('balance', false, false)
                  }}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "")
                }}
                />
                <div>
                  {
                    formik.errors && formik.touched ? 
                    <div className={styles.error}>
                      {formik.errors.balance}
                    </div> : null
                  }
                </div>
              </div>
              <Button onClick={formik.handleSubmit} className={styles.submit} htmlType='submit' color='theme' roundedSm>
                {translation('apply')}
              </Button>
            </div>

          </div> 
      </div>

    </Modal>
  )
}

export default Edit