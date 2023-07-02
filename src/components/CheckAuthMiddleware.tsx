import React, { ReactNode, useEffect, useState} from 'react'
import { useMatch, useNavigate } from '@tanstack/react-location'

// styles
import styles from './AuthMiddleware.module.scss'
import { Preloader } from '@app/compLibrary'

type AuthmiddlewareProps = {
    children: ReactNode
 }

const CheckAuthMiddleware = (props: AuthmiddlewareProps) => {
    const {
        children
    } = props

    const navigate = useNavigate()
    const match = useMatch()
    const pathname = match.pathname

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        const tokenExpiredDate = localStorage.getItem('accessTokenExpirationDate')
        if(tokenExpiredDate){
            if(pathname==='/') 
                navigate({to: '/dashboard', replace: true})
        }else navigate({to: '/', replace: true})
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