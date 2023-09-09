import React, {Fragment, CSSProperties} from "react";
// styles
import styles from "./StatusCard.module.scss";
import classNames from "classnames/bind";
//compLibraries
import Paper from "../Paper";
import Button from "../Button";
import { useTranslation } from "react-i18next";
///utils
import { CheckObjOrArrForNull, divideNumber } from "@utils/helpers";
/// icons 
import arrowTop from '@app/assets/customIcons/arrow_top.svg'
import arrowBottom from '@app/assets/customIcons/arrow_bottom.svg'
import equality from '@app/assets/customIcons/equality.svg'
import Loading from "../SkeletonCard/MainLoader";
import SecondLoader from "../SkeletonCard/SecondLoader";

import errorIcon from '@app/assets/images/bad-gateway.png'
import {TbSum} from 'react-icons/tb';
import Nodata from "@icons/Nodataicon/Nodata";
import Framer from "../FramerMotion/Framer";
/// types
import { DashboardDataType, DataKindType, ErrorType, LoadingType } from "@app/redux/types/DashboardTypes";

type StatusCardProps= {
  icon: string
  count:any,
  title: string,
  keyAndHeaders: Array<string>,
  data: DashboardDataType<any>,
  roundedCard?:string,
  className?: string,
  style?: CSSProperties,
  statuses: {loading: LoadingType, error: ErrorType}
  onClick: (dataType: DataKindType) => void 
  /** @defaultValue false **/ 
  switched?: boolean
}

const cx = classNames.bind(styles)

function StatusCard(props: StatusCardProps){
  const {t} = useTranslation()
  const {
    icon,
    title,
    keyAndHeaders,
    data,
    roundedCard,
    className,
    style,
    statuses: {
      loading, error
    },
    switched = false,
    onClick
  } = props;

  const handleErrorClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, dataType: DataKindType) => {
    e.stopPropagation()
    onClick(dataType)
  }


  const emptyCard = (
    <div className={styles.status_card__info} style={{textAlign: 'center'}}>
      {!error.initialData ? <h4 className={styles.txt}>{title}</h4> : ''}
      <div className={styles.status_card__icon} style={{justifyContent: 'center'}}>
        {
          error.initialData ?
          <div className={styles.error__container}>
            <div className={styles.error__img}>
              <img src={errorIcon} alt="Error" />
            </div>
            <div className={styles.error__def}>
              <h4 className={styles.txt}>{title}</h4>
              <div className={styles.reload}>
                <Button roundedSm color="red" className={styles.try_again_btn} onClick={(e) => handleErrorClick(e, 'initialData')}>
                  <i className='bx bx-refresh'></i>
                  <span className={styles.try__again_txt}>{t('try_again')}</span>
                </Button> 
              </div>
            </div>
          </div>
          : 
          <>
            <Framer>
              <Nodata />
            </Framer>
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
          status: true,
          status_card: !error.initialData,
          status_card_error: error.initialData
        })}`} 
        style={style}
        >
              { 
                loading.initialData ? <div className={styles.loading}><Loading /></div> :
                CheckObjOrArrForNull(data.initialData) ?      
                  <>
                  {
                    data.initialData?.map((item: any, i: number) => {
                      const firstCount = item[keyAndHeaders[0]]
                      const secCount = item[keyAndHeaders[1]]
                      const thirdCount = item[keyAndHeaders[2]]
                      return (
                        <Fragment key={i}>
                            <div className={styles.status_card__info}> 
                            <div className={styles.status_card__icon}>
                                <i className='bx bx-purchase-tag'></i>
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
                                      CheckObjOrArrForNull(data.dataToCompare) ? 
                                        <img 
                                          src={
                                            firstCount > data.dataToCompare[i][keyAndHeaders[0]] ? arrowTop : 
                                            firstCount === data.dataToCompare[i][keyAndHeaders[0]] ? equality : arrowBottom
                                          }/> : ""
                                    }
                                  </>
                                  : ""
                                }
                                <h4>{firstCount}</h4>
                            </div>
                            <div className={styles.status_card__icon}>
                              <i className='bx bx-package'></i>
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
                                      CheckObjOrArrForNull(data.dataToCompare) ? 
                                        <img
                                        src={
                                          secCount > data.dataToCompare[i][keyAndHeaders[1]] ? arrowTop : 
                                          secCount === data.dataToCompare[i][keyAndHeaders[1]] ? equality : arrowBottom
                                        }/> : ""
                                    }
                                  </>
                                  : ""
                                }
                              <h4>{secCount}</h4>
                            </div>
                            </div>
                            <div className={styles.status_card__info}>
                              <h4 className={styles.txt}>{title}</h4>
                              <div className={styles.status_card__icon}>
                                <TbSum size={24}/>  
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
                                      CheckObjOrArrForNull(data.dataToCompare) ? 
                                      <img
                                        src={
                                          thirdCount > data.dataToCompare[i][keyAndHeaders[2]] ? arrowTop : 
                                          thirdCount === data.dataToCompare[i][keyAndHeaders[2]] ? equality : arrowBottom
                                        }/> : ""
                                    }
                                  </>
                                  : ""
                                }
                                <h4>{divideNumber(thirdCount)}</h4>
                              </div>
                            </div>
                        </Fragment>
                      )})
                  }
                  </> :
                  <>
                    {emptyCard}
                  </>
              }
      </Paper>
      </>
  );
};

export default StatusCard;
