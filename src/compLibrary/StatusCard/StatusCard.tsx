import React, {useState, Fragment, CSSProperties} from "react";
// custom styles
import styles from "./StatusCard.module.scss";
import classNames from "classnames/bind";
import Paper from "../Paper";
import {FcAbout} from "react-icons/fc";
import {TbSum} from 'react-icons/tb';
import noData from '../../assets/customIcons/file-x.svg'
import Loading from "../SkeletonCard/Loading";
import error from '@app/assets/images/bad-gateway.png'
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { divideNumber } from "@utils/helpers";
// import { ReactComponent as NoDataIcon } from '../../assets/customIcons/file-x.svg';
// import { classNames } from 'classnames/bind';

type StatusCardProps = {
  icon: string
  count:any,
  title: string,
  keyAndHeaders: Array<string>,
  data: any,
  roundedCard?:string,
  className?: string,
  style?: CSSProperties,
  statuses: {loading: boolean, error: boolean}
  onClick: () => void 
}

const cx = classNames.bind(styles)

const NoDataIcon = (props : any) =>(
  // <svg xmlns="http://path/to/svg" fill={props.fill} className={props.class}></svg>
  <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#455560" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M9.9 17.1L14 13M9.9 12.9L14 17"/></svg>

)

const StatusCard = (props: StatusCardProps) => {
  const {t} = useTranslation()
  const {
    icon,
    count,
    title,
    keyAndHeaders,
    data,
    roundedCard,
    className,
    style,
    statuses,
    onClick
  } = props;

  const emptyCard = (
    <div className={styles.status_card__info} style={{textAlign: 'center'}}>
      {!statuses?.error ?  <h4 className={styles.txt}>{title}</h4> : ''}
      <div className={styles.status_card__icon} style={{justifyContent: 'center'}}>
        {
          statuses?.error ?
          <div className={styles.error__container}>
            <div className={styles.error__img}>
              <img src={error} alt="Error" />
            </div>
            <div className={styles.error__def}>
              <h4 className={styles.txt}>{title}</h4>
              <div className={styles.reload}>
                <Button roundedSm color="red" className={styles.try_again_btn} onClick={onClick}>
                  <i className='bx bx-refresh'></i>
                  <span className={styles.try__again_txt}>{t('try_again')}</span>
                </Button> 
              </div>
            </div>
          </div>
          : 
          <>
            <NoDataIcon/>
            <h4 className={styles.txt}>{t('no_data')}</h4>
          </>
        }
      </div>
    </div>
  )

  return (
    <>
    
      <Paper 
        topRounded={roundedCard === 'top'} 
        bottomRounded={roundedCard === 'bottom'} 
        rightRounded={roundedCard === 'right'}
        leftRounded={roundedCard === 'left'}
        topLeftRounded={roundedCard === 'topLeft'}
        topRightRounded={roundedCard === 'topRight'}
        bottomLeftRounded={roundedCard === 'bottomLeft'}
        bottomRightRounded={roundedCard === 'bottomRight'}
        className={`${className} ${cx({
          status_card: !statuses.error,
          status_card_error: statuses.error
        })}`} 
        style={style}
        >
              { 
                statuses.loading ? <div className={styles.loading}><Loading /></div> :
                data?.length > 0 ? 
                  data?.map((item: any, i: number) => (
                      <Fragment key={i}>
                          <div className={styles.status_card__info}>
                          <div className={styles.status_card__icon}>
                              <i className='bx bx-purchase-tag'></i>
                              <h4>{item[keyAndHeaders[0]]}</h4>
                          </div>
                          <div className={styles.status_card__icon}>
                            <i className='bx bx-package'></i>
                            <h4>{item[keyAndHeaders[1]]}</h4>
                          </div>
                          </div>
                          <div className={styles.status_card__info}>
                            <h4 className={styles.txt}>{title}</h4>
                            <div className={styles.status_card__icon}>
                                <TbSum size={24}/>  
                                <h4>{divideNumber(item[keyAndHeaders[2]])}</h4>
                            </div>
                          </div>
                      </Fragment>
                  ))
                  :
                <>{emptyCard}</>
              }
      </Paper>
      </>
  );
};

export default StatusCard;
