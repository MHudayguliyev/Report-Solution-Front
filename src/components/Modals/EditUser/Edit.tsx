import React,{useEffect, useMemo, useRef, useState} from 'react'
import * as Yup from 'yup'
import { Field, Form, Formik, useFormik } from 'formik';
import { Button, Input, Modal } from '@app/compLibrary'
// styles 
import styles from './Edit.module.scss'
import classNames from 'classnames/bind';
import CommonModalI from '../commonTypes'
import { AllAdminUsers, PostUserBalanceType } from '@app/api/Types/queryReturnTypes/Admin'
import { CheckObjOrArrForNull, isStrEmpty } from '@utils/helpers'

/// toast 
import toast from 'react-hot-toast'
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

interface EditUsersModal extends CommonModalI {
  data: AllAdminUsers[]
  translation:Function
  onSuccess: () => void
}

const cx = classNames.bind(styles)
const Edit = (props: EditUsersModal) => {
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

    const handleSubmit = async (data: PostUserBalanceType) => {
      try {
        const response:any = await changeUserBalance(data)
        console.log('res', response)
        if(response.message === 'Users balance operation success.'){
          setShow()
          setOperationType(prev => ({...prev, label: '', value: ''}))
          return {success: true}
        }
        return {success: false}

      } catch (error) {
        console.log('erro',error)
        return {success: false}
      }
    }

    const formik = useFormik<FormikTypes>({
      initialValues: {
        balance:""
      }, 
      validationSchema: Yup.object().shape({
        balance: Yup.string().required(translation('requiredField')),
      }), 
      onSubmit: async(values:FormikTypes, {resetForm}) => {

        const postData:PostUserBalanceType={
          operationAmount:values.balance,
          optTypeGuid: operationType.value, 
          users:[]
        }
        const cantAffords: AllAdminUsers[] = []
        for(let i = 0; i < data.length; i++){
          const item = data[i]
            postData.users.push({ 
              userGuid:item.user_guid, 
              phoneNumber:item.user_login
            })
            if(
              operationType.label.startsWith('Decrease') && 
              Number(item.user_balance) < Number(values.balance)
            ){
              cantAffords.push({...item})
            }
        }
        console.log('cantAffords', cantAffords)
        if(CheckObjOrArrForNull(cantAffords)){
          toast.custom(
            (t) => (
              <div className={styles.cant__affordWrapper}>
                <div className={styles.header}>
                  <h4>Users with insufficient balance</h4>
                </div>
                {
                  cantAffords.map((data, i) => (
                    <div key={i} className={styles.user}>
                      <div className={styles.userName}>
                        <span>{i+1}.</span>
                        <span>{data.user_name}</span>
                      </div>
                      <div className={styles.userLogAndBalance}>
                        <div className={styles.userLogin}>{data.user_login}</div>
                        <div className={styles.insufficientBalance}>{Number(+values.balance - +data.user_balance)}</div>
                      </div>
                    </div>
                  ))
                }
                <div className={styles.footer}>
                  <Button type='contained' color='grey' roundedSm onClick={() => toast.dismiss(t.id)}>Cancel</Button>
                  <Button htmlType='submit' color='theme' roundedSm onClick={async () => {
                    const response = await handleSubmit(postData)
                    if(response.success){
                      resetForm()
                      onSuccess()
                      toast.dismiss(t.id)
                    }
                      
                  }}>Add</Button>
                </div>
              </div>
            ), {
              duration: Infinity
            }
          )
        }else {
          const response = await handleSubmit(postData)
          if(response.success){
            resetForm()
            onSuccess()
          }
            
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
            Add balance
          </div>
        }
    >

      <div className={styles.wrapper}>
          {
            CheckObjOrArrForNull(data) ? 
              data.map((item, i) => {
                return (
                  <div key={i} className={styles.user}>
                    <div className={styles.userName}>
                      <span>{i+1}.</span>
                      <span>{item.user_name}</span>
                    </div>
                    <span className={styles.userLogin}>{item.user_login}</span>
                  </div>
                )
              }) 
              : null
          }

      
            <div className={styles.operationSelect}>
              <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                <DropDownSelect 
                  dropDownContentStyle={{right: '0'}}
                  position='up'
                  transformOrigin='bottomRight'
                  title={CheckObjOrArrForNull(operationsMem) ? operationsMem?.[0]?.label : ""}
                  data={operationsMem}
                  onChange={(data) => setOperationType(data)}
                  fetchStatuses={{isLoading, isError}}
                />
              </div>
          </div> 
  

          <div className={styles.submitters}>
            <div className={styles.balanceContainer}>
              <Input 
                type='search'
                className={styles.field}
                placeholder='balance..'
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
              Add
            </Button>
          </div>
      </div>

    </Modal>
  )
}

export default Edit