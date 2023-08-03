import React, {useEffect} from "react";

// action creator
import DashboardAction from "@app/redux/actions/DashboardAction";

import styles from "./SelectTime.module.scss";
import { Button, Modal } from "@app/compLibrary";
import { useTranslation } from 'react-i18next';
import CommonModalI from "./../commonTypes";
import { useAppDispatch, useAppSelector } from "./../../../hooks/redux_hooks";

/// toast 
import toast from 'react-hot-toast'

interface DeleteConfirmInterface extends CommonModalI {
  translate?: Function;
}

const DeleteConfirm = (props: DeleteConfirmInterface) => {
  const { show, setShow, translate} = props;
  const {t} = useTranslation()
  const dispatch = useAppDispatch()

  /// redux states
  const time = useAppSelector(state => state.dashboardReducer.timeToRefetch)

  const setTime = (time: string | number) => {
    dispatch(DashboardAction.setTimeToRefetch(time))
  } 

  return (
    <Modal
      isOpen={show}
      className={styles.delModal}
      close={() => {
        setShow(false); 
        setTime('5')  // defaults to 5 min if switched off 
        dispatch(DashboardAction.setSwitched(false))
      }}
      header={<h2 style={{margin: 'auto'}}>{t('select_time')}</h2>}
      footer={<Button
        className={styles.saveBtn}
        color="theme"
        rounded
        onClick={() => {
          dispatch(DashboardAction.activateAutoRefresh(true))
          dispatch(DashboardAction.setSwitched(true))
          setTime(time)
          setShow(false);
          toast.success(`${time} ${t('minutes')}`, {
            duration: 1000
          })
        }}
      >
        {t("confirm")}
      </Button>}
    >
      <div className={styles.timerModal}>
        <ul>
          {/* <li className={styles.radioInput}><input checked={time==='1'}  onChange={e => setTime(e.target.value)} type="radio" name="time" value="1" className={styles.radioInput}/> 1 minut <br /></li> */}
          <li className={styles.radioInput}><input checked={time==='5'}  onChange={e => setTime(e.target.value)} type="radio" name="time" value="5" className={styles.radioInput}/> 5 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={time==='15'} onChange={e => setTime(e.target.value)} type="radio" name="time" value="15" className={styles.radioInput}/> 15 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={time==='30'} onChange={e => setTime(e.target.value)} type="radio" name="time" value="30" className={styles.radioInput}/> 30 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={time==='60'} onChange={e => setTime(e.target.value)} type="radio" name="time" value="60" className={styles.radioInput}/> 60 {t('minutes')} <br /></li>
        </ul>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
