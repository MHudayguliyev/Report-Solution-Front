import React, {useState} from "react";

// action creator
import TopnavbarAction from "@app/redux/actions/TopnavbarAction";

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
  const [timer, setTimer] = useState<string>('5')

  /// redux states
  const time = useAppSelector(state => state.topNavbarReducer.timeToRefetch)

  const setTime = (time: string) => {
    dispatch(TopnavbarAction.setTimetorefetch(time))
  } 

  return (
    <Modal
      isOpen={show}
      className={styles.delModal}
      close={() => {
        setShow(false); 
        setTime('5')  // defaults to 5 min if switched off 
        setTimer('5')
        dispatch(TopnavbarAction.setSwitched(false))
      }}
      header={<h2 style={{margin: 'auto'}}>{t('select_time')}</h2>}
      footer={<Button
        className={styles.saveBtn}
        color="theme"
        rounded
        onClick={() => {
          dispatch(TopnavbarAction.activateAutoRefresh(true))
          dispatch(TopnavbarAction.setSwitched(true))
          setTime(timer)
          setShow(false);
          toast.success(`${timer} ${t('minutes')}`, {
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
          <li className={styles.radioInput}><input checked={timer==='5'}  onChange={e => setTimer(e.target.value)} type="radio" name="time" value="5" className={styles.radioInput}/> 5 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={timer==='15'} onChange={e => setTimer(e.target.value)} type="radio" name="time" value="15" className={styles.radioInput}/> 15 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={timer==='30'} onChange={e => setTimer(e.target.value)} type="radio" name="time" value="30" className={styles.radioInput}/> 30 {t('minutes')} <br /></li>
          <li className={styles.radioInput}><input checked={timer==='60'} onChange={e => setTimer(e.target.value)} type="radio" name="time" value="60" className={styles.radioInput}/> 60 {t('minutes')} <br /></li>
        </ul>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
