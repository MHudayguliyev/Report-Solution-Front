import React, { useEffect, useRef, useState } from 'react'
import styles from './Themes.module.scss'
import classNames from "classnames/bind";
import ThemeAction from "@redux/actions/ThemeAction";
import { useAppDispatch } from '@app/hooks/redux_hooks';
import useClickOutside from '@app/hooks/useClickOutsideDropdown';

const cx = classNames.bind(styles);
const mode_settings = [
    {
      id: "light",
      name: "Light",
      background: "light-background",
      class: "theme-mode-light",
    },
    {
      id: "dark",
      name: "Dark",
      background: "dark-background",
      class: "theme-mode-dark",
    },
  ];
  
  const color_settings = [
    {
      id: "blue",
      name: "Blue",
      background: "blue-color",
      class: "theme-color-blue",
    },
    // {
    //   id: "red",
    //   name: "Red",
    //   background: "red-color",
    //   class: "theme-color-red",
    // },
    {
      id: "cyan",
      name: "Purple",
      background: "cyan-color",
      class: "theme-color-cyan",
    },
    {
      id: "green",
      name: "Green",
      background: "green-color",
      class: "theme-color-green",
    },
    {
      id: "orange",
      name: "Orange",
      background: "orange-color",
      class: "theme-color-orange",
    },
  ];

 const Themes = () => {
    // const [showMenu, setShowMenu] = useClickOutside(menu_ref, menu_toggle_ref)
  
    // const setActiveMenu = () => setShowMenu(true);
    // const closeMenu = () => setShowMenu(false);
  
    const [currMode, setcurrMode] = useState("light");
  
    const [currColor, setcurrColor] = useState("blue");
  
    const dispatch = useAppDispatch();
  
    const setMode = (mode: any) => {
      setcurrMode(mode.id);
      localStorage.setItem("themeMode", mode.id);
      dispatch(ThemeAction.setMode(mode.id));
    };
  
    const setColor = (color: any) => {
      setcurrColor(color.id);
      localStorage.setItem("colorMode", color.class);
      dispatch(ThemeAction.setColor(color.class));
    };
  
    useEffect(() => {
      const themeClass = mode_settings.find(
        (e) => e.id === localStorage.getItem("themeMode")
      );
  
      const colorClass = color_settings.find(
        (e) => e.class === localStorage.getItem("colorMode")
      );
  
      if (themeClass !== undefined) setcurrMode(themeClass.id);
  
      if (colorClass !== undefined) setcurrColor(colorClass.id);
    }, []);
  return (
    <>
         <div className={styles.theme_menu__select}>
              <span>Choose mode</span>
              <ul className={styles.mode_list}>
                {mode_settings.map((item, index) => (
                  <li key={index} onClick={() => setMode(item)}>
                    <div
                      className={
                        cx({
                          mode_list__color: true,
                          [`${item.background}`]: true,
                          colorActive: item.id === currMode
                        })
                      }>
                      <i className="bx bx-check"></i>
                    </div>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.theme_menu__select}>
              <span>Choose color</span>
              <ul className={styles.mode_list}>
                {color_settings.map((item, index) => (
                  <li key={index} onClick={() => setColor(item)}>
                    <div
                      className={
                        cx({
                          mode_list__color: true,
                          [`${item.background}`]: true,
                          colorActive: item.id === currColor
                        })
                      }
                    >
                      <i className="bx bx-check"></i>
                    </div>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
    </>
  )
}

export default Themes