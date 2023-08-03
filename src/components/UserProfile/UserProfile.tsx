import React, { useMemo, useEffect, useState, useRef, } from 'react'
import * as Yup from 'yup'


import { Input } from '@app/compLibrary';
import { Form, Formik } from 'formik';
import { UserList } from '@app/api/Types/queryReturnTypes';
import { resetFormikValue } from '@utils/helpers';
import { useTranslation } from 'react-i18next';
import MaterialTable from '../MaterialTable/MaterialTable';
/// api ref
import { updateUser } from '@app/api/Queries/Post';
/// react hot toast
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
// react selectors/actions
import { useAppSelector } from '@app/hooks/redux_hooks';
import UserAction from '@app/api/Types/queryReturnTypes/UserAction';
/// default logo
import user_image from "@app/assets/images/tuat.png";
import cancel from "@app/assets/customIcons/cancel.png"

//styles 
import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss'
import ImageCropper from '../Modals/ImageCropper/ImageCropper';


type FormikTypes = {
    user_name:string, 
    user_login:string, 
    user_email:string
}
type UserProfileType = {
    userData: UserList,
    userActions: {data: UserAction[], loading: boolean, error: boolean}
    userGuid: string,
    onSuccess: (updValues: FormikTypes) => void
    showSideabar: boolean
}

const cx = classNames.bind(styles)
const UserProfile = (props: UserProfileType) => {
    const {userData, userActions, userGuid, onSuccess, showSideabar} = props
    const {t} = useTranslation()
    const inputRef: any = useRef(null)


    const phoneNumberRegex = new RegExp(/^\+9936[1-5]/)
    const initialValues: FormikTypes = {
        user_name: userData.user_name,
        user_login: userData.user_login,
        user_email: userData.user_email
    }
    const ValidationSchema = Yup.object().shape({
        user_name: Yup.string().required(t('usrNameRequired')).min(3, t('exactUsrNameDigit')),
        user_login: Yup.string().required(t('phoneRequired')).matches(phoneNumberRegex, t("onlyDigit")).min(12, t('exactDigit')).max(12, t('exactDigit')),
        user_email: Yup.string()
    })

    const themeMode = useAppSelector(state => state.themeReducer.mode)
    const [editMode, setEditMode] = useState(false)
    const [openCropper,setOpenCropper] = useState<boolean>(false)
    const [image, setImage] = useState<any>(user_image)
    const [imageClone, setImageClone] = useState<any>(null)
    const [paperData, setPaperData] = useState<{typeID: number | null, paperName: string}>({typeID: 0,paperName: "user_actions"})

    useEffect(() => {
        if(!showSideabar && editMode)
            setEditMode(false)
    }, [showSideabar])


    const handleUploadImage = (event: React.FormEvent<HTMLInputElement> | any) => {
        setImageClone(URL.createObjectURL(event.target.files[0]))
        setOpenCropper(true)
    }


    const onSubmit = (async (values:FormikTypes) => {
        try {
            const { user_name, user_login, user_email } = values
            const data = {
                userName: user_name,
                phoneNumber: user_login, 
                userEmail: user_email,
            }

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
    })

    const materialTable = useMemo(() => {
        return (
            <MaterialTable 
                show
                setShow={() => {}}
                data={userActions?.data??[]}
                isLoading={userActions?.loading??false}
                paperData={paperData}
                translation={t}
                tableName={{label: t('actions')}}
                enableStickyHeader
                density={'compact'}
                heightToExtract='475'
            />
        )
    }, [])

    const cropper = useMemo(() => {
        return (
            <ImageCropper 
                show={openCropper}
                setShow={setOpenCropper}
                image={imageClone}
                translate={t}
                inputRef={inputRef}
                onSuccess={canvas => {
                    setImage(canvas)
                }}
                params={{
                    width: 250, 
                    height: 250,
                    border: 20
                }}
            />
        )
    }, [openCropper])

  return (
    <>
        {cropper}
        <div className={styles.profile}>
            <div className={styles.profile__form}>
                <div className={styles.user__img}>
                    <div className={styles.img__part}>
                            <div onClick={() => setImage(user_image)}><i className='bx bx-trash' ></i></div>
                            <img src={image} alt="" width={100} height={100} />
                    </div>
                    <label htmlFor='userImg' className={styles.user_upload}>
                        <i className='bx bx-cloud-upload' ></i>
                    </label>
                    <input ref={inputRef} id='userImg' type='file' onClick={(e:any) => e.target.value = ''} className={styles.img__upload__btn} onChange={handleUploadImage}/>
                </div>
                <div className={styles.user__info}>
                    <Formik initialValues={initialValues} validationSchema={ValidationSchema} onSubmit={onSubmit}>
                        {({values, handleChange, setFieldValue, setFieldTouched, errors, touched}) => (
                            <Form>
                                <div className={styles.actions}>
                                    {
                                        editMode ? 
                                        <>
                                            {/* <i className='bx bxs-no-entry' 
                                                title='cancel'
                                                onClick={() => {
                                                    setEditMode(false);
                                                    resetFormikValue(initialValues,userData,setFieldValue,setFieldTouched) 
                                                }}
                                            ></i> */}
                                            <>
                                                <img src={cancel} width={30} height={30} title='cancel' 
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        resetFormikValue(initialValues,userData,setFieldValue,setFieldTouched) 
                                                    }}
                                                />
                                            </>
                                            <button title='save' type='submit'>
                                                <i className='bx bx-save'></i>
                                            </button>
                                        </> : 
                                        <button title='edit' type='button' onClick={() => setEditMode(true)}>
                                            <i className='bx bx-edit' ></i>
                                        </button>
                                    }
                                </div>
                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('userName')}</h4>
                                    <div>
                                        <Input 
                                            type='text'
                                            placeholder='Username'
                                            name='user_name'
                                            value={values.user_name}
                                            onChange={e => {
                                                handleChange(e);
                                                setFieldTouched('user_name', false, false)
                                            }}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode,
                                                set_color_blackish: editMode && themeMode==='theme-mode-dark'
                                            })}
                                        />
                                        <div>
                                            {errors.user_name && touched.user_name ? <div className={styles.error}>{errors.user_name}</div> : null}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('phoneNumber')}</h4>
                                    <div>
                                        <Input 
                                            type='text'
                                            placeholder='Phone'
                                            name='user_login'
                                            minLength={12}
                                            maxLength={12}
                                            value={values.user_login}
                                            onChange={e => {
                                                handleChange(e);
                                                setFieldTouched('user_login', false, false)
                                            }}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode,
                                                set_color_blackish: editMode && themeMode==='theme-mode-dark'
                                            })}
                                        />

                                        <div>
                                            {errors.user_login && touched.user_login ? <div className={styles.error}>{errors.user_login}</div> : null}
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
                                            value={values.user_email}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                            className={cx({
                                                inputStyle: true,
                                                field: editMode,
                                                set_color_blackish: editMode && themeMode==='theme-mode-dark'
                                            })}
                                        />

                                        <div>
                                            {errors.user_email && touched.user_email ? <div className={styles.error}>{errors.user_email}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={styles.profile__item}>
                                    <h4 className={styles.inputLabel}>{t('role')}</h4>
                                    {
                                        editMode ?
                                        <div className={styles.dropwDownRole}>
                                        <select onChange={e => {
                                            const target = e.target
                                            const index = target.selectedIndex
                                            const option = target[index]
                                            const child = option.innerHTML 
                                            const guid = target.value
                                            setUserRole(prev => ({...prev, role_guid: guid, role_name: child}))
                                        }}>
                                            {roles && roles?.map((item, i) => (
                                                <option selected={item.role_name===userData.role_name} value={item.role_guid} key={i}>{item.role_name}</option>
                                            ))}
                                        </select>
                                    </div> : 
                                    <span className={styles.role_name}>{userData.role_name}</span>
                                    }
                                       
                                </div> */}

                                {/* {
                                    editMode ?
                                    <div className={styles.submit__btn}>
                                    <Button  
                                        className={styles.child}                                                                   
                                        type="contained"
                                        htmlType='button'          
                                        color="theme"
                                        rounded
                                        // type='button' 
                                        onClick={() => {
                                            setEditMode(false);
                                            resetFormikValue(initialValues,userData,setFieldValue,setFieldTouched) 
                                        }}
                                    >
                                       <span>{t('cancel')}</span> 
                                    </Button>
                                    <Button 
                                        className={styles.child}                                                                   
                                        type="contained" 
                                        htmlType='submit' 
                                        color="theme"
                                        rounded
                                    >
                                        <span>{t('saveNote')}</span>
                                    </Button>
                                    </div> : 
                                    <div className={styles.enableEditBtn}>
                                        <Button 
                                            className={styles.child}                                                                   
                                            type="contained" 
                                            htmlType='button'          
                                            color="theme" 
                                            rounded
                                            onClick={() => setEditMode(true)}
                                        >
                                            <span>{t('edit')}</span>
                                        </Button>
                                    </div>
                                } */}


                            </Form>
                        )}
                    </Formik>
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
