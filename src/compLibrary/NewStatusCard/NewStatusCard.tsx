import React from "react";
import { useTranslation } from "react-i18next";
// custom styles
import styles from "./NewStatusCard.module.scss";
import classNames from "classnames/bind";
import Paper from "../Paper";

import error from '@app/assets/images/bad-gateway.png'
import Loading from "../SkeletonCard/Loading";
import Button from "../Button/Button";

import { divideNumber } from "@utils/helpers";

type StatusCardProps = {
  icon: string,
  count:number | any,
  title: string,
  style?: React.CSSProperties,
  roundedCard? : string,
  statuses: {loading: boolean, error: boolean},
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
    style,
    roundedCard,
    statuses,
    onClick
  } = props;

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
        {statuses.loading ? <div className={styles.loading}><Loading /></div> : 
          <>
            {!statuses.error && 
              <div className={styles.status_card__icon}>
                  <i className={icon}></i>
              </div>
            }
            <div className={styles.status_card__info}>
              {!statuses.error && <span>{title}</span>}
              <h4 className={styles.number}>
                {
                  statuses.error ? 
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
                  <div className={cx({
                    redify_color: count && count?.toString().split('').includes('-')
                  })}>
                    {count || count === 0? 
                      divideNumber(count) : 
                    !count ? 
                    <div className={styles.noData}>
                      <NoDataIcon/>
                      <h4 className={styles.txt}>{t('no_data')}</h4>
                    </div> : 
                    null
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
