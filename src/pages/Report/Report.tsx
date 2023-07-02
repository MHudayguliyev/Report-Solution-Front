import React, { useState, useEffect, useContext } from 'react'
import { useAppDispatch } from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
// styles
import styles from './ReportPage.module.scss'
import MaterialTable from '@app/components/MaterialTable/MaterialTable';
import SelectTime from '@app/components/Modals/SelectTime/SelectTime'

import { SocketContext } from '@app/context/context';
import { useAppSelector } from '@app/hooks/redux_hooks';
/// redux actions
import ReportAction from '@redux/actions/ReportAction'
import FormAction from '@redux/actions/FormAction'

type Fields = {
  value: string, 
  label: string
}

const fields: Fields[] = [
  {value: 'material', label: 'Material'},
  {value: 'group', label: 'Group'},
  {value: 'category', label: 'Group by: Category'}
]

const Report = () => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const socket: any = useContext(SocketContext)

  /// use states
  const [reportData, setReportData] = useState<any>([])
  const [paperData, setPaperData] = useState<{typeID: number | null, paperName: string}>({typeID: 0,paperName: "mat_stock_amount_cost"})
  // redux states
  const selectTime = useAppSelector((state) => state.formsReducer.showTimeModal)
  const endUrl = useAppSelector(state => state.reportReducer.endUrl)
  const activeIndex = useAppSelector(state => state.reportReducer.activeIndex)
  const isLoading = useAppSelector(state => state.reportReducer.isDataLoading)
  const field = useAppSelector(state => state.reportReducer.field)

  const setShowTimeModal = () => {
    dispatch(FormAction.setShowTimeModal(!selectTime))
  }

  useEffect(() => {
    if(!socket) return
    const getData = (data: any) => {
      console.log('report data', data)
      setReportData(data)
      dispatch(ReportAction.renewData(false))
      dispatch(ReportAction.setDataLoading(false))
    }
    socket.on('receive_reports', getData)

    return () => {
      socket.off('receive_reports', getData)
    }
  }, [socket])

  useEffect(() => {
    setPaperData((prev) => ({...prev, paperName: endUrl}))
  }, [endUrl])

  useEffect(() => {
    setReportData([])
  }, [activeIndex])


  return (
    <div className={styles.tabs}>
       <MaterialTable
              show
              setShow={() => {}}
              onGoBack={() => {}}
              data={reportData}
              paperData={paperData}
              translation={t}
              isLoading={isLoading}
              enableStickyHeader
              renderBottomToolbarActions
              density={'compact'}
              tabs={['Mat stock amount cost', 'Mat gross profitability']}
              dropdownData={fields}
              field={field}
        />
      <SelectTime
        show={selectTime} 
        setShow={setShowTimeModal}
      />
    </div>
  )
}

export default Report
