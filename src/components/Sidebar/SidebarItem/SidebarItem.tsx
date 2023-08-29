import React from "react";
// custom styles
import styles from "./SidebarItem.module.scss";
import className from "classnames/bind";
import { useAppSelector } from "@app/hooks/redux_hooks";

const cx = className.bind(styles);

type SidebarItemProps = {
  title: string;
  icon: string;
  image?: any;
  svg?: any;
  active: boolean;
};

const SidebarItem = (props: SidebarItemProps): JSX.Element => {
  const { title, icon, active, image,svg } = props;

  const themeMode = useAppSelector(state => state.themeReducer.mode)

  return (
    <div className={styles.sidebar__item}>
      <div
        className={cx({
          sidebar__item_inner: true,
          active: active,
        })}
      >
        {
          image ?
          <img 
            src={image} 
            className={styles.sidebar_item_image}
            alt="sidebar icon" 
            width={29.5} 
            height={29}/> : 
            icon ? <i className={icon}></i> : svg
        }
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};

export default SidebarItem;
