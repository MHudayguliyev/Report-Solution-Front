import React from 'react';
import styles from './Paper.module.scss';
import classNames from 'classnames/bind';
import { CSSProperties } from 'react';

const cx = classNames.bind(styles);

type PaperProps = {
   children: React.ReactNode
   name?: string
   /** @defaultValue false */
   circle?: boolean
   /** @defaultValue false */
   rounded?: boolean
   /** @defaultValue false */
   topRounded?: boolean
   /** @defaultValue false */
   bottomRounded?: boolean
   /** @defaultValue false */
   leftRounded?: boolean
   /** @defaultValue false */
   rightRounded?: boolean
   /** @defaultValue false */
   topLeftRounded?: boolean
   /** @defaultValue false */
   topRightRounded?: boolean
   /** @defaultValue false */
   bottomLeftRounded?: boolean
   /** @defaultValue false */
   bottomRightRounded?: boolean
   /** @defaultValue false */

   fullWidth?: boolean
   /** @defaultValue false */
   fullHeight?: boolean
   style?: CSSProperties
   className?: string
   removeShadow?: boolean
   containerRef?:any
}

const Paper = (props: PaperProps): JSX.Element => {
   const {
      children,
      name, 
      rounded = false,
      topRounded = false,
      bottomRounded = false,
      leftRounded = false,
      rightRounded = false,
      topLeftRounded = false,
      topRightRounded = false,
      bottomLeftRounded = false,
      bottomRightRounded = false,
      circle = false,
      fullWidth = false,
      fullHeight = false,
      style,
      className = '',
      removeShadow = false, 
      containerRef
   } = props;

   return (
      <div id={name} ref={containerRef} style={style} className={`${className} ${cx({
         paper: true,
         rounded: rounded,
         topRounded: topRounded,
         bottomRounded: bottomRounded,
         leftRounded: leftRounded,
         rightRounded: rightRounded,
         topLeftRounded: topLeftRounded,
         topRightRounded: topRightRounded,
         bottomLeftRounded: bottomLeftRounded,
         bottomRightRounded: bottomRightRounded,
         circle: circle,
         fullWidth: fullWidth,
         fullHeight: fullHeight,
         removeShadow: removeShadow
      })
         }`

      }>
         {children}
      </div >
   )
}

export default Paper;