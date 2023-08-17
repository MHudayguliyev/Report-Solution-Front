import React, { ReactNode, useEffect, useState, useRef } from "react"
import Layout from "./Layout/Layout"
import { useNavigate } from "@tanstack/react-location"
// helpers
import Preloader from "@app/compLibrary/Preloader/Preloader"
// custom styles
import styles from './AuthMiddleware.module.scss';
// action creator
import AuthAction from '@redux/actions/AuthAction'
import ThemeAction from "@redux/actions/ThemeAction";
// typed hooks from redux
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// moment js
import moment from "moment"
// socket context
import SocketContext from "@app/socket/context";
import { ConnectToSocket, SocketType } from "@app/socket/socket";
import { deleteFromStorage, getFromStorage } from "@utils/storage";

type AuthmiddlewareProps = {
   children: ReactNode
   /** @default true */
   withLayout?: boolean
}

const Authmiddleware = (props: AuthmiddlewareProps) => {
   const {
      children,
      withLayout = true
   } = props;

   const [loading, setLoading] = useState(true);
   const [socket, setSocket] = useState<SocketType | any>()
   const navigate = useNavigate();

   const isAuthorized = useAppSelector(state => state.authReducer.isAuthorized)
   const themeReducer = useAppSelector((state) => state.themeReducer);
   const dispatch = useAppDispatch();


   useEffect(() => {
      if (!localStorage.getItem("themeMode")) {
         localStorage.setItem("themeMode", "theme-mode-light")
      }
      if (!localStorage.getItem("colorMode")) {
         localStorage.setItem("colorMode", "theme-color-blue")
      }
      const themeClass: any = localStorage.getItem(
         "themeMode",
      );

      const colorClass: any = localStorage.getItem(
         "colorMode",
      );

      dispatch(ThemeAction.setMode(themeClass));

      dispatch(ThemeAction.setColor(colorClass));
   }, [dispatch]);

   useEffect(() => {
      setLoading(true)
      const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      const tokenExpired = getFromStorage('accessTokenExpirationDate')
      if(tokenExpired){
         if(tokenExpired===now){
            deleteFromStorage()
            dispatch(AuthAction.setAuth(false))
            navigate({ to: '/', replace: true })
         }
      }else {
         deleteFromStorage()
         dispatch(AuthAction.setAuth(false))
         navigate({to: '/', replace: true})
      }
      setLoading(false)
      setSocket(ConnectToSocket())
   }, []);

   return (
      <SocketContext.Provider value={isAuthorized ? socket : null}>
         <div className={`${themeReducer.mode} ${themeReducer.color}`}>
         {
            loading ?
               <div className={styles.preloaderWrapper}>
                  <Preloader />
               </div>
               :
               withLayout ?
                  <Layout>
                     {children}
                  </Layout>
                  :
                  <>
                     {children}
                  </>
         }
      </div>
      </SocketContext.Provider>
   )
}

export default Authmiddleware;
