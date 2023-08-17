import React from 'react'
import { Modal } from '@app/compLibrary'
import styles from './LogoutConfirm.module.scss'
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { deleteFromStorage } from '@utils/storage';
interface LogoutConfirmProp  {
    show: boolean,
    setShow : Function,

}
const logout = () => {
  deleteFromStorage()
  window.location.reload();
}
const LogoutConfirm = (props: LogoutConfirmProp) => {
    const {t} = useTranslation()
    const {show, setShow} = props
  return (
    <Modal isOpen={show} 
          close={() => setShow(false)}
          header={<h3 className={styles.headTxt}>{t("logout")}</h3>}
          footer={<div>
            <Button
                variant="contained"
                onClick={() => {
                  setShow(false);
                }}
                sx={{marginRight: '10px', width: '110px'}}
              >
                {t("cancel")}
              </Button>
            <Button
                variant="contained"
                onClick={logout}
                sx={{width: '110px'}}
              >
                {t("delConfirmYes")}
              </Button>

          </div>}
          className={styles.logout_modal}
    >
        <div>
          <p className={styles.bodyTxt}>{t('logoutTxt')}</p>
        </div>
    </Modal>
  )
}

export default LogoutConfirm


