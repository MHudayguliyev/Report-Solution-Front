import React, { useEffect, useMemo, useState } from "react";
import { Link, useMatch, useRouter } from "@tanstack/react-location";
// custom styles
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";

// fake data for demonstration
import sidebar_items from "@app/assets/JsonData/sidebar_routes";

// company logo
import logo from "@app/assets/images/logo.png";
// custom components
import SidebarItem from "./SidebarItem/SidebarItem";
// own component library
import { Button } from "@app/compLibrary";
// typed redux hooks
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// action creators
import ThemeAction from "@redux/actions/ThemeAction";
// for translation
import { useTranslation } from "react-i18next";
// types
import { Language } from "@app/Types/Language";
/// redux
import DashboardAction from '@app/redux/actions/DashboardAction'

const cx = classNames.bind(styles);


const Sidebar = () => {
  // getting location
  const {
    state: { location },
  } = useRouter();
  const [own, setOwn] = useState<string>(location.pathname);
  
  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
  const isDtlTblOpen = useAppSelector(state => state.dashboardReducer.isDtlTblOpen)

 
  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }
  const dispatch = useAppDispatch();

  // getting active item and subItem index
  const activeItem = sidebar_items.findIndex((item) => {
    return item.route === location.pathname
  });
 

  // for translation
  const { i18n } = useTranslation();

  const language: Language = i18n.language as Language;
  const match = useMatch();

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebar_menu}>
          {/* Company logo with link to site */}
          <a href="#" target="_blank">
            <div className={styles.sidebar__logoWrapper}>
              <img
                className={styles.sidebar__logo}
                src={logo}
                alt="Company logo"
              />
            </div>
          </a>
          {/* Side bar items */}
          {sidebar_items.map((item, index) => (
            <Link
              style={{ width: "100%" }}
              onClick={() => {
                setOwn(item.route);
                toggleSidebar()
                if(isDtlTblOpen)
                  dispatch(DashboardAction.openDtlTbl(false))
              }}
              to={item.route}
              key={index}
              className={styles.sidebarLink}
            >
              <SidebarItem
                title={item.display_name[language]}
                icon={item.icon}
                // image={item.image && item.image}
                active={index === activeItem}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

