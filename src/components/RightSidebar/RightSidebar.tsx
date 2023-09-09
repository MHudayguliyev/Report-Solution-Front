import React, { useRef, useState, useEffect, ReactNode } from "react";

// typed redux hook
import useClickOutside from "@app/hooks/useClickOutsideDropdown";

// custom styles
import styles from "./RightSidebar.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


type MenuProps = {
  sidebarName: string,
  children?: ReactNode,
  showMenu?: boolean,
  setShowMenu?: Function | any
  menuRef?: any
}

const RightSidebar = (props: MenuProps) => {
  // const menu_toggle_ref: any = useRef(null);
  // const [showMenu, setShowMenu] = useClickOutside(menu_ref, menu_toggle_ref)
  const {sidebarName, children, showMenu, setShowMenu, menuRef} = props
  return (
    <div>
      <div ref={menuRef} className={
        cx({
          theme_menu: true,
          menuActive: showMenu
        })
      }>
        <h4 className={styles.sidebar_name}>{sidebarName}</h4>
        <button className={styles.theme_menu__close} onClick={() => setShowMenu(!showMenu)}>
          <i className="bx bx-x"></i>
        </button>
        <div className={styles.theme_menu__select}>
            {children}
        </div> 
      </div>
    </div>
  )
}

export default RightSidebar;
