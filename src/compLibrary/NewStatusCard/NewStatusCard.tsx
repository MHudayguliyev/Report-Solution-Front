import React from "react";
import { useTranslation } from "react-i18next";
// custom styles
import styles from "./NewStatusCard.module.scss";
import classNames from "classnames/bind";

import Loading from "../SkeletonCard/MainLoader";
import SecondLoader from "../SkeletonCard/SecondLoader";
import Button from "../Button/Button";
import Paper from "../Paper";
/// utils
import { divideNumber, isNegativeNumber } from "@utils/helpers";
// icons
import Nodata from "@icons/Nodataicon/Nodata";
import Framer from "../FramerMotion/Framer";
import errorIcon from '@app/assets/images/bad-gateway.png'
import arrowTop from '@app/assets/customIcons/arrow_top.svg'
import arrowBottom from '@app/assets/customIcons/arrow_bottom.svg'
import equality from '@app/assets/customIcons/equality.svg'
// types 
import { DataKindType, ErrorType, LoadingType } from "@app/redux/types/DashboardTypes";

type StatusCardProps = {
  icon: string,
  data:number | any,
  optionalData?: number | any
  /** @defaultValue false **/
  switched?: boolean
  title: string,
  style?: React.CSSProperties,
  roundedCard? : string,
  statuses: {loading: LoadingType, error: ErrorType},
  onClick: (dataType: DataKindType) => void
}
const cx = classNames.bind(styles)

const StatusCard = (props: StatusCardProps) => {
  const {t} = useTranslation()
  const {
    icon,
    data,
    optionalData, 
    title,
    style,
    roundedCard,
    statuses: {
      loading, error
    },
    onClick, 
    switched = false, 
  } = props;

  const handleErrorClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, dataType: DataKindType) => {
    e.stopPropagation()
    onClick(dataType)
  }

  return (
    <Paper
        topRounded={roundedCard === 'top'} 
        bottomRounded={roundedCard === 'bottom'} 
        rightRounded={roundedCard === 'right'}
        leftRounded={roundedCard === 'left'}
        topLeftRounded={roundedCard === 'topLeft'}
        topRightRounded={roundedCard === 'topRight'}
        bottomLeftRounded={roundedCard === 'bottomLeft'}
        bottomRightRounded={roundedCard === 'bottomRight'}
        className={cx({
          status_card: true, 
          // error: notFound
        })} style={style}>
        {loading.initialData ? <div className={styles.loading}><Loading /></div> : 
          <>
            {!error.initialData && 
              <div className={styles.status_card__icon}>
                  <i className={icon}></i>
              </div>
            }
            <div className={styles.status_card__info}>
              {!error.initialData && <span>{title}</span>}
              <h4 className={styles.number}>
                {
                  error.initialData ? 
                  <div className={styles.error__container}>
                    <div className={styles.error__img}>
                      <img src={errorIcon} alt="Error" />
                    </div>
                    <div className={styles.error__def}>
                      <h4 className={styles.txt}>{title}</h4>
                      <div className={styles.reload}>
                        <Button roundedSm color="red" className={styles.try_again_btn} onClick={e => handleErrorClick(e, 'initialData')}>
                          <i className='bx bx-refresh'></i>
                          <span className={styles.try__again_txt}>{t('try_again')}</span>
                        </Button> 
                      </div>
                    </div>
                  </div>
                  :
                  <div className={cx({
                    count: true, 
                    redify_color: data && isNegativeNumber(data)
                  })}>
                    {
                      data || data === 0? 
                        <>
                          {
                            switched ? 
                            <>
                              {
                                loading.dataToCompare ? 
                                  <span>
                                    <SecondLoader />
                                  </span> : 
                                error.dataToCompare ? 
                                  <span onClick={e => handleErrorClick(e, 'dataToCompare')}>
                                    <i className='bx bx-refresh' style={{fontSize: 25, color: '#EB1D36'}}></i>
                                  </span> : 
                                <>{
                                  optionalData || optionalData===0 ? 
                                  <img 
                                    src={
                                      data > optionalData ? arrowTop :
                                      data === optionalData ? equality : arrowBottom
                                    }/> : ""
                                }</>
                              } 
                            </> 
                            : ""
                          }
                          <>{divideNumber(data) }</>
                        </>
                      : !data ? 
                      <div className={styles.noData}>
                        <Framer>
                          <Nodata />
                        </Framer>
                        <h4 className={styles.txt}>{t('no_data')}</h4>
                      </div> : 
                      ""
                    }
                  </div>
                }
              </h4>
            </div>
          </>
        }
    </Paper>
  );
};

export default StatusCard;
