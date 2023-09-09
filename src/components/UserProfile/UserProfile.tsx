import React, { useMemo, useEffect, useState, useRef, } from 'react'
import * as Yup from 'yup'
import { Input } from '@app/compLibrary';
import { useFormik } from 'formik';
// types
import { UserList } from '@app/api/Types/queryReturnTypes';
// translation
import { useTranslation } from 'react-i18next';
// components
import MaterialTable from '../MaterialTable/MaterialTable';
import ImageCropper from '../Modals/ImageCropper/ImageCropper';
/// api ref
import { updateUser } from '@app/api/Queries/Post';
/// react hot toast
import { toast } from 'react-hot-toast';
// axios 
import { AxiosError } from 'axios';
import { axiosInstance } from '@app/api/axiosInstance';
// react selectors/actions
import { useAppSelector } from '@app/hooks/redux_hooks';
import UserAction from '@app/api/Types/queryReturnTypes/UserAction';
/// custom icons
import cancel from "@app/assets/customIcons/cancel.svg"
import edit from '@app/assets/customIcons/edit.svg'
import save from '@app/assets/customIcons/save.svg'
//styles 
import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss'
// api helpers/utils
import {  resetFormikValue } from '@utils/helpers';
import authToken from '@app/api/service/auth_token';

type FormikTypes = {
    user_name:string, 
    user_email:string
    // user_login:string, 
}
type UserProfileType = {
    userData: UserList
    userActions: {data: UserAction[], loading: boolean, error: boolean}
    userGuid: string
    onSuccess: (updValues: FormikTypes) => void
    onUpload: () => void
    onDelete: (userGuid:string) => void
    showSideabar: boolean
    avatar: string
}

const cx = classNames.bind(styles)
const UserProfile = (props: UserProfileType) => {
    const {
        userData, 
        userActions, 
        userGuid, 
        onSuccess, 
        onUpload,
        onDelete,
        showSideabar,
        avatar,
    } = props
    const {t} = useTranslation()
    const inputRef: any = useRef(null)

    const handleUploadImage = (event: React.FormEvent<HTMLInputElement> | any) => {
        const file = event.target.files[0]
        setImageClone(URL.createObjectURL(file))
        setImageFile(prev => ({...prev, type: file?.type, fileName: file?.name}))
        setOpenCropper(true)
    }

    const themeMode = useAppSelector(state => state.themeReducer.mode)
    const [editMode, setEditMode] = useState(false)
    const [openCropper,setOpenCropper] = useState<boolean>(false)
    const [imageClone, setImageClone] = useState<any>(null)
    const [imageFile, setImageFile] = useState<{type:string,fileName:string}>({
        type:"",fileName:""
    })
    const [paperData] = useState<{typeID: number | null, paperName: string}>({typeID: 0,paperName: "user_actions"})
    const formik = useFormik<FormikTypes>({
        initialValues: {
            user_email: userData.user_email || '', 
            user_name: userData.user_name|| ''
        }, 
        validationSchema: Yup.object().shape({
            user_name: Yup.string().required(t('usrNameRequired')).min(3, t('exactUsrNameDigit')),
            user_email: Yup.string()
        }), 
        enableReinitialize:true, // note: used to reinitialize when initialvalues change
        onSubmit: async (values:FormikTypes) => {
            try {
                const { user_name, user_email } = values
                const data = {
                    userName: user_name,
                    userEmail: user_email,
                }
                // console.log('userGuid', userGuid)
                const response: any = await updateUser({id: userGuid, data})
                if(response.status===200){
                    onSuccess(values)
                    setEditMode(false)
                    toast.success(t('successfullyEditedUser'))
                }
    
            } catch (error) {
                if(error instanceof AxiosError){
                    if(error.response){
                        if(error.response.data){
                            toast.error(t(error.response.data.message))
                        }
                    }
                }
            }
        }
    })

    const materialTable = useMemo(() => {
        return (
            <MaterialTable 
                show
                setShow={() => {}}
                data={userActions?.data}
                isLoading={userActions?.loading}
                paperData={paperData}
                translation={t}
                tableName={{label: t('actions'), value: 'actions'}}
                enableStickyHeader
                density={'compact'}
                heightToExtract='370'
                columnSize={50}
            />
        )
    }, [userActions])

    const cropper = useMemo(() => {
        return (
            <ImageCropper 
                show={openCropper}
                setShow={setOpenCropper}
                image={imageClone}
                imageFile={imageFile}
                translate={t}
                inputRef={inputRef}
                onSuccess={async formData => {
                    try {
                        const response = await axiosInstance({
                            method: 'POST', 
                            url: `user/user-avatar-upload?user_guid=${userGuid}`, 
                            data: formData, 
                            headers: {
                                'Authorization': 'Bearer ' + authToken(),
                                'Content-type': 'multipart/form-data', 
                            }
                        })
                        console.log('response from server', response)
                        if(response.status==200)
                            onUpload()
                    } catch (error) {
                        console.log('error', error) 
                    }
                }}
                params={{
                    width: 250, 
                    height: 250,
                    border: 20
                }}
            />
        )
    }, [openCropper])

    useEffect(() => {
        if(!showSideabar&&editMode)
            setEditMode(false)
    }, [showSideabar])

  return (
    <>
        {cropper}
        <div className={styles.profile}>
            <div className={styles.profile__form}>
                <div className={styles.user__img}>
                    <div className={styles.img__part}>
                            <div onClick={() => {
                                if(!avatar.endsWith('tuat.png'))
                                    onDelete(userGuid)
                            }}><i className='bx bx-trash' ></i></div>
                            <img src={avatar} alt="user avatarik" width={100} height={100} />
                    </div>
                    <label htmlFor='userImg' className={styles.user_upload}>
                        <i className='bx bx-cloud-upload' ></i>
                    </label>
                    <input ref={inputRef} id='userImg' type='file' onClick={(e:any) => e.target.value = ''} className={styles.img__upload__btn} onChange={handleUploadImage}/>
                </div>
                <div className={styles.user__info}>
                    <form onSubmit={formik.handleSubmit} className={styles.the__form}>
     
                        <div>
                            <div className={styles.profile__item}>
                                <h4 className={styles.inputLabel}>{t('userName')}</h4>
                                <div>
                                    <Input 
                                        type='text'
                                        placeholder='Username'
                                        name='user_name'
                                        autoComplete='off'
                                        value={formik.values.user_name}
                                        onChange={e => {
                                            formik.handleChange(e);
                                            formik.setFieldTouched('user_name', false, false)
                                        }}
                                        onBlur={formik.handleBlur}
                                        disabled={!editMode}
                                        className={cx({
                                            inputStyle: true,
                                            field: editMode,
                                            set_color_blackish: editMode && themeMode==='theme-mode-dark'
                                        })}
                                    />
                                    <div>
                                        {
                                        formik.errors.user_name && formik.touched.user_name ? 
                                        <div className={styles.error}>{formik.errors.user_name}</div> 
                                        : null
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className={styles.profile__item}>
                                <h4 className={styles.inputLabel}>{t('email')}</h4>
                                <div>
                                    <Input 
                                        type='email'
                                        placeholder='Email'
                                        name='user_email'
                                        autoComplete='off'
                                        value={formik.values.user_email}
                                        onChange={e => {
                                            formik.handleChange(e);
                                            formik.setFieldTouched('user_email', false, false)
                                        }}
                                        onBlur={formik.handleBlur}
                                        disabled={!editMode}
                                        className={cx({
                                            inputStyle: true,
                                            field: editMode,
                                            set_color_blackish: editMode && themeMode==='theme-mode-dark'
                                        })}
                                    />

                                    <div>
                                        {
                                            formik.errors.user_email && formik.touched.user_email ? 
                                            <div className={styles.error}>{formik.errors.user_email}</div> 
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className={styles.profile__item}>
                                <h4 className={styles.inputLabel}>{t('phone')}</h4>
                                <div className={styles.userLogin}>
                                    {userData.user_login}
                                </div>
                            </div>
                        
                        </div>

                        <div className={styles.actions}>
                            {
                                editMode ? 
                                <>
                                    <>
                                        <img src={cancel} width={30} height={30} title='cancel' 
                                            onClick={() => {
                                                setEditMode(false);
                                                resetFormikValue(formik.initialValues,userData,formik.setFieldValue,formik.setFieldTouched) 
                                            }}
                                        />
                                    </>
                                    <button title='save' type='submit' style={{background: 'transparent'}}>
                                        <img src={save}/>
                                    </button>
                                </> : 
                                <div title='edit' onClick={() => setEditMode(true)}>
                                    <img src={edit}/>
                                </div>
                            }
                        </div>
                       
                    </form>
                </div>
            </div>
            <div className={styles.user_actions_table}>
                {materialTable}
            </div>
        </div>


      
    </>
  )
}


export default UserProfile



    // const ValidationSchema = Yup.object().shape({
    //     user_name: Yup.string().required(t('usrNameRequired')).min(3, t('exactUsrNameDigit')),
    //     user_email: Yup.string()
    //     // const phoneNumberRegex = new RegExp(/^\+9936[1-5]/)
    //     // user_login: Yup.string().required(t('phoneRequired')).matches(phoneNumberRegex, t("onlyDigit")).min(12, t('exactDigit')).max(12, t('exactDigit')),
    // })


// <Formik initialValues={initialValues} validationSchema={ValidationSchema} onSubmit={onSubmit}>
//                 {({values, handleChange, setFieldValue, setFieldTouched, errors, touched}) => {
//                     console.log('values ', values)
//                     return (
//                         <Form>
//                             <div className={styles.actions}>
                                // {
                                //     editMode ? 
                                //     <>
                                //         <>
                                //             <img src={cancel} width={30} height={30} title='cancel' 
                                //                 onClick={() => {
                                //                     setEditMode(false);
                                //                     resetFormikValue(initialValues,userData,setFieldValue,setFieldTouched) 
                                //                 }}
                                //             />
                                //         </>
                                //         <button title='save' type='submit'>
                                //             <i className='bx bx-save'></i>
                                //         </button>
                                //     </> : 
                                //     <button title='edit' type='button' onClick={() => setEditMode(true)}>
                                //         <i className='bx bx-edit' ></i>
                                //     </button>
                                // }
//                             </div>
                            // <div className={styles.profile__item}>
                            //     <h4 className={styles.inputLabel}>{t('userName')}</h4>
                            //     <div>
                            //         <Input 
                            //             type='text'
                            //             placeholder='Username'
                            //             name='user_name'
                            //             value={values.user_name}
                            //             onChange={e => {
                            //                 handleChange(e);
                            //                 setFieldTouched('user_name', false, false)
                            //             }}
                            //             readOnly={!editMode}
                            //             className={cx({
                            //                 inputStyle: true,
                            //                 field: editMode,
                            //                 set_color_blackish: editMode && themeMode==='theme-mode-dark'
                            //             })}
                            //         />
                            //         <div>
                            //             {errors.user_name && touched.user_name ? <div className={styles.error}>{errors.user_name}</div> : null}
                            //         </div>
                            //     </div>
                            // </div>

                            // <div className={styles.profile__item}>
                            //     <h4 className={styles.inputLabel}>{t('email')}</h4>
                            //     <div>
                            //         <Input 
                            //             type='email'
                            //             placeholder='Email'
                            //             name='user_email'
                            //             value={values.user_email}
                            //             onChange={handleChange}
                            //             readOnly={!editMode}
                            //             className={cx({
                            //                 inputStyle: true,
                            //                 field: editMode,
                            //                 set_color_blackish: editMode && themeMode==='theme-mode-dark'
                            //             })}
                            //         />

                            //         <div>
                            //             {errors.user_email && touched.user_email ? <div className={styles.error}>{errors.user_email}</div> : null}
                            //         </div>
                            //     </div>
                            // </div>


//                         </Form>
//                      )
//                 }}
//             </Formik>
