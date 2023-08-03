import React, { CSSProperties, ReactNode, useRef, useState, useEffect } from "react";

// custom hook
import useClickOutsideDropdown from "@hooks/useClickOutsideDropdown";

// custom styles
import styles from "./Dropdown.module.scss";
import className from "classnames/bind";
import { capitalize } from "@utils/helpers";

type SearchValues = {
  label: string
  value: string | number,
  isChecked: boolean
}


interface DropdownProps<T> {
  icon?: string
  badge?: string
  customToggle?: () => ReactNode
  contentData?: Array<T>
  renderItems?: (data: T, index: number) => ReactNode,
  renderBody?: ReactNode,
  renderFooter?: () => ReactNode
  customElement?: () => ReactNode
  onClick?: Function | any
  dropDownContentStyle?: CSSProperties
  /** @default false */
  disabled?: boolean,
  data?: SearchValues[] | any,
  onChange?: any
  clientList?: Array<string>,
  warehouseList?: Array<string>,
  statusList?: Array<string>
  usersList?: Array<string>,
  upPosition?: boolean, 
  /** @default topRight */
  transformOrigin?: 'topRight' | 'topLeft' | 'bottomRight' | "bottomLeft"
  /** @default false */
  removeOutClick?: boolean
}

const cx = className.bind(styles);

function Dropdown<T>(props: DropdownProps<T>) {

  const {
    renderItems,
    renderBody,
    badge,
    contentData,
    customToggle,
    icon,
    renderFooter,
    customElement,
    onClick,
    dropDownContentStyle,
    disabled = false,
    upPosition = false, 
    transformOrigin = 'topRight', 
    removeOutClick = false
  } = props;


  // for dropdown active | deactive
  const dropdown_content_el = useRef(null);
  const toggle_ref = useRef(null);
  const [showDropdown] = useClickOutsideDropdown(dropdown_content_el, toggle_ref, removeOutClick);


  return (
    <div className={styles.dropdown}>
      <button disabled={disabled} className={
        cx({
          dropdown__toggle: true,
          disabled: disabled
        })
      } ref={toggle_ref} onClick={onClick}>
        {icon ? <i className={icon}></i> : ""}
        {badge ? (
          <span className={styles.dropdown__toggle_badge}>{badge}</span>
        ) : ""}
        {customToggle ? customToggle() : ""}
      </button>

      <div ref={dropdown_content_el} style={dropDownContentStyle} className={
        cx({
          dropdown__content: true,
          [`transform${capitalize(transformOrigin)}`]: true, 
          up: upPosition,
          down: !upPosition,
          active: showDropdown
        })
      }>
        {
          customElement ?
            customElement() :
            (contentData && renderItems)
              ? contentData.map((item, index: number) =>
                renderItems(item, index)
              )
              : ""
        }
        {
          renderBody && renderBody
        }
        {
          renderFooter ? (
            <div className={styles.dropdown__footer}>{renderFooter()}</div>
          ) : (
            ""
          )
        }
      </div>
    </div>
  );
};

export default Dropdown;
