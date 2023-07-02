import React, { ChangeEvent, useEffect, useState } from 'react'
import user_image from "../../assets/images/tuat.png";
import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss'
import { Input } from '@app/compLibrary';
import { Button} from '@mui/material';
import { Form, Formik } from 'formik';
import { UserList } from '@app/api/Types/queryReturnTypes';
import { resetFormikValue } from '@utils/helpers';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import { GetUserRoles } from '@app/api/Queries/Getters';
import { useQuery } from 'react-query';
import UserActionTable from './UserActionTable';


type UserProfileType = {
    userData: UserList
}

const cx = classNames.bind(styles)
const UserProfile = (props: UserProfileType) => {
    const {
        userData
    } = props

    console.log(userData)
    const {t} = useTranslation()

    const {
        data: roles,
        isError: isRolesError,
        isLoading: isRolesLoading,
    } = useQuery('getUserRoles', () => GetUserRoles(), { refetchOnWindowFocus: false })

    const phoneNumberRegex = new RegExp(/^6\d*$/)
    const initialValues = {
        user_name: userData.user_name,
        user_login: userData.user_login,
        user_email: userData.user_email
    }
    const ValidationSchema = Yup.object().shape({
        user_name: Yup.string().required().min(3),
        user_login: Yup.string().required().matches(phoneNumberRegex, t("onlyDigit")).min(8, t('exactDigit')).max(8, t('exactDigit')),
        user_email: Yup.string()
    })

  const [editMode, setEditMode] = useState(false)
  const [roleGuid, setRoleGuid] = useState<string>('')
  const [image, setImage] = useState<any>(user_image)
  useEffect(() => {
    console.log(image)
  },[image])
  
  const mask = '+993'

  const Submit = ((values:any) => {
    console.log('form values', values)
  })

  return (
    <>
        <div className={styles.profile}>
            <div className={styles.profile__form}>
                <div className={styles.user__img}>
                   <img src={image} alt="" width={100} height={100}/>
                   <label htmlFor='userImg' className={styles.user_upload}>
                        <i className='bx bx-cloud-upload'/>
                        Upload
                    </label>
                    <input id='userImg' type='file'  className={styles.img__upload__btn} onChange={(e: any) => setImage(URL.createObjectURL(e.target.files[0]))}/>
                </div>
                <div className={styles.user__info}>
                    <Formik initialValues={initialValues} validationSchema={ValidationSchema} onSubmit={(values) =>  console.log('form values', values)}>
                        {({values, handleChange, setFieldValue, setFieldTouched, errors, touched}) => (
                            <Form>
                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('userName')}</h4>
                                    <div>
                                        <Input 
                                            type='text'
                                            placeholder='Username'
                                            name='user_name'
                                            value={values.user_name}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode
                                            })}
                                        />
                                        {/* <div className={styles.errorContainer}>
                                            {errors.user_name && touched.user_name ? <div className={styles.error}>{errors.user_name}</div> : null}
                                        </div> */}
                                    </div>
                                </div>

                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('phoneNumber')}</h4>
                                    <div>
                                        <Input 
                                            type='text'
                                            placeholder='Phone'
                                            name='user_login'
                                            value={values.user_login}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode
                                            })}
                                        />
                                        {/* <div className={styles.errorContainer}>
                                            {errors.user_login && touched.user_login ? <div className={styles.error}>{errors.user_login}</div> : null}
                                        </div> */}
                                    </div>
                                </div>

                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('email')}</h4>
                                    <div>
                                        <Input 
                                            type='email'
                                            placeholder='Email'
                                            name='user_email'
                                            value={values.user_email}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode
                                            })}
                                        />
                                        {/* <div className={styles.errorContainer}>
                                            {errors.user_email && touched.user_email ? <div className={styles.error}>{errors.user_email}</div> : null}
                                        </div> */}
                                    </div>
                                </div>
                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('role')}</h4>
                                    {
                                        editMode ?
                                        <div className={styles.dropwDownRole}>
                                        <select onChange={(e: any) => setRoleGuid(e.target.value as string)}>
                                            {roles && roles?.map((item, i) => (
                                                <option value={item.role_guid} key={i}>{item.role_name}</option>
                                            ))}
                                        </select>
                                    </div> : 
                                    <span className={styles.role_name}>{userData.role_name}</span>
                                    }
                                       
                                </div>

                                {
                                    editMode ?
                                    <div className={styles.submit__btn}>
                                    <Button                                                                     
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => {
                                            setEditMode(false);
                                            resetFormikValue(initialValues,userData,setFieldValue,setFieldTouched)
                                            // setFieldTouched('user_login', false, false)
                                        }}
                                    >
                                       <span>{t('cancel')}</span> 
                                    </Button>
                                        <Button 
                                            variant="contained" 
                                            type='submit' 
                                            color="primary" 
                                            className={styles.submitBtn}
                                            // onClick={() => setBtn(false)}
                                        >
                                            <span>{t('save')}</span>
                                        </Button>
                                    </div> : 
                                    <div className={styles.submit__btn}>
                                        <Button 
                                            variant="contained" 
                                            type='submit' 
                                            color="primary" 
                                            onClick={() => setEditMode(true)}
                                        >
                                        <span>{t('edit')}</span>
                                    </Button>
                                    </div>
                                }


                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
        <div>
            <UserActionTable />
        </div>
    </>
  )
}


export default UserProfile
