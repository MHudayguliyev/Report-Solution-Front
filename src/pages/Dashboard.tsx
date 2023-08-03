import React, {useEffect, useMemo, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks'
import { useTranslation } from 'react-i18next'
/// dashboard actions
import DashboardAction from '@redux/actions/DashboardAction'
/// utils 
import { CheckObjOrArrForNull, delay, setDashboardData } from '@utils/helpers'
// components
import { Col, Paper, Row, StatusCard, Table } from '@app/compLibrary'
import { CashesAmount, CreditsFromSale, DebtsFromPurchase, EmployeesBalance, ExpensesAmount, PaymentsMade, PaymentsReceived, PurchSaleOrders, PurchSalesReturns, SaleOrdTotalsByStatus, StockCostTotal, UsualType } from '@app/redux/types/DashboardTypes'
import NewStatusCard from '@app/compLibrary/NewStatusCard'
/// paperNames
import { papers } from '@utils/helpers'
/// styles
import styles from './Dashboard.module.scss'
import MaterialTable from '@app/components/MaterialTable/MaterialTable';
import Status from '@app/components/Status/Status'
// sockets
import { socket } from '@app/socket/socket'

type TableNameType = {
  value:string, 
  label:string
}

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation()

  const [tableName, setTableName] = useState<TableNameType>({value: '', label:''})
  const [paperData, setPaperData] = useState<{typeID: number | null, paperName: string,}>({typeID: 0 || null ,paperName: ""})
  /// redux states
  const fetcher = useAppSelector(state => state.dashboardReducer.fetchData)
  const details = useAppSelector(state => state.dashboardReducer.details)
  const isDtlTblOpen = useAppSelector(state => state.dashboardReducer.isDtlTblOpen)
  const isDetsLoading = useAppSelector(state => state.dashboardReducer.detailsLoading)
  const receiver = useAppSelector(state => state.dashboardReducer.receiver)
  const date = useAppSelector(state => state.dashboardReducer.date)
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

  const fetcherFN = (key: "details"|"refetch", state: boolean) => {
    dispatch(DashboardAction.fetchData(key, state))
  }
  const setNameFN = (props: TableNameType) => {
    const {value,label} = props
    setTableName(prev =>({...prev, label: label, value: value}))
  }
  const openDetails = (state: boolean) => {
    dispatch(DashboardAction.openDtlTbl(state))
  }

  useEffect(() => {
    if(!socket) return 
    const getInitData = (response: any) => {
      setDashboardData(dispatch, response)
      dispatch(DashboardAction.setRenewData(false))
    }
    const getDetails = (response: any) => {
      console.log('response ', response)
      dispatch(DashboardAction.setDetails(response))
      dispatch(DashboardAction.setDetailsLoading(false))
    }
    const refetch = (response: any) => {
      setDashboardData(dispatch, response)
    }

    socket.on('receive_initial_data', getInitData)
    socket.on('receive_detail_data', getDetails)
    socket.on('receive_refetched_data', refetch)

    
    return () =>
      socket.off('receive_detail_data', getDetails)
    
  }, [socket])

  useEffect(() => {
    if(fetcher.details || fetcher.refetch){
      dispatch(DashboardAction.setDetails([]))
      const messageToSend = {
        roomName: receiver.value,
        endPoint: '/get/dashboard/',
        data: {
          type_id: paperData.typeID,
          name: paperData.paperName,
          date: date
        }
      }
      const socketAddress: string | null = 
      fetcher.details ? 'request_details' : fetcher.refetch ? 'request_refetch' : null
      socket.emit(socketAddress, messageToSend)
      
      if(fetcher.details)
        dispatch(DashboardAction.setDetailsLoading(true))
      dispatch(DashboardAction.liberateFetcher())
    }
  }, [fetcher])

  const materialTable = useMemo(() => {
    return (
      <MaterialTable 
        show={isDtlTblOpen}
        isLoading={isDetsLoading}
        heightToExtract='250'
        setShow={() => {
          openDetails(false);
          setNameFN({value:'',label:''})
          dispatch(DashboardAction.setDetails([]))
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
        renderCustomActions
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

      <div className={styles.mtrlTable}>
        {materialTable}
      </div>

     {
      !isDtlTblOpen &&
      <>
      <Paper rounded className={styles.totalOrdersContainer}>
          <div className={styles.headerTxt}><h4>{t('ordersTotal')}</h4></div>
          <Row> 
            <Col grid={{sm:12, md: 12, lg:12, xlg:4, xxlg: 4}}>
                  {
                    <div className={styles.cardBg} onClick={() => {
                        if(receiver.connected&& !purchSaleOrdLoading&& CheckObjOrArrForNull(purchSaleOrders)){
                          fetcherFN('details', true)
                          openDetails(true)
                          setNameFN({label:t('purchase'), value: 'purchase'})
                        }
                        setPaperData((prev: any) => ({...prev, typeID: 13, paperName: papers[0]}))
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
                          count={0}
                          onClick={() => {
                            if(receiver.connected){
                              fetcherFN('refetch', true)
                              dispatch(DashboardAction.setPurchSaleOrdLoading(true))
                            }
                          }}
                        />
                    </div> 
                  }
                  {
                    <div onClick={() => {
                      if(receiver.connected&& !purchSaleOrdLoading&& CheckObjOrArrForNull(purchSaleOrders)){
                        fetcherFN('details', true)
                        openDetails(true)
                        setNameFN({label:t('sale'), value: 'sale'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 12, paperName: papers[0]}))
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
                          count={0}
                          onClick={() => {
                            if(receiver.connected){
                              fetcherFN('refetch', true)
                              dispatch(DashboardAction.setPurchSaleOrdLoading(true))
                            }
                          }}
                        />
                    </div> 
                    }
            </Col>
            <Col grid={{sm:12, md: 12, lg:12, xlg:8, xxlg: 8}}>
                      <Paper rounded fullHeight className={styles.tableStyle}>
                        <Table 
                            className={styles.tableHeight}
                            bodyData={saleOrdTotalByStatus}
                            statuses={{ loading: saleOrdTotalLoading, error: saleOrdTotalErr }}
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
                                setPaperData((prev: any) => ({...prev, typeID: null, paperName: papers[6]}))
                                fetcherFN('refetch', true)
                                dispatch(DashboardAction.setOrdCountTotalLoading(true))
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
            {
              <div className={styles.purchaseItem} onClick={() => {
                  if(receiver.connected && !purchSaleRetLoading&& CheckObjOrArrForNull(purchSalesReturns)){
                    fetcherFN('details',true)
                    openDetails(true)
                    setNameFN({label:t('purchase'), value: 'purchase'})
                  }
                  setPaperData((prev: any) => ({...prev, typeID: 1, paperName: papers[1]}))
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
                        count={0}
                        onClick={() => {
                          if(receiver.connected){
                            fetcherFN('refetch',true)
                            dispatch(DashboardAction.setPurchSalesRetLoading(true))
                          }
                        }}
                    />
              </div>
            }
          </Col>
          <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
            {
              <div onClick={() => {
                  if(receiver.connected&& !purchSaleRetLoading&& CheckObjOrArrForNull(purchSalesReturns)){
                    fetcherFN('details',true)
                    openDetails(true)
                    setNameFN({label:t('returnOfPurchace'), value: 'returnOfPurchace'})
                  }
                  setPaperData((prev: any) => ({...prev, typeID: 6, paperName: papers[1]}))
                }}>
                    <StatusCard
                      className={styles.borderRight}
                      title={t('returnOfPurchace')}
                      icon={'bx bx-abacus'}
                      keyAndHeaders={[
                        'ret_of_purch_inv_count',
                        'ret_of_purch_mat_amount',
                        'ret_of_purch_nettotal'
                      ]}
                    data={purchSalesReturns}
                    statuses={{loading: purchSaleRetLoading, error: purchSaleRetErr}}
                    count={0}
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setPurchSalesRetLoading(true))
                      }
                    }}
                  />
            </div>
            }
          </Col>
          <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
            {
              <div onClick={() => {
                  if(receiver.connected &&!purchSaleRetLoading&&  CheckObjOrArrForNull(purchSalesReturns)){
                    fetcherFN('details',true)
                    openDetails(true)
                    setNameFN({label:t('sale'), value: 'sale'})
                  }
                  setPaperData((prev: any) => ({...prev, typeID: 8, paperName: papers[1]}))
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
                    title={t('sale')}
                    count={0}
                    icon={'bx bx-abacus'}
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setPurchSalesRetLoading(true))
                      }
                    }}
                  />
              </div>
            }
          </Col>
          <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
            {
              <div className={styles.borderLeft} onClick={() => {
                  if(receiver.connected &&!purchSaleRetLoading&&  CheckObjOrArrForNull(purchSalesReturns)){
                    fetcherFN('details',true)
                    openDetails(true)
                    setNameFN({label:t('returnOfSold'), value: 'returnOfSold'})
                  }
                  setPaperData((prev: any) => ({...prev, typeID: 3, paperName: papers[1]}))
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
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setPurchSalesRetLoading(true))
                      }
                    }}
                  />
              </div>
            }
          </Col>
          
        </Row>
      </Paper>
      <Paper rounded className={styles.finalContainer}>
        <div className={styles.headerTxt}><h4>{t('reportsTotal')}</h4></div>
        <div>
          <Row>
            <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !stockCostLoading&& CheckObjOrArrForNull(stockCostTotal)) {
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('stockCostTotal'), value: 'stockCostTotal'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 'material', paperName: papers[2]}))
                  }}>
                  <NewStatusCard 
                    title={t('stockCostTotal')}
                    icon={'bx bxs-dashboard'}
                    roundedCard={'topLeft'}
                    count={stockCostTotal[0]?.stock_cost_total}
                    statuses={{loading: stockCostLoading, error: stockCostErr}}
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setStockLoading(true))
                      }
                    }}
                    />
                </div>
              }
            </Col>
            <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                 <div onClick={() => {
                    if(receiver.connected&& !paymentsReceivedLoading&& CheckObjOrArrForNull(paymentsReceived)){
                      fetcherFN('details',true)
                      openDetails(true)
                      setNameFN({label:t('paymentsReceived'), value: 'paymentsReceived'})
                    }
                    setPaperData((prev: any) => ({...prev, typeID: 11, paperName: papers[3]}))
                  }}>
                  <NewStatusCard 
                      title={t('paymentsReceived')}
                      icon={'bx bxs-dashboard'}
                      count={paymentsReceived[0]?.payments_received}
                      statuses={{loading: paymentsReceivedLoading, error: paymentsReceivedErr}}
                      onClick={() => {
                        if(receiver.connected){
                          fetcherFN('refetch',true)
                          dispatch(DashboardAction.setPaymentsReceivedLoading(true))
                        }
                      }}
                  />
                </div>
              }
            </Col>
            <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
                {
                  <div onClick={() => {
                      if(receiver.connected&& !paymentsMadeLoading&& CheckObjOrArrForNull(paymentsMade)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('paymentsMade'), value: 'paymentsMade'})

                      }
                      setPaperData((prev: any) => ({...prev, typeID: 12, paperName: papers[3]}))
                  }}>
                  <NewStatusCard 
                      title={t('paymentsMade')}
                      icon={'bx bxs-dashboard'}
                      count={paymentsMade[0]?.payments_made}
                      statuses={{loading: paymentsMadeLoading, error: paymentsMadeErr}}
                      onClick={() => {
                        if(receiver.connected){
                          fetcherFN('refetch',true)
                          dispatch(DashboardAction.setPaymentsMadeLoading(true))
                        }
                      }}
                  />
                  </div>
                }
            </Col>
            <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !expensesLoding&& CheckObjOrArrForNull(expensesAmount)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('expensesAmount'), value: 'expensesAmount'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 25, paperName: papers[5]}))
                }}>
                  <NewStatusCard 
                    title={t('expensesAmount')}
                    icon={'bx bxs-dashboard'}
                    roundedCard={'topRight'}
                    count={expensesAmount[0]?.expenses_amount}
                    style={{borderRight: 'none'}}
                    statuses={{loading: expensesLoding, error: expensesErr}}
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setExpensesLoading(true))
                      }
                    }}
                  />
              </div>
              }
            </Col>
          </Row>
          <Row style={{borderTop: '1px solid #ccc'}}>
          <Col  grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !creditsLoading&& CheckObjOrArrForNull(creditsFromSale)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('creditsFromSale'), value: 'creditsFromSale'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 2, paperName: papers[4]}))
              }}>
                <NewStatusCard 
                  title={t('creditsFromSale')}
                  icon={'bx bxs-dashboard'}
                  roundedCard={'bottomLeft'}
                  count={creditsFromSale[0]?.credits_from_sale}
                  statuses={{loading: creditsLoading, error: creditsErr}}
                  onClick={() => {
                    if(receiver.connected){
                      fetcherFN('refetch',true)
                      dispatch(DashboardAction.setCreditsLoading(true))
                    }
                  }}
                />
              </div>
              }
            </Col>
            <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !debtsLoading&& CheckObjOrArrForNull(debtsFromPurchace)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('debtsFromPurchace'), value: 'debtsFromPurchace'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 1, paperName: papers[4]}))
                }}>
              <NewStatusCard 
                  title={t('debtsFromPurchace')}
                  icon={'bx bxs-dashboard'}
                  count={debtsFromPurchace[0]?.debts_from_purchase}
                  statuses={{loading: debtsLoading, error: debtsErr}}
                  onClick={() => {
                    if(receiver.connected){
                      fetcherFN('refetch',true)
                      dispatch(DashboardAction.setDebtsLoading(true))
                    }
                  }}
                />
              </div>
              }
            </Col >
            
            <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !employeesBalanceLoading&& CheckObjOrArrForNull(employeesBalance)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('employeesBalance'), value: 'employeesBalance'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 4, paperName: papers[4]}))
                }}>
                <NewStatusCard 
                    title={t('employeesBalance')}
                    icon={'bx bxs-dashboard'}
                    count={employeesBalance[0]?.employees_balance.toFixed(2)}
                    statuses={{loading: employeesBalanceLoading, error: employeesBalanceErr}}
                    onClick={() => {
                      if(receiver.connected){
                        fetcherFN('refetch',true)
                        dispatch(DashboardAction.setEmployeesBalanceLoading(true))
                      }
                    }}
                  />
              </div>
              }
            </Col>
            <Col grid={{sm:12, md: 12, lg:12, xlg:3, xxlg: 3}}>
              {
                <div onClick={() => {
                      if(receiver.connected&& !cashesLoading&& CheckObjOrArrForNull(cashesAmount)){
                        fetcherFN('details',true)
                        openDetails(true)
                        setNameFN({label:t('cashesAmount'), value: 'cashesAmount'})
                      }
                      setPaperData((prev: any) => ({...prev, typeID: 8, paperName: papers[5]}))
              }}>
                <NewStatusCard 
                  title={t('cashesAmount')}
                  icon={'bx bxs-dashboard'}
                  style={{borderRight: 'none'}}
                  roundedCard={'bottomRight'}
                  count={cashesAmount[0]?.cashes_amount}
                  statuses={{loading: cashesLoading, error: cashesErr}}
                  onClick={() => {
                    if(receiver.connected){
                      fetcherFN('refetch',true)
                      dispatch(DashboardAction.setCashesLoading(true))
                    }
                  }}
                />
              </div>
              }
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