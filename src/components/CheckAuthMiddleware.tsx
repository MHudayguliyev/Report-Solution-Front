import React, { ReactNode, useEffect, useState} from 'react'
import { useMatch, useNavigate } from '@tanstack/react-location'

// styles
import styles from './AuthMiddleware.module.scss'
import { Preloader } from '@app/compLibrary'
import AuthAction from '@redux/actions/AuthAction'
// typed hooks from redux
import { useAppDispatch } from "@app/hooks/redux_hooks";
import { getFromStorage } from '@utils/storage'


type AuthmiddlewareProps = {
    children: ReactNode
 }

const CheckAuthMiddleware = (props: AuthmiddlewareProps) => {
    const {
        children
    } = props

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const match = useMatch()
    const pathname = match.pathname

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        const tokenExpirationDate = getFromStorage('accessTokenExpirationDate')
        if(tokenExpirationDate){
            if(pathname==='/') 
                navigate({to: '/dashboard', replace: true})
        }else {
            navigate({to: '/', replace: true})
            dispatch(AuthAction.setAuth(false))
        }
        setLoading(false)
    }, [])

  return (
    <>
        {loading ? 
            <div className={styles.preloaderWrapper}>
                <Preloader />
            </div>    : 
        <>
            {children}
        </>
    }
    </>
  )
}

export default CheckAuthMiddleware