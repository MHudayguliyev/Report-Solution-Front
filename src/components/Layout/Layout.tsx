import React, { ReactNode,useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./Layout.module.scss";

// custom components
import TopNavbar from '@components/TopNavbar/TopNavbar';
import Sidebar from "@components/Sidebar/Sidebar";
import { useAppSelector, useAppDispatch } from "@app/hooks/redux_hooks";
import TopNavbaraction from '@redux/actions/TopnavbarAction'



type LayoutProps = {
   children: ReactNode
}

const cx = classNames.bind(styles)
const Layout = ({ children }: LayoutProps) => {
   const dispatch = useAppDispatch()
   const scrollableRef:any = useRef(null);
   
   //redux states
   const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
   const layoutScrollRunner = useAppSelector(state => state.topNavbarReducer.layoutScrollRunner)

   useEffect(() => {
      const handleScroll = () => {
         const element = scrollableRef.current;
         if (element) {
            const scrollPosition = element.scrollTop;
            dispatch(TopNavbaraction.setScrollY(scrollPosition))
         }
      };
      const element = scrollableRef.current;
      if (element) 
        element.addEventListener("scroll", handleScroll);
      return () => {
        if (element) 
          element.removeEventListener("scroll", handleScroll);
      };
    }, []);

   useEffect(() => {
      if(layoutScrollRunner.run){
         const element = scrollableRef.current
         element.scrollTop = layoutScrollRunner.position
         dispatch(TopNavbaraction.runLayoutScrollY({state: false, position: 0}))
      }
   }, [layoutScrollRunner])

   return (
      <div className={styles.layout} >
         <div className={styles.sideBar}>
            <Sidebar/>
         </div>
         {
            isOpenSideBar ? <Sidebar /> : ''
         }
         <div className={styles.layoutContent} >
            <TopNavbar/>
            <div ref={scrollableRef} className={styles.layoutPage}>
               {children}
            </div>
         </div>
      </div>
   );
};

export default Layout;