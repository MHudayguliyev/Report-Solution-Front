import React from 'react'
// custom styles
import classNames from 'classnames/bind';
import styles from './Preloader.module.scss';

type PreloaderType = {
    width?: number
    height?: number
}
const cx = classNames.bind(styles)

export default function Preloader(props: PreloaderType) {
    const {width = 40, height = 40} = props

    return (
        <div className={styles.status}>
            <div className={styles.spinner_chase}>
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
            </div>
        </div>
    )
}
