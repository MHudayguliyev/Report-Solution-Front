import React, { useState, useEffect } from 'react'

// styles
import styles from './ReportPage.module.scss'
// children
import MaterialTable from '@app/components/MaterialTable/MaterialTable';
// sockets
import { socket } from '@app/socket/socket';
// redux selector
import { useAppSelector } from '@app/hooks/redux_hooks';
import { useAppDispatch } from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
/// redux actions
import ReportAction from '@redux/actions/ReportAction'
/// locale type
import { Localization } from '@app/redux/types/ReportTypes';

interface Fields  {
  value: string,
  label: Localization
}
const fields: Fields[] = [
  {value: 'material', label: {en:'Material',ru:'По товарно',tm:'Haryt b/ç'}},
  {value: 'group', label: {en:'Group',ru:'По группе',tm:'Topar b/ç'}},
  {value: 'category', label: {en:'Category',ru:'По категории',tm:'Kategoriýa b/ç'}}
]
const tabs = [
  {en: "Material's stock", ru: 'Остатки товаров', tm: 'Haryt stok ýagdaýy'},
  {en: "Material's profitability", ru: 'Реньтабельность товаров', tm:'Harytlaryň düşwüntliligi'}
]

const Report = () => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation()

  /// use states
  const [paperData, setPaperData] = useState<{typeID: number | null, paperName: string}>({typeID: 0,paperName: "mat_stock_amount_cost"})
  // redux states
  const reportsData = useAppSelector(state => state.reportReducer.reportData)
  const endUrl = useAppSelector(state => state.reportReducer.endUrl)
  const activeIndex = useAppSelector(state => state.reportReducer.activeIndex)
  const isLoading = useAppSelector(state => state.reportReducer.isDataLoading)
  const field = useAppSelector(state => state.reportReducer.field)



  useEffect(() => {
    if(!socket) return
    const getData = (data: any | any[]) => {
      dispatch(ReportAction.setReportData(data))
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
    dispatch(ReportAction.setReportData([]))
  }, [activeIndex])


  return (
    <div className={styles.tabs}>
       <MaterialTable
          show
          setShow={() => {}}
          data={reportsData}
          paperData={paperData}
          translation={t}
          isLoading={isLoading}
          enableStickyHeader
          renderBottomToolbarActions
          density={'compact'}
          heightToExtract='250'
          tabs={tabs}
          dropdownData={fields}
          field={field}
        />
    </div>
  )
}

export default Report
