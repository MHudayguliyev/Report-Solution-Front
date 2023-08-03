import React, { ReactNode, useEffect, useState } from "react"
import Layout from "./Layout/Layout"
import { useNavigate } from "@tanstack/react-location"
// helpers
import Preloader from "@app/compLibrary/Preloader/Preloader"
// custom styles
import styles from './AuthMiddleware.module.scss';
// action creator
import ThemeAction from "@redux/actions/ThemeAction";
// typed hooks from redux
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
import moment from "moment"

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
   const navigate = useNavigate();

   // for controlling theme of application
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
      const tokenExpired = localStorage.getItem('accessTokenExpirationDate')
      if(tokenExpired){
         if(tokenExpired===now){
            localStorage.removeItem('accessTokenExpirationDate');
            localStorage.removeItem('authUser');
            localStorage.removeItem('persist:dashboard')
            localStorage.removeItem('persist:report')
            navigate({ to: '/', replace: true })
         }
      }else navigate({to: '/', replace: true})
      setLoading(false)
   }, []);
   
   return (
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
   )
}

export default Authmiddleware;
