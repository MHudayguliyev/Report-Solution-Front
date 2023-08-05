import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

import error from '@app/assets/images/bad-gateway.png'

// custom styles 
import styles from './Table.module.scss';
import Loading from "../SkeletonCard/Loading";
import Button from "../Button";
import Nodata from "@icons/Nodataicon/Nodata";
import Framer from "../FramerMotion/Framer";


interface TableProps<T> {
  headData?: Array<string> | any
  bodyData: Array<T>
  renderHead?: (data: string, index: number) => ReactNode | any
  renderBody: (data: T | any, index: number) => ReactNode | any
  onClick: () => void
  className?: string,
  statuses: {loading: boolean, error: boolean}
}

function Table<T>(props: TableProps<T>) {
  const {
    headData,
    bodyData,
    renderHead,
    renderBody,
    onClick,
    className = '',
    statuses
  } = props;

  const {t} = useTranslation()

  return (
    <div className={`${className} ${styles.table_wrapper}`}>
      <table> 
        {headData && renderHead ? (
          <thead>
            <tr>
              {headData.map((item: any, index: number) =>
                renderHead(item, index)
              )}
            </tr>
          </thead>
        ) : null}
        {
          statuses.loading ? 
            <tbody >
              <tr>
                <td className={styles.loading}><Loading /></td>
              </tr>
            </tbody> : 
            statuses.error ? 
            <tbody>
              <tr>
                <td className={styles.error}>
                  <div className={styles.error__container}>
                    <div className={styles.error__img}>
                      <img src={error} alt="Error" />
                    </div>
                    <div className={styles.error__def}>
                      {/* <h4 className={styles.txt}>{title}</h4> */}
                      <div className={styles.reload}>
                        <Button roundedSm color="red" className={styles.try_again_btn} onClick={onClick}>
                          <i className='bx bx-refresh'></i>
                          <span className={styles.try__again_txt}>{t('try_again')}</span>
                        </Button> 
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody> :
          bodyData && bodyData?.length > 0 ? 
            <tbody>
              {bodyData?.map((item, index) =>
                renderBody(item, index)
              )}
            </tbody>
        : <tbody className={styles.notFound}>
            <tr>
              <td>
                <Framer>
                  <Nodata />
                </Framer>
                <div className={styles.txt}>{t('no_data')}</div>
              </td>
            </tr>
          </tbody>
        }
      </table>
    </div>
  );
};

export default Table;
