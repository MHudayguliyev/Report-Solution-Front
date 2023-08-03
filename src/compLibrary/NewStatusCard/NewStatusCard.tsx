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
import Nodata from "@icons/Nodataicon/Nodata";

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
                      <Nodata />
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
