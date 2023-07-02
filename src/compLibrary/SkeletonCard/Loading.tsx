import React, { CSSProperties } from 'react'
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import styles from './Loading.module.scss'

type SkeletonProps = {
    width?: number, 
    height?: number,
    style?: CSSProperties
    className?: string | any
}

const Loading = (props: SkeletonProps) => {
    const {
        width,
        height,
        style,
        className
    } = props

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.loader}>
        <div className={styles.loader__dot}></div>
        <div className={styles.loader__dot}></div>
        <div className={styles.loader__dot}></div>
        <div className={styles.loader__dot}></div>
        <div className={styles.loader__dot}></div>
        <div className={styles.loader__dot}></div>
      </div>
    </div>
  )
}



export default Loading