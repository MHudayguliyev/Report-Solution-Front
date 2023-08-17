import React, { useState, useRef, useEffect,useImperativeHandle  } from 'react';
import { useNavigate } from '@tanstack/react-location';
import languages from "@app/assets/JsonData/language";
/// yup validation
import * as Yup from 'yup'
// styles
import styles from './Auth.module.scss'
import classNames from 'classnames/bind';
import hasabymLogo from '../../assets/images/hasabym.png';
///redux things
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import AuthAction from '@redux/actions/AuthAction'
import FormsAction from '@redux/actions/FormAction';
import Paper from '@app/compLibrary/Paper/Paper'
//// components
import { Dropdown } from '@app/compLibrary';
import { SelectLanuageMenu, UserToggle } from '@app/components/TopNavbar/LanguageDropdown/LanguageDropdown';
import Circles from '@app/compLibrary/Circles/Circles';
import CustomTooltip from '@app/compLibrary/Tooltip/CustomTooltip';
import { Button} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { PinInput } from 'react-input-pin-code';
import { Formik, Form } from 'formik';
/// react icons
import {FiPhone} from 'react-icons/fi';
import {AiOutlineCopyright} from 'react-icons/ai'
import {MdClear} from 'react-icons/md'
import { MdVisibilityOff, MdVisibility } from 'react-icons/md'
/// api fetcher
import { useQuery } from 'react-query';
import { api } from '@api/service/api_helper';
import { AxiosError } from 'axios';
// utils 
import { CheckIfEqual, NoneEmpty, delay, isStrEmpty, setFormikField } from '@utils/helpers';
import { GetUserRoles } from '@api/Queries/Getters'; 
import moment from 'moment';
import { useTranslation } from 'react-i18next';
// react hot toast 
import { toast } from 'react-hot-toast';
// firebase
import { SendOtp, ValidateOtp } from '@app/firebase/services';
// types
import { FormName } from '@app/redux/types/FormTypes';
import { getFromStorage } from '@utils/storage';

const cx = classNames.bind(styles);

const Auth = React.forwardRef((props, ref) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    let recaptureRef: any = useRef(null)
    
    const phoneNumberRegex = new RegExp(/^6\d*$/)
    const userPhone = getFromStorage('user_phone')

    /// queries
    const {
        data: roles
    } = useQuery('getUserRoles', () => GetUserRoles())

    //for redux actions, reducers
    const activeFormName = useAppSelector(state=> state.formsReducer.showForm)

    /// states
    const [formikRef, setFormikRef] = useState<any>({})
    const [checkPhone, setCheckPhone] = useState<string>('')
    const [roleGuid, setRoleGuid] = useState<string>('')
    const [inCaseCode, setInCaseCode] = useState<string>('')
    const [pins, setPins] = useState(['', '', '', '', '', ''])
    const [forgotPassActive, setForgotPassActive] = useState<boolean>(false)
    const [submit, setSubmit] = useState(false)
    const [toastMessage, setToastMessage] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false)
    const [isError, setIsError] = useState(false)
    const [final, setfinal] = useState<any>();
    const [appVerifier, setAppVerifier] = useState<any>(null);
    const [timer, setTimer] = useState(59);


    const mask = '+993'
    const initialValues = {
        phoneNumber: '',
        password: '',
        username: '',
        email: '',
        address: '',
        firmName: '',
        newPassword: '',
        confirmPass: '',
    }

    useImperativeHandle(ref, () => ({
        submitForm() {
          formikRef.current.submitForm();
        },
        resetForm() {
          formikRef.current.resetForm();
        }
      }));
    

    useEffect(() => {
        if(userPhone !== null)
            formikRef.current.setFieldValue('phoneNumber', userPhone)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeFormName === 'verification') setTimer(timer === 0 ? 0 : timer - 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });


    useEffect(() => {
        console.log('activeFormName', activeFormName)
        setTimer(59) /// defaults to 1min
        setSubmit(false)
        setToastMessage("")
        

        if(pins){
            setPins(['','','','','',''])
            setIsError(false)
        } else if (submit && !pins)
            setIsError(true)

        if(
            (activeFormName==='phone' && checkPhone) || 
            (activeFormName==='register' && checkPhone) || 
            (activeFormName==='login' && checkPhone)
        )
            setFormikField('phoneNumber',checkPhone,formikRef)
        if(activeFormName !== 'verification' && isStrEmpty(inCaseCode))
            setInCaseCode("")
        
    },[activeFormName, forgotPassActive])

    useEffect(() => {
        if(pins && !NoneEmpty(pins)) setIsError(false)
    }, [pins])

    const activeForm = (value: FormName) => {
        dispatch(FormsAction.setForm(value))
    }

    
    const ValidationSchema = {
        LoginValidation: Yup.object().shape({
            phoneNumber: Yup.string().matches(phoneNumberRegex, t("onlyDigit")).min(8, t('exactDigit')).max(8, t('exactDigit')).typeError(t('validPhone')).required(t('requiredField')),
            password: Yup.string().min(5, t('passwordMin')).required(t('requiredField')),
        }),
        RegisterValidation: Yup.object().shape({
            username: Yup.string().min(3, t('nameMin')).required(t('requiredField')),
            email: Yup.string().email(t('email')).nullable()
        }),
        PasswordValidation: Yup.object().shape({
            newPassword: Yup.string().min(5, t('passwordMin')).max(20, t('exactDigit')).required(t('requiredField')),
            confirmPass: Yup.string().min(5, t('passwordMin')).max(20, t('exactDigit')).required(t('requiredField')),
        }),
        VerifyPhoneValidation: Yup.object().shape({
            phoneNumber: Yup.string().matches(phoneNumberRegex, t("onlyDigit")).min(8, t('exactDigit')).max(8, t('exactDigit')).typeError(t('validPhone')).required(t('requiredField')),
        })
        
    }

    const Login: any = async (values: any, { resetForm }: any) => {
        setSubmit(true)
        const data = {
            phoneNumber: mask.concat(values.phoneNumber),
            password: values.password
        }
        try {
            const res:any = await api.post({url: 'auth/login', data})
            if (res.status === 200) {
                if (res.data && !res.data.is_user_confirm) {
                    activeForm('register')
                }else {
                    console.log("data.phoneNumber", data.phoneNumber)
                    localStorage.setItem(
                        'authUser',
                        JSON.stringify({
                            access_token: res.accessToken,
                            role_name: res.data.role_name,
                            user_name: res.data.user_name,
                            user_guid: res.data.user_guid,
                            user_phone: data.phoneNumber.substring(4),
                            accessTokenExpirationDate: moment(new Date()).add(1, 'week').format("YYYY-MM-DD HH:mm:ss")
                        })
                    )
                    dispatch(AuthAction.setAuth(true))
                    resetForm()
                    navigate({ to: '/dashboard', replace: true })
                    setSubmit(false)
                }
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    if (error.response.data) {
                        delay(2000).then(() => {
                            setToastMessage(t(error.response.data))
                            setSubmit(false)
                        })
                    }
                }
            }
        }
    }

    const Register: any = async (values: any, { resetForm }: any) => {
        setSubmit(true)
        if (!roleGuid) {
            return setTimeout(() => {
                    setToastMessage(t('selectYourRole'))
                    setSubmit(false)
                }, 2000);
        }
        try {
            const phone = mask.concat(values.phoneNumber)

            const data = {
                userName: values.username,
                userEmail: values.email,
                roleGuid
            }
            const res: any = await api.put({url: `auth/register/${phone}`, data})  // regsiters only already pre regsitered user
            if (res.status === 200) {
                setToastMessage(res.message)
                setRoleGuid('')
                localStorage.setItem(
                    'authUser',
                    JSON.stringify({
                        access_token: res.accessToken,
                        role_name: res.data.role_name,
                        user_name: res.data.user_name,
                        user_guid: res.data.user_guid,
                        user_phone: phone.substring(4),
                        accessTokenExpirationDate: moment(new Date()).add(1, 'week').format("YYYY-MM-DD HH:mm:ss")
                    })
                )
                dispatch(AuthAction.setAuth(true))
                resetForm()
                navigate({ to: '/dashboard', replace: true })
                setSubmit(false)
            }

        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    if (error.response.data) {
                        setTimeout(() => {
                            setToastMessage(t(error.response.data))
                            setSubmit(false)
                          }, 2000);
                    }
                }
            }
            console.log(error)
        }
    }

    const ValidatePassword: any = async (values: any) => {
        const { newPassword, confirmPass } = formikRef.current.values

        let res: any;
        setSubmit(true)
        try {
            if(!CheckIfEqual(confirmPass, newPassword)) {
                return delay(2000).then(() => {
                    setToastMessage(t('passIncorrect'))
                    setSubmit(false)
                })
            }
            const data = {password: newPassword,phoneNumber: mask.concat(checkPhone)}

            if (forgotPassActive) {
                // res = await Put(`auth/update-password`, data) // 204
                res = await api.put({url: 'auth/update-password', data})// 204
            } else {
                res = await api.post({url: 'auth/pre-register', data})// 200
            }
            if (res.status === 200) {
                activeForm(forgotPassActive ? 'login' : 'register' )
            } else if (res.status === 204) {
                setToastMessage(t(res.message))
                activeForm('login')
                setForgotPassActive(false)
                setSubmit(false)
            }

        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    if (error.response.data) {
                        delay(2000).then(() => {
                            setToastMessage(t(error.response.data))
                            setSubmit(false)
                        })
                    }
                }
            }
            // console.log(error)
        }
    }

    const VerifyPhone: any = async (values: any) => {
        setSubmit(true)
        const phone = mask.concat(values.phoneNumber)
        try {

            if(forgotPassActive){
                /// password reset
                // const userFound = await Get<any>(`general/check-user/${phone}`)
                const userFound = await api.get<any>({url: `general/check-user/${phone}`})
                if(userFound.status===200){
                    const sent = await SendOtp(phone, recaptureRef)
                    if(!sent.success){
                        // const justInCaseCode = await Get<string>('auth/generate-code')
                        const justInCaseCode = await api.get<string>({url: 'auth/generate-code'})
                        setInCaseCode(justInCaseCode)
                    }else {
                        setfinal(sent.result)
                        setAppVerifier(sent.verify)
                        toast.success(t('codeSent') + ': ' + phone,{duration: 5 * 1000})
                    }
                    activeForm('verification')
                    setToastMessage("")
                }
            }else {
                /// register goes here
                // const userExists = await Get<any>(`general/check-user/${phone}`)
                const userExists = await api.get<any>({url: `general/check-user/${phone}`})
                if(userExists.status===200){
                    activeForm(activeFormName)
                    setToastMessage(t(userExists.message))
                }
            }
            setCheckPhone(values.phoneNumber)
            delay(2000).then(() => setSubmit(false))

        } catch (error) {

            if(error instanceof AxiosError){
                if(error.response?.status===404){
                    if(forgotPassActive){
                        /// reset password error
                        activeForm(activeFormName)
                        setToastMessage(t(error.response.data.message))
                    }else {
                        //// register error
                        const sent = await SendOtp(phone, recaptureRef)
                        if(!sent.success){
                            const justInCaseCode = await api.get<string>({url: 'auth/generate-code'})
                            setInCaseCode(justInCaseCode)
                        }else {
                            setfinal(sent.result)
                            setAppVerifier(sent.verify)
                            toast.success(t('codeSent') + ': ' + phone,{duration: 5 * 1000})
                        }
                        activeForm('verification')
                        setToastMessage("")
                    }
                    setCheckPhone(values.phoneNumber)
                    delay(2000).then(() => setSubmit(false))
                }
            }
        }
    }

    const resendCode: any = async () => {
        // if(appVerifier && recaptureRef.current){
        //     const reset = await resetCaptcha(appVerifier, recaptureRef)
        //     if(reset){
                setTimer(59)
                const phone = mask.concat(checkPhone)
                const sent = await SendOtp(phone, recaptureRef)
                if(!sent.success){
                    const justInCaseCode = await api.get<string>({url: 'auth/generate-code'})
                    setInCaseCode(justInCaseCode)
                }else {
                    setfinal(sent.result)
                    setAppVerifier(sent.verify)
                    activeForm(activeFormName)
                    toast.success(t('codeSent') + ': ' + phone, {
                        duration: 5 * 1000
                    })
                }
        //     }
        // }
    }


    const login = (
        <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={ValidationSchema.LoginValidation} onSubmit={Login}>
        {({values, setFieldValue, setFieldTouched, handleChange, errors, touched}) => (
             <Form className={styles.formItems}>
                 <div className={styles.relativeContainer}>
                    <span className={styles.mask}>+993</span>
                        <input 
                            autoComplete='off'
                            maxLength={8}
                            minLength={8}
                            autoFocus={userPhone===null}
                            id="loginPhone" 
                            name='phoneNumber' 
                            value={values.phoneNumber}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('phoneNumber', false, false)
                            }} 
                            placeholder={t('phone_number')} 
                            type='text'
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                            }}
                            className={styles.withMask}
                        />
                        <span className={styles.clearBtn} onClick={() => {setFieldValue("phoneNumber", "") }}>{
                            values.phoneNumber?.length > 0 ? 
                            <MdClear size={20} color='#455560'/> : null
                        }</span>
                 </div>
                 <div className={styles.errorContainer}>
                    { errors.phoneNumber && touched.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
                 </div>
                <div className={styles.relativeContainer}>
                    <input 
                        autoComplete='off'
                        autoFocus={userPhone!==null}
                        minLength={5}
                        maxLength={20}
                        id="loginPassword" 
                        name='password'
                        value={values.password}
                        onChange={e => {
                            handleChange(e);
                            setFieldTouched('password', false, false)
                        }} 
                        placeholder={t('password')}
                        type={showPassword ? 'text' : 'password'} 
                        className={cx({showPass: true})}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className={styles.eye}>
                        {
                            showPassword ? <MdVisibilityOff color='#455560' size={20} /> : <MdVisibility color='#455560' size={20} />
                        }
                    </span>
                </div>
                <div className={styles.errorContainer}>
                    {errors.password && touched.password && <div className={styles.error}>{errors.password}</div>}
                </div>
                    <Button 
                    disabled={submit}
                    variant="contained" 
                    type='submit' 
                    color="primary" 
                    className={styles.submitBtn} 
                    >
                        <span>{t('submit')}</span>
                </Button>
             </Form>
        )}
     </Formik>
    )
    const register = (
        <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={ValidationSchema.RegisterValidation} onSubmit={Register}>
           {({values,setFieldValue,setFieldTouched,handleChange,errors,touched}) => (
                <Form className={styles.formItems}>
                    <div className={styles.relativeContainer}>
                        <input 
                            autoComplete='off'
                            id="username" 
                            name='username'
                            value={values.username}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('username', false, false)
                            }} 
                            placeholder={t('userName')} 
                            type="text" 
                        />
                        <span className={styles.clearBtn} onClick={() => setFieldValue("username", "")}>{
                            values.username.length > 0 ? 
                            <MdClear size={20} color='#455560'/> : null
                        }</span>
                    </div>
                    <div className={styles.errorContainer}>
                        {errors.username && touched.username ? <div className={styles.error}>{errors.username}</div> : null}
                    </div>
                   <div className={styles.relativeContainer}>
                        <input 
                            autoComplete='off'
                            id="email" 
                            name='email'
                            value={values.email}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('email', false, false)
                            }} 
                            placeholder="Email" 
                            type="email" 
                        />
                        <span className={styles.clearBtn} onClick={() => setFieldValue("email", "")}>{
                            values.email.length > 0 ? 
                            <MdClear size={20} color='#455560'/> : null
                        }</span>
                   </div>
                    <div className={styles.errorContainer}>
                        {errors.email && touched.email ? <div className={styles.error}>{errors.email}</div> : null}
                    </div>
                   <div className={styles.dropwDownRole}>
                        <select onChange={(e: any) => setRoleGuid(e.target.value as string)}>
                            <option></option>
                            {roles && roles?.map((item: any, i: number) => (
                                <option value={item.role_guid} key={i}>{item.role_name}</option>
                            ))}
                        </select>
                   </div>
                   <div className={styles.errorContainer}/>
                    <Button 
                        disabled={submit} 
                        variant="contained" 
                        type='submit' 
                        color="primary" 
                        className={styles.submitBtn}
                    >
                        <span>{t('register')}</span>
                    </Button>
                </Form>
           )}
        </Formik>
    )
    const password = (
        <Formik innerRef={formikRef} validateOnChange={false} initialValues={initialValues} validationSchema={ValidationSchema.PasswordValidation} onSubmit={ValidatePassword}>
           {({values, setFieldTouched, handleChange, errors, touched}) => (
               <Form className={styles.formItems}>
                   <div className={styles.relativeContainer}>
                        <input 
                            autoFocus
                            autoComplete='off'
                            maxLength={20}
                            id="new_password" 
                            name='newPassword' 
                            value={values.newPassword} 
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('newPassword', false, false)
                            }} 
                            placeholder={t('new_pass')} 
                            type={showPassword ? 'text' : 'password'} 
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className={styles.eye}>
                            {
                                showPassword ? <MdVisibilityOff color='#455560' size={20} /> : <MdVisibility color='#455560' size={20} />
                            }
                        </span>
                   </div>
                   <div className={styles.errorContainer}>
                        { errors.newPassword && touched.newPassword && <div className={styles.error}>{errors.newPassword}</div>}
                    </div>
                   <div className={styles.relativeContainer}>
                        <input 
                            autoComplete='off'
                            id="conf_password" 
                            maxLength={20}
                            name='confirmPass' 
                            value={values.confirmPass}
                            onChange={e => {
                                handleChange(e);
                                setFieldTouched('confirmPass', false, false)
                            }} 
                            placeholder={t('conf_pass')} 
                            type={showConfPassword ? 'text' : 'password'} 
                        />
                        <span onClick={() => setShowConfPassword(!showConfPassword)} className={styles.eye}>
                            {
                                showConfPassword ? <MdVisibilityOff color='#455560' size={20} /> : <MdVisibility color='#455560' size={20} />
                            }
                        </span>
                   </div>
                   <div className={styles.errorContainer}>
                        {errors.confirmPass && touched.confirmPass && <div className={styles.error}>{errors.confirmPass}</div>}
                    </div>
                    <Button 
                        disabled={submit} 
                        variant="contained" 
                        type='submit' 
                        color="primary" 
                        className={styles.submitBtn}
                    >
                        <span>{t('next')}</span>
                    </Button>
               </Form>
           )}
        </Formik>
    )
    const verification = (
                <>
                <div className={styles.relativeContainer}>
                        <PinInput
                            autoFocus
                            onChange={(value, index, values) => {setPins(values)}}
                            values={pins}
                            placeholder='-'
                            inputClassName={cx({
                                pinField: true,
                            })}
                            containerStyle={{width: '100%'}}
                            inputStyle={{textIndent: '0', boxShadow: 'none', border: `${isError ? '1px solid red' : 'red'}`}}
                        />
                    </div>
                    <div className={styles.errorContainer} />
                    <Button 
                        disabled={submit}
                        variant="contained" 
                        color="primary"
                        type='submit' 
                        className={styles.submitBtn}
                        onClick={async() => {
                            if(isError){
                                setPins(['','','','','',''])
                            } else {



                                if(!isStrEmpty(inCaseCode)){  // real firebase otp validation
                                    const validated: any = await ValidateOtp(final, pins)
                                    if(validated.success){
                                        if(isError)
                                            setIsError(false)
                                        activeForm('password')
                                        setPins(['', '', '', '', '',''])
                                    }else {
                                        activeForm(activeFormName)
                                        setSubmit(false)
                                        setIsError(true)
                                    }
                                }else {  /// validation with just in case code. In case firebase otp error

                                    const usrCode = [...inCaseCode.toString()]
                                    let count = 0;
                                    if(NoneEmpty(pins)){
                                        for (let i=0; i <= pins.length; i++) {
                                            if(pins[i] === usrCode[i]){
                                                count += 1
                                            }
                                        }
                                        if(count - 1 === usrCode.length){
                                            if(isError) setIsError(false)
                                            activeForm('password')
                                            setPins(['', '', '', '', '', ''])
                                        }else {
                                            activeForm(activeFormName)
                                            setSubmit(false)
                                            setIsError(true)
                                            count = 0;
                                        }
                                    }
                                }



                            }
                        }}
                    >
                    {isError ? 
                      <h4>{t('clearAll')}</h4> :
                      <h4>{t('next')}</h4> 
                    }
                    </Button>
                </>
    )
    const phone = ( 
        <Formik innerRef={formikRef} validateOnChange={false} initialValues={initialValues} validationSchema={ValidationSchema.VerifyPhoneValidation} onSubmit={VerifyPhone}>
          {({values, setFieldValue, setFieldTouched, handleChange, errors, touched}) => (
            <Form className={styles.formItems} >
                <div className={styles.relativeContainer}>
                    <span className={styles.mask}>+993</span>
                    <input 
                        autoComplete='off'
                        id="phone" 
                        maxLength={8}
                        minLength={8}
                        name='phoneNumber' 
                        value={values.phoneNumber}
                        onChange={e => {
                            handleChange(e);
                            setFieldTouched('phoneNumber', false, false)
                        }} 
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                        }}
                        placeholder={t('phone_number')} 
                        type="text" 
                        className={styles.withMask}
                    />
                    <span className={styles.clearBtn} onClick={() => setFieldValue("phoneNumber", "")}>
                        {values.phoneNumber.length > 0 ? 
                        <MdClear size={20} color='#455560'/> 
                        : null}
                    </span>
                </div>
                <div className={styles.errorContainer}>
                   {errors.phoneNumber && touched.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div> }
                </div>
                <Button 
                disabled={submit}
                type="submit" 
                variant="contained" 
                color="primary"
                id='sign-in-button' 
                className={styles.submitBtn}
                >
                    <span>{t('send_code')}</span>
                </Button>
            </Form>
          )}
        </Formik>
    )

    const renderBody = (item: string) => {
        switch (item) {
            case 'login':
                return login
            case 'register':
                return register
            case 'password':
                return password
            case 'verification':
                return verification
            case 'phone':
                return phone
            default:
                return login
        }
    }


    const commentSection = (
        <div className={styles.comment}>
            {(() => {
                switch(activeFormName) {
                    case 'login':
                        return toastMessage && !submit ? <h4 className={styles.toastMsg}>{toastMessage}</h4> : submit && <CircularProgress color="primary" className={styles.loadingTxt}/>
                    case 'register':
                        return toastMessage && !submit ? <h4 className={styles.toastMsg}>{toastMessage}</h4> : submit && <CircularProgress color="primary" className={styles.loadingTxt}/>
                    case 'phone':
                        return <>
                            {
                                toastMessage && !submit ? <h4 className={styles.toastMsg}>{toastMessage}</h4>  : 
                                submit ? <CircularProgress color="primary" className={styles.loadingTxt}/> :
                                forgotPassActive ?  t('forgotPassComment') :  t('registerComment')
                            }
                        </>
                    case 'verification': 
                        return <>
                        <span className={styles.back} onClick={async () => {
                            activeForm('phone')
                        }}>Yza gaytmak</span>
                        { 
                            timer === 0 ? <h4 onClick={resendCode}>{t('send_again')}</h4> : 
                            <>
                                <h4>00 : {timer}</h4>
                            </>
                        }
                        </>
                    case 'password': 
                        return <>
                        {
                            toastMessage && !submit ?  <h4 className={styles.toastMsg}>{toastMessage}</h4> : submit && <CircularProgress color="primary" className={styles.loadingTxt}/>
                        }
                           
                        </>
                }
            })()}
        </div>
    )

    return (
        <>
            <Circles />
            <div className={styles.authContainer}>
                <Paper rounded className={styles.paper}>
                    <div className={styles.forMobile}>
                        <div className={styles.formHead}>
                            <div className={styles.logo}>
                                <img src={hasabymLogo} alt="Hasabym Logo" width={63} height={70} />
                                <h4 className={styles.logoTxt}>HASABYM</h4>
                            </div>
                            <div className={styles.langDropwdown}>
                                <Dropdown
                                    customToggle={() =>
                                        <UserToggle data={languages} />
                                    }
                                    contentData={languages}
                                    renderItems={(item, index) =>
                                        <SelectLanuageMenu {...item} key={index} />
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.form}>
                            <input defaultChecked={activeFormName === 'login' && !forgotPassActive} id="signin" name="action" type="radio" defaultValue="signin" />
                            <label htmlFor="signin" onClick={() => activeForm('login')}>{t('login')}</label>
                            <input id="signup" name="action" type="radio" defaultValue="signup" />
                            <label htmlFor="signup" onClick={() => {activeForm('phone'), setForgotPassActive(false)}}>{t('signup')}</label>
                            <input id="reset" name="action" type="radio" defaultValue="reset" />
                            <label htmlFor="reset" onClick={() => {activeForm('phone'), setForgotPassActive(true)}}>{t('reset')}</label>
                            <div id="wrapper" className={styles.formBody}>
                                {renderBody(activeFormName)}
                                {commentSection}     
                            </div>
                        </div>

                    </div>
                    <div className={styles.footer}>
                        <div className={styles.footerBody}>
                            <h4>Hasabym Group</h4>
                            <div className={styles.footerItem}>
                                <FiPhone />
                                <h4>+993 65304886</h4>
                            </div>
                        </div>
                        <div className={styles.footerItem}>
                            {    
                            isStrEmpty(inCaseCode) ? 
                                <CustomTooltip content={inCaseCode}>
                                    <AiOutlineCopyright />
                                </CustomTooltip>
                                : 
                                <AiOutlineCopyright />
                            }
                            <h4>Copyright  2023</h4>  
                        </div>
                    </div>
                </Paper>
            </div>
            <div ref={recaptureRef}>
                <div id='recaptcha-container' ></div>
            </div>
        </>
    )
}) 

export default Auth