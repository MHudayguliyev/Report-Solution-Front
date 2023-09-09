import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { Button } from "../";

// custom styles
import styles from './Modal.module.scss';
import classNames from "classnames/bind";
// typed redux hooks
import { useAppSelector } from "@app/hooks/redux_hooks";


const cx = classNames.bind(styles);

interface KeyboardEvent {
   key: string;
   preventDefault: Function
}

type ModalProps = {
   isOpen: boolean
   close: Function
   children: ReactNode
   header?: ReactNode
   footer?: ReactNode
   /** @default false */
   fullScreen?: boolean
   /** @default false */
   removePadding?: boolean
   className?: string
   style?: CSSProperties
   styleOfModalBody?:CSSProperties
}
const Modal = (props: ModalProps) => {

   const {
      isOpen,
      close,
      children,
      header,
      footer,
      fullScreen = false,
      removePadding = false,
      className = '',
      style,
      styleOfModalBody
   } = props;

   const themeReducer = useAppSelector((state) => state.themeReducer);

   useEffect(() => {
      if (isOpen)
         document.getElementsByTagName('body')[0].classList.add('modal-opened');
      else
         document.getElementsByTagName('body')[0].classList.remove('modal-opened');
   }, [isOpen])

   // keydown listener for 'escape' key
   useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            event.preventDefault();
            close()
         }
      }
      document.addEventListener('keydown', keyDownHandler);
      return () => {
         document.removeEventListener('keydown', keyDownHandler);
      };
   }, []);

   const modalContent = isOpen ? (
      <div className={
         cx({
            modal: true,
            notFullScreenModal: !fullScreen
         })
      }>
         <div style={style} className={`${className} ${cx({
               modalContent: true,
               modalAnimation: isOpen,
               fullScreen: fullScreen,
               contentPadding: !removePadding
            })}
         `}>
            <div className={styles.modalHeader} style={{ justifyContent: !!header ? 'space-between' : 'flex-end' }}>
               {header}
               <Button type="text"
                  circle
                  onClick={() => close()}>
                  <i className='bx bx-x'></i>
               </Button>
            </div>
            <div style={styleOfModalBody} className={cx({
               modalBody: !removePadding
            })}>
               {children}
            </div>
            <div className={styles.modalFooter}>
               {footer}
            </div>
         </div>
      </div>
   ) : null;

   return ReactDOM.createPortal(
      <div className={`${themeReducer.mode} ${themeReducer.color}`}>
         {modalContent}
      </div>,
      document.getElementById('modal-root')!
   );
}

export default Modal;