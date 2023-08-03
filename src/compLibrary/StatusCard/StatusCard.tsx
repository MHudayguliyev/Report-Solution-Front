import React, {Fragment, CSSProperties} from "react";
import styles from "./StatusCard.module.scss";
import classNames from "classnames/bind";
import Paper from "../Paper";
import {TbSum} from 'react-icons/tb';
import Loading from "../SkeletonCard/Loading";
import error from '@app/assets/images/bad-gateway.png'
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { divideNumber } from "@utils/helpers";
import Nodata from "@icons/Nodataicon/Nodata";

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
            <Nodata />
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
