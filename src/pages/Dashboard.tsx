import React, {useEffect, useMemo, useContext,  useState, useRef } from 'react'
// socket context
import SocketContext from "@app/socket/context";
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks'
import { useTranslation } from 'react-i18next'
/// dashboard actions
import DashboardAction from '@redux/actions/DashboardAction'
import TopnavbarAction from '@redux/actions/TopnavbarAction'
/// utils 
import { CheckObjOrArrForNull, isNullOrUndefined, isStrEmpty, setDashboardData } from '@utils/helpers'
// components
import { Col, Paper, Row, StatusCard, Table } from '@app/compLibrary'
import NewStatusCard from '@app/compLibrary/NewStatusCard'
/// paperNames
import {papers,list} from '@app/assets/JsonData/papers'
/// styles
import styles from './Dashboard.module.scss'
import MaterialTable from '@app/components/MaterialTable/MaterialTable';
import Status from '@app/components/Status/Status'
// sockets
import { SocketType} from '@app/socket/socket'
import { DataKindType, FetcherType } from '@app/redux/types/DashboardTypes'
import { ResponseType, TableNameType } from '@app/Types/utils';
import { UsualType } from '@app/redux/types/TopnavbarTypes';
import { ReceiverRefContext } from '@app/context';

type PaperDataType = {
  typeID:string | any
  paperName:string
  yPosition: number
}
type MessageType = {
  roomName: string
  endPoint: string
  dashboardDataType?: DataKindType
  data: {
    type_id: number | undefined
    name: string
    date: string
  }
}


const Dashboard = () => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  //ref
  const compareSwitchRef:any = useRef(null)
  // use context
  const socket:SocketType|any = useContext(SocketContext)
  const receiverRef = useContext(ReceiverRefContext)
  /// redux states
  const scrollY = useAppSelector(state => state.topNavbarReducer.scrollY)

  const dashboardDataType = useAppSelector(state => state.dashboardReducer.dataType)
  const fetcher = useAppSelector(state => state.dashboardReducer.fetchData)
  const details = useAppSelector(state => state.dashboardReducer.details)
  const isDtlTblOpen = useAppSelector(state => state.dashboardReducer.isDtlTblOpen)
  const isDetsLoading = useAppSelector(state => state.dashboardReducer.detailsLoading)
  const receiver = useAppSelector(state => state.topNavbarReducer.receiver)
  const dashboardDate = useAppSelector(state => state.topNavbarReducer.dashboardDate)
  const compareDate = useAppSelector(state => state.topNavbarReducer.dashboardCompareDate)
  const compareSwitch = useAppSelector(state => state.topNavbarReducer.compareSwitch)
  ///
  const purchSaleOrders = useAppSelector(state => state.dashboardReducer.purchSaleOrders)
  const saleOrdTotalByStatus= useAppSelector(state => state.dashboardReducer.saleOrdTotalsByStatus)
  const purchSalesReturns = useAppSelector(state => state.dashboardReducer.purchSalesReturns)
  const stockCostTotal = useAppSelector(state => state.dashboardReducer.stockCostTotal)
  const paymentsReceived = useAppSelector(state => state.dashboardReducer.paymentsReceived)
  const paymentsMade = useAppSelector(state => state.dashboardReducer.paymentsMade)
  const creditsFromSale = useAppSelector(state => state.dashboardReducer.creditsFromSale)
  const debtsFromPurchace = useAppSelector(state => state.dashboardReducer.debtsFromPurchase)
  const employeesBalance = useAppSelector(state => state.dashboardReducer.employeesBalance)
  const expensesAmount = useAppSelector(state => state.dashboardReducer.expensesAmount)
  const cashesAmount = useAppSelector(state => state.dashboardReducer.cashesAmount)
  ///
  //// redux loading states
  const purchSaleOrdLoading = useAppSelector(state => state.dashboardReducer.purchSaleOrdLoading)
  const purchSaleRetLoading = useAppSelector(state => state.dashboardReducer.purchSaleRetLoading)
  const stockCostLoading = useAppSelector(state => state.dashboardReducer.stockCostLoading)
  const saleOrdTotalLoading = useAppSelector(state => state.dashboardReducer.saleOrdTotalLoading)
  const paymentsReceivedLoading = useAppSelector(state => state.dashboardReducer.paymentsReceivedLoading)
  const paymentsMadeLoading = useAppSelector(state => state.dashboardReducer.paymentsMadeLoading)
  const creditsLoading = useAppSelector(state => state.dashboardReducer.creditsLoading)
  const debtsLoading = useAppSelector(state => state.dashboardReducer.debtsLoading)
  const employeesBalanceLoading = useAppSelector(state => state.dashboardReducer.employeesBalanceLoading)
  const expensesLoding = useAppSelector(state => state.dashboardReducer.expensesLoding)
  const cashesLoading = useAppSelector(state => state.dashboardReducer.cashesLoading)
  //// redux err states
  const purchSaleOrdErr = useAppSelector(state => state.dashboardReducer.purchSaleOrdErr)
  const purchSaleRetErr = useAppSelector(state => state.dashboardReducer.purchSaleRetErr)
  const stockCostErr = useAppSelector(state => state.dashboardReducer.stockCostErr)
  const saleOrdTotalErr = useAppSelector(state => state.dashboardReducer.saleOrdTotalErr)
  const paymentsReceivedErr = useAppSelector(state => state.dashboardReducer.paymentsReceivedErr)
  const paymentsMadeErr = useAppSelector(state => state.dashboardReducer.paymentsMadeErr)
  const creditsErr = useAppSelector(state => state.dashboardReducer.creditsErr)
  const debtsErr = useAppSelector(state => state.dashboardReducer.debtsErr)
  const employeesBalanceErr = useAppSelector(state => state.dashboardReducer.employeesBalanceErr)
  const expensesErr= useAppSelector(state => state.dashboardReducer.expensesErr)
  const cashesErr = useAppSelector(state => state.dashboardReducer.cashesErr)


  const [initialDetails, setInitialDetails] = useState<ResponseType>({
    data: [], 
    cred: {type_id: 0??null, name:""}
  })
  const [tableName, setTableName] = useState<TableNameType>({value: '', label:''})
  const [paperData, setPaperData] = useState<PaperDataType>({
    typeID: 0 || null,
    paperName: "",
    yPosition: 0
  })

  const fetcherFN = (key: FetcherType, state: boolean, dataType?: DataKindType|any) => {
    if(isNullOrUndefined(dataType))
      dispatch(DashboardAction.setDashboardDataType(dataType))
    dispatch(DashboardAction.fetchData(key, state))
  }
  const setNameFN = (props: TableNameType) => {
    const {value,label} = props
    setTableName(prev =>({...prev, label, value}))
  }
  const setPaperFN = (props: PaperDataType) => {
    const {
      typeID, 
      paperName, 
      yPosition
    } = props
    setPaperData(prev => ({...prev, typeID, paperName, yPosition}))
  }
  
  const openDetails = (state: boolean) => {
    dispatch(DashboardAction.openDtlTbl(state))
  }

  useEffect(() => {
    compareSwitchRef.current = compareSwitch
  }, [compareSwitch])

  useEffect(() => {
    if(!socket) return 
    const getInitData = (response:ResponseType) => {
      const receiver = receiverRef.current
      if(response.cred.roomName === receiver.value) 
        setDashboardData({dispatch, response})  
    }
    const getDataToCompare = (response: ResponseType) => {
      // console.log('data to compare response ', response)
      const receiver = receiverRef.current
      const switched = compareSwitchRef.current
      if(switched && response.cred.roomName === receiver.value) 
        setDashboardData({dispatch, response})  
    }
    const getDetails = (response: ResponseType) => {
      setInitialDetails(response)
    }
    const getRefetchedData = (response: ResponseType) => {
      const receiver: UsualType = receiverRef.current
      if(response.cred.roomName === receiver.value)
        setDashboardData({dispatch, response})
    }
    socket.on('receive_initial_data', getInitData)
    socket.on('receive_data_to_compare', getDataToCompare)
    socket.on('receive_detail_data', getDetails)
    socket.on('receive_refetched_data', getRefetchedData)
    
    return () =>{
      socket.off('receive_detail_data', getDetails)
    }
  }, [socket])

  useEffect(() => {
    if(isStrEmpty(initialDetails.cred.name as string)){
      const {cred: {name, type_id}, data} = initialDetails
      let paperClone = paperData.paperName
      if(paperClone==='employers')
        paperClone = 'credits_debts_empl_balance'
      else if(paperClone === 'expenses')
        paperClone = 'expenses_cashes_amount'

      if(name===paperClone && type_id===paperData.typeID)
        dispatch(DashboardAction.setDashboardTable({data, loading:false}))
      setInitialDetails(prev => ({...prev, data:[],cred: {...prev.cred, type_id:0,name:""}}))
    }
  }, [initialDetails])

  useEffect(() => {
    if(fetcher.details || fetcher.refetch){
      dispatch(DashboardAction.setDetails([]))
      const messageToSend: MessageType = {
        roomName: receiver.value,
        endPoint: '/get/dashboard/',
        dashboardDataType, 
        data: {
          type_id: paperData.typeID,
          name: paperData.paperName==='employers' ? papers[4] : 
                  paperData.paperName==='expenses' ? papers[5] : 
                    paperData.paperName,
          date: dashboardDataType === 'initialData' ? dashboardDate : compareDate
        }
      }
      const socketAddress: string  = 
      fetcher.details ? 'request_details' : fetcher.refetch ? 'request_refetch' : ""
      if(fetcher.details){
        delete messageToSend.dashboardDataType
        dispatch(DashboardAction.setDetailsLoading(true))
      }
      socket.emit(socketAddress, messageToSend)
      dispatch(DashboardAction.liberateFetcher())
    }
  }, [fetcher])


  const materialTable = useMemo(() => {
    return (
      <MaterialTable 
        show={isDtlTblOpen}
        isLoading={isDetsLoading}
        heightToExtract='232'
        setShow={yPosition => {
          openDetails(false);
          setNameFN({value:'',label:''})
          dispatch(DashboardAction.setDetails([]))
          dispatch(TopnavbarAction.runLayoutScrollY({ state: true, position: yPosition }))
          if(isDetsLoading) dispatch(DashboardAction.setDetailsLoading(false));
        }} 
        translation={t}
        data={details}
        paperData={paperData}
        tableName={tableName}
        onLanguageChange={(data:any) => {
          setNameFN({value: data.value, label: t(data.value)})
        }}
        enableColumnResizing
        enableStickyHeader
        renderCustomDashboardActions
        density={'compact'}
      />
    )

  }, [
    isDtlTblOpen,
    isDetsLoading,
    details,
    paperData,
    tableName
  ])

  return (
    <>
      {

        isDtlTblOpen ? 
          <div className={styles.mtrlTable}>
            {materialTable}
          </div>  : 

          <>
            <Paper rounded className={styles.totalOrdersContainer}>
                      <div className={styles.headerTxt}><h4>{t('ordersTotal')}</h4></div>
                      <Row> 
                        <Col grid={{sm:12, md: 12, lg:12, xlg:4, xxlg: 4}}>
                                <div className={styles.cardBg} onClick={() => {
                                    if(receiver.connected&& !purchSaleOrdLoading.initialData&& CheckObjOrArrForNull(purchSaleOrders.initialData)){
                                      fetcherFN('details', true)
                                      openDetails(true)
                                      setNameFN({label:t('purchase'), value: 'purchase'})
                                      setPaperFN({typeID: 13, paperName: papers[0], yPosition: scrollY})
                                    }
                                  }}>
                                    <StatusCard 
                                      className={styles.borderBtm}
                                      title={t('purchase')}
                                      icon={'bx bx-abacus'}
                                      roundedCard={'top'} 
                                      keyAndHeaders={[
                                        'purch_ord_count',
                                        'purch_ord_amount',
                                        'purch_ord_nettotal'
                                      ]}
                                      data={purchSaleOrders}
                                      statuses={{loading: purchSaleOrdLoading, error: purchSaleOrdErr}}
                                      switched={compareSwitch}
                                      count={0}
                                      onClick={dataType => {
                                        if(receiver.connected){
                                          setPaperFN({typeID: 13, paperName: papers[0], yPosition: scrollY})
                                          fetcherFN('refetch', true, dataType)
                                          dispatch(DashboardAction.setPurchSaleOrdLoading({
                                            key: dataType, 
                                            state: true
                                          }))
                                        }
                                      }}
                                    />
                                </div> 
                                <div onClick={() => {
                                  if(receiver.connected&& !purchSaleOrdLoading.initialData&& CheckObjOrArrForNull(purchSaleOrders.initialData)){
                                    fetcherFN('details', true)
                                    openDetails(true)
                                    setNameFN({label:t('sale'), value: 'sale'})
                                    setPaperFN({typeID: 12, paperName: papers[0], yPosition: scrollY})
                                  }
                                }}>
                                    <StatusCard 
                                      title={t('sale')}
                                      icon={'bx bx-abacus'}
                                      roundedCard={'bottom'}
                                      keyAndHeaders={[
                                        'sale_ord_count',
                                        'sale_ord_amount',
                                        'sale_ord_nettotal'
                                      ]}
                                      data={purchSaleOrders}
                                      statuses={{loading: purchSaleOrdLoading, error: purchSaleOrdErr}}
                                      switched={compareSwitch}
                                      count={0}
                                      onClick={dataType => {
                                        if(receiver.connected){
                                          setPaperFN({typeID: 12, paperName: papers[0], yPosition: scrollY})
                                          fetcherFN('refetch', true, dataType)
                                          dispatch(DashboardAction.setPurchSaleOrdLoading({
                                            key: dataType, 
                                            state: true
                                          }))
                                        }
                                      }}
                                    />
                                </div> 
                        </Col>
                        <Col grid={{sm:12, md: 12, lg:12, xlg:8, xxlg: 8}}>
                                  <Paper rounded fullHeight className={styles.tableStyle}>
                                    <Table 
                                        className={styles.tableHeight}
                                        bodyData={saleOrdTotalByStatus.initialData}
                                        statuses={{ loading: saleOrdTotalLoading.initialData, error: saleOrdTotalErr.initialData }}
                                        headData={[
                                          t('status'),
                                          t('ordCount'), 
                                          t('saleMatAmount'),
                                          t('saleOrdNettotal')
                                        ]}
                                        renderHead={(data, index) => {
                                          return <th key={index}>{data}</th>;
                                        }}
                                        renderBody={(data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td style={{borderRadius: '15px'}}>
                                                <Status name={data.ord_status_name} id={index}/>
                                              </td>
                                              <td><h4>{data.sale_ord_count}</h4></td>
                                              <td><h4>{data.sale_ord_mat_amount}</h4></td>
                                              <td style={{borderRadius: '15px'}}><h4>{data.sale_ord_nettotal}</h4></td>
                                            </tr>
                                          ) 
                                        }}
                                        onClick={() => {
                                          if(receiver.connected){
                                            setPaperFN({typeID: null, paperName: papers[6], yPosition: scrollY})
                                            fetcherFN('refetch', true)  
                                            dispatch(DashboardAction.setOrdCountTotalLoading({
                                              key: 'initialData', 
                                              state: true
                                            }))
                                          }
                                        }}
                                      />
                                  </Paper>
                          </Col>
                      </Row>
                  </Paper>
                  <Paper rounded className={styles.purchaseContainer} >
                  <div className={styles.headerTxt}><h4>{t('trandingTotals')}</h4></div>
                    <Row>
                      <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                          <div className={styles.purchaseItem} onClick={() => {
                              if(receiver.connected && !purchSaleRetLoading.initialData&& CheckObjOrArrForNull(purchSalesReturns.initialData)){
                                fetcherFN('details',true)
                                openDetails(true)
                                setNameFN({label:t('purchase'), value: 'purchase'})
                                setPaperFN({typeID: 1, paperName: papers[1], yPosition: scrollY})
                              }
                            }}
                            >
                                <StatusCard
                                    title={t('purchase')}
                                    icon={'bx bx-abacus'}
                                    roundedCard={'left'}
                                    keyAndHeaders={[
                                      'purch_inv_count',
                                      'purch_mat_amount',
                                      'purch_nettotal'
                                    ]}
                                    data={purchSalesReturns}
                                    statuses={{loading: purchSaleRetLoading, error: purchSaleRetErr}}
                                    switched={compareSwitch}
                                    count={0}
                                    onClick={dataType => {
                                      if(receiver.connected){
                                        setPaperFN({typeID: 1, paperName: papers[1], yPosition: scrollY})
                                        fetcherFN('refetch', true, dataType)
                                        dispatch(DashboardAction.setPurchSalesRetLoading({
                                          key: dataType, 
                                          state: true
                                        }))
                                      }
                                    }}
                                />
                          </div>
                      </Col>
                      <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                          <div className={styles.purchaseItem} onClick={() => {
                              if(receiver.connected&& !purchSaleRetLoading.initialData&& CheckObjOrArrForNull(purchSalesReturns.initialData)){
                                fetcherFN('details',true)
                                openDetails(true)
                                setNameFN({label:t('returnOfPurchace'), value: 'returnOfPurchace'})
                                setPaperFN({typeID: 6, paperName: papers[1], yPosition: scrollY})
                              }
                            }}>
                                <StatusCard
                                  title={t('returnOfPurchace')}
                                  icon={'bx bx-abacus'}
                                  keyAndHeaders={[
                                    'ret_of_purch_inv_count',
                                    'ret_of_purch_mat_amount',
                                    'ret_of_purch_nettotal'
                                  ]}
                                data={purchSalesReturns}
                                statuses={{loading: purchSaleRetLoading, error: purchSaleRetErr}}
                                switched={compareSwitch}
                                count={0}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 6, paperName: papers[1], yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setPurchSalesRetLoading({
                                      key: dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                              />
                        </div>
                      </Col>
                      <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                          <div className={styles.purchaseItem} onClick={() => {
                              if(receiver.connected &&!purchSaleRetLoading.initialData&&  CheckObjOrArrForNull(purchSalesReturns.initialData)){
                                fetcherFN('details',true)
                                openDetails(true)
                                setNameFN({label:t('sale'), value: 'sale'})
                                setPaperFN({typeID: 8, paperName: papers[1], yPosition: scrollY})
                              }
                            }}
                          >
                              <StatusCard 
                                keyAndHeaders={[
                                  'sale_inv_count',
                                  'sales_mat_amount',
                                  'sales_nettotal',
                                ]}
                                data={purchSalesReturns}
                                statuses={{loading: purchSaleRetLoading, error: purchSaleRetErr}}
                                switched={compareSwitch}
                                title={t('sale')}
                                count={0}
                                icon={'bx bx-abacus'}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 8, paperName: papers[1], yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setPurchSalesRetLoading({
                                      key: dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                              />
                          </div>
                      </Col>
                      <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                          <div onClick={() => {
                              if(receiver.connected &&!purchSaleRetLoading.initialData&&  CheckObjOrArrForNull(purchSalesReturns.initialData)){
                                fetcherFN('details',true)
                                openDetails(true)
                                setNameFN({label:t('returnOfSold'), value: 'returnOfSold'})
                                setPaperFN({typeID: 3, paperName: papers[1], yPosition: scrollY})
                              }
                            }}
                          >
                              <StatusCard   
                                title={t('returnOfSold')}
                                icon={'bx bx-abacus'}  
                                roundedCard={'right'}
                                keyAndHeaders={[
                                  'ret_of_sold_inv_count',
                                  'ret_of_sold_inv_count',
                                  'ret_of_sold_nettotal'
                                ]}
                                count={0}
                                data={purchSalesReturns}
                                statuses={{loading: purchSaleRetLoading, error: purchSaleRetErr}}
                                switched={compareSwitch}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 3, paperName: papers[1], yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setPurchSalesRetLoading({
                                      key: dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                              />
                          </div>
                      </Col>
                      
                    </Row>
                  </Paper>
                  <Paper rounded className={styles.finalContainer}>
                    <div className={styles.headerTxt}><h4>{t('reportsTotal')}</h4></div>
                    <div>
                      <Row>
                        <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                  if(receiver.connected&& !stockCostLoading.initialData&& CheckObjOrArrForNull(stockCostTotal.initialData)) {
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('stockCostTotal'), value: 'stockCostTotal'})
                                    setPaperFN({typeID: 'material', paperName: papers[2], yPosition: scrollY})
                                  }
                              }}>
                              <NewStatusCard 
                                title={t('stockCostTotal')}
                                icon={'bx bxs-dashboard'}
                                roundedCard={'topLeft'}
                                data={stockCostTotal.initialData?.[0]?.stock_cost_total}
                                optionalData={stockCostTotal.dataToCompare?.[0]?.stock_cost_total}
                                statuses={{loading: stockCostLoading, error: stockCostErr}}
                                switched={compareSwitch}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 'material', paperName: papers[2], yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setStockLoading({
                                      key: dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                                />
                            </div>
                        </Col>
                        <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                if(receiver.connected&& !paymentsReceivedLoading.initialData&& CheckObjOrArrForNull(paymentsReceived.initialData)){
                                  fetcherFN('details',true)
                                  openDetails(true)
                                  setNameFN({label:t('paymentsReceived'), value: 'paymentsReceived'})
                                  setPaperFN({typeID: 11, paperName: papers[3], yPosition: scrollY})
                                }
                              }}>
                              <NewStatusCard 
                                  title={t('paymentsReceived')}
                                  icon={'bx bxs-dashboard'}
                                  data={paymentsReceived.initialData?.[0]?.payments_received}
                                  optionalData={paymentsReceived.dataToCompare?.[0]?.payments_received}
                                  statuses={{loading: paymentsReceivedLoading, error: paymentsReceivedErr}}
                                  switched={compareSwitch}
                                  onClick={dataType => {
                                    if(receiver.connected){
                                      setPaperFN({typeID: 11, paperName: papers[3], yPosition: scrollY})
                                      fetcherFN('refetch', true, dataType)
                                      dispatch(DashboardAction.setPaymentsReceivedLoading({
                                        key: dataType, 
                                        state: true
                                      }))
                                    }
                                  }}
                              />
                            </div>
                        </Col>
                        <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                              <div onClick={() => {
                                  if(receiver.connected&& !paymentsMadeLoading.initialData&& CheckObjOrArrForNull(paymentsMade.initialData)){
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('paymentsMade'), value: 'paymentsMade'})
                                    setPaperFN({typeID: 12, paperName: papers[3], yPosition: scrollY})
                                  }
                              }}>
                              <NewStatusCard 
                                  title={t('paymentsMade')}
                                  icon={'bx bxs-dashboard'}
                                  data={paymentsMade.initialData?.[0]?.payments_made}
                                  optionalData={paymentsMade.dataToCompare?.[0]?.payments_made}
                                  statuses={{loading: paymentsMadeLoading, error: paymentsMadeErr}}
                                  switched={compareSwitch}
                                  onClick={dataType => {
                                    if(receiver.connected){
                                      setPaperFN({typeID: 12, paperName: papers[3], yPosition: scrollY})
                                      fetcherFN('refetch', true, dataType)
                                      dispatch(DashboardAction.setPaymentsMadeLoading({
                                        key: dataType, 
                                        state: true
                                      }))
                                    }
                                  }}
                              />
                              </div>
                        </Col>
                        <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                  if(receiver.connected&& !expensesLoding.initialData&& CheckObjOrArrForNull(expensesAmount.initialData)){
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('expensesAmount'), value: 'expensesAmount'})
                                    setPaperFN({typeID: 25, paperName: 'expenses', yPosition: scrollY})
                                  }
                            }}>
                              <NewStatusCard 
                                title={t('expensesAmount')}
                                icon={'bx bxs-dashboard'}
                                roundedCard={'topRight'}
                                style={{borderRight: 'none'}}
                                data={expensesAmount.initialData?.[0]?.expenses_amount}
                                optionalData={expensesAmount.dataToCompare?.[0]?.expenses_amount}
                                statuses={{loading: expensesLoding, error: expensesErr}}
                                switched={compareSwitch}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 25, paperName: papers[5] , yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setExpensesLoading({
                                      key: dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                              />
                          </div>
                        </Col>
                      </Row>
                      <Row style={{borderTop: '1px solid #ccc'}}>
                      <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                  if(receiver.connected&& !creditsLoading.initialData&& CheckObjOrArrForNull(creditsFromSale.initialData)){
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('creditsFromSale'), value: 'creditsFromSale'})
                                    setPaperFN({typeID: 2, paperName: papers[4], yPosition: scrollY})
                                  }
                          }}>
                            <NewStatusCard 
                              title={t('creditsFromSale')}
                              icon={'bx bxs-dashboard'}
                              roundedCard={'bottomLeft'}
                              data={creditsFromSale.initialData?.[0]?.credits_from_sale}
                              optionalData={creditsFromSale.dataToCompare?.[0]?.credits_from_sale}
                              statuses={{loading: creditsLoading, error: creditsErr}}
                              switched={compareSwitch}
                              onClick={dataType => {
                                if(receiver.connected){
                                  setPaperFN({typeID: 2, paperName: papers[4], yPosition: scrollY})
                                  fetcherFN('refetch', true, dataType)
                                  dispatch(DashboardAction.setCreditsLoading({
                                    key: dataType, 
                                    state: true
                                  }))
                                }
                              }}
                            />
                          </div>
                        </Col>
                        <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                  if(receiver.connected&& !debtsLoading.initialData&& CheckObjOrArrForNull(debtsFromPurchace.initialData)){
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('debtsFromPurchace'), value: 'debtsFromPurchace'})
                                    setPaperFN({typeID: 1, paperName: papers[4], yPosition: scrollY})
                                  }
                            }}>
                          <NewStatusCard 
                              title={t('debtsFromPurchace')}
                              icon={'bx bxs-dashboard'}
                              data={debtsFromPurchace.initialData?.[0]?.debts_from_purchase}
                              optionalData={debtsFromPurchace.dataToCompare?.[0]?.debts_from_purchase}
                              statuses={{loading: debtsLoading, error: debtsErr}}
                              switched={compareSwitch}
                              onClick={dataType => {
                                if(receiver.connected){
                                  setPaperFN({typeID: 1, paperName: papers[4], yPosition: scrollY})
                                  fetcherFN('refetch', true, dataType)
                                  dispatch(DashboardAction.setDebtsLoading({
                                    key: dataType, 
                                    state: true
                                  }))
                                }
                              }}
                            />
                          </div>
                        </Col >
                        
                        <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                                  if(receiver.connected&& !employeesBalanceLoading.initialData&& CheckObjOrArrForNull(employeesBalance.initialData)){
                                    fetcherFN('details',true)
                                    openDetails(true)
                                    setNameFN({label:t('employeesBalance'), value: 'employeesBalance'})
                                    setPaperFN({typeID: 4, paperName: 'employers', yPosition: scrollY})
                                  }
                            }}>
                            <NewStatusCard 
                                title={t('employeesBalance')}
                                icon={'bx bxs-dashboard'}
                                data={employeesBalance.initialData?.[0]?.employees_balance.toFixed(2)}
                                optionalData={employeesBalance.dataToCompare?.[0]?.employees_balance.toFixed(2)}
                                statuses={{loading: employeesBalanceLoading, error: employeesBalanceErr}}
                                switched={compareSwitch}
                                onClick={dataType => {
                                  if(receiver.connected){
                                    setPaperFN({typeID: 4, paperName: papers[4], yPosition: scrollY})
                                    fetcherFN('refetch', true, dataType)
                                    dispatch(DashboardAction.setEmployeesBalanceLoading({
                                      key:dataType, 
                                      state: true
                                    }))
                                  }
                                }}
                              />
                          </div>
                        </Col>
                        <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                            <div onClick={() => {
                              if(receiver.connected&& !cashesLoading.initialData&& CheckObjOrArrForNull(cashesAmount.initialData)){
                                fetcherFN('details',true)
                                openDetails(true)
                                setNameFN({label:t('cashesAmount'), value: 'cashesAmount'})
                                setPaperFN({typeID: 8, paperName: papers[5], yPosition: scrollY})
                              }
                          }}>
                            <NewStatusCard 
                              title={t('cashesAmount')}
                              icon={'bx bxs-dashboard'}
                              style={{borderRight: 'none', borderBottom: 'none'}}
                              roundedCard={'bottomRight'}
                              data={cashesAmount.initialData?.[0]?.cashes_amount}
                              optionalData={cashesAmount.dataToCompare?.[0]?.cashes_amount}
                              statuses={{loading: cashesLoading, error: cashesErr}}
                              switched={compareSwitch}
                              onClick={dataType => {
                                if(receiver.connected){
                                  setPaperFN({typeID: 8, paperName: papers[5], yPosition: scrollY})
                                  fetcherFN('refetch', true, dataType)
                                  dispatch(DashboardAction.setCashesLoading({
                                    key: dataType, 
                                    state: true
                                  }))
                                }
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Paper>
          </>
      
      }
    </>
  )
}

export default Dashboard