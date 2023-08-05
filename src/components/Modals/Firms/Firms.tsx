import React, {useState, useEffect, useMemo} from 'react'
import { useMatch } from '@tanstack/react-location'
// complibraries 
import { Modal, Button } from '@app/compLibrary'
import CommonModalI from '../commonTypes'
// redux 
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks'
//actions
import TopnavbarAction from '@redux/actions/TopnavbarAction'
import DashboardAction from '@redux/actions/DashboardAction'
// styles
import classNames from 'classnames/bind'
import styles from './Firms.module.scss'
//react toast 
import toast from 'react-hot-toast'
//types
import { UserFirmsList } from '@app/api/Types/queryReturnTypes/UserFirms'
import { UsualType } from '@app/redux/types/TopnavbarTypes'
// utils 
import { ArraysChecker,  CheckIfArray,  CheckObjOrArrForNull, delay  } from '@utils/helpers'
import Nofirm from '@icons/Nodataicon/Nofirm'
import Framer from '@app/compLibrary/FramerMotion/Framer'

interface FirmsModalType extends CommonModalI {
    data: UserFirmsList<string>[]
    translation: Function
}


const cx = classNames.bind(styles)
const Firms = (props: FirmsModalType) => {
    const dispatch = useAppDispatch()
    const match = useMatch()

    const [selectedOption, setSelectedOption] = useState<UsualType>({
        connected: false, 
        value: '',
        label: ''
    })
    //// redux states
    const receiver = useAppSelector(state => state.topNavbarReducer.receiver)
    const details = useAppSelector(state => state.dashboardReducer.details)
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
    const isDetsLoading = useAppSelector(state => state.dashboardReducer.detailsLoading)
    const isReportsDataLoading = useAppSelector(state => state.reportReducer.isReportsDataLoading)

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

    function setOptionFN(receiver: UsualType) {
        setSelectedOption(prev => ({...prev, connected:receiver.connected, value: receiver.value, label: receiver.label}))
    }

    const arrays = useMemo(() => {
        return [
            purchSaleOrders,saleOrdTotalByStatus,purchSalesReturns,
            stockCostTotal,paymentsReceived,paymentsMade,creditsFromSale,
            debtsFromPurchace,employeesBalance,expensesAmount,cashesAmount
        ]
    }, [])

    const {
        show, 
        setShow,
        data,
        translation
    } = props

    useEffect(() => {
        setOptionFN(receiver)
    }, [receiver])

  return (
    <>
        <Modal 
            className={styles.firmsModal}
            isOpen={show}
            close={() => {
                setShow(); 
                setOptionFN(receiver)
            }}
            header={
                CheckObjOrArrForNull(data) ? <div className={styles.header}>{translation('firms')}</div> : null
            }
        >
            {
                CheckObjOrArrForNull(data) ? 
                <>
                    <div className={styles.wrapper}>
                        
                        {data.map((item, index) => (
                            <div className={cx({
                                item: true, 
                                borderBottom: data.indexOf(item) !== data.length - 1
                            })} key={index}>

                                <div className={styles.radio}>
                                    <input 
                                        type='radio' 
                                        value={item.value} 
                                        disabled={!item.connected}
                                        checked={selectedOption.value === item.value}
                                        onChange={e => setSelectedOption(prev => ({...prev, connected: item.connected, value: item.value, label: item.label}))}
                                    />
                                    <div className={cx({
                                        status: true,
                                        connected: item.connected
                                    })}>{item.connected ? <span>{translation('active')}</span> : <span>{translation('inactive')}</span>}</div>
                                </div>
                                <div className={styles.contents}>
                                    <div className={styles.upper}>
                                        <div className={styles.fontWeightify}>{item.firm_fullname}</div>
                                        <div className={styles.firm_tels}>
                                            <div className=''>{item.firm_tel_num1}</div>
                                            {item.firm_tel_num2 !== null ? <span>/</span> : null}
                                            <div className=''>{item.firm_tel_num2}</div>
                                        </div>
                                    </div>
                                    <div className={styles.bottom}>
                                        <div title={item.firm_address} >{item.firm_address.length > 32 ? item.firm_address.slice(0, 32) + '...' : item.firm_address}</div>
                                        <div className={cx({
                                            fontWeightify: true, 
                                            connectedAt: item.connected,
                                            notConnected: !item.connected
                                        })}>{item.connected_at as string | null}</div>                             
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.action}>
                        <Button 
                            color='theme'
                            rounded 
                            type='contained'
                            disable={!selectedOption.connected}
                            onClick={() => {
                                const ms = 500;
                                if(selectedOption.value !== receiver.value){
                                    dispatch(TopnavbarAction.setReceiver(selectedOption));

                                    if(match.pathname === '/dashboard'){
                                        if(
                                            (
                                            purchSaleOrdLoading||purchSaleRetLoading||
                                            stockCostLoading||saleOrdTotalLoading||
                                            paymentsReceivedLoading||paymentsMadeLoading||
                                            creditsLoading||debtsLoading||employeesBalanceLoading||
                                            expensesLoding||cashesLoading
                                            || (ArraysChecker(arrays))
                                            ) 
                                        ){
                                            dispatch(DashboardAction.setDashboardSettings({task: 'both'}))
                                            delay(ms).then(() => dispatch(TopnavbarAction.setRenewDashboard(true)))
                                            dispatch(TopnavbarAction.setRenewDashboard(false))
                                        }


                                        if(isDetsLoading || CheckIfArray(details)) {
                                            dispatch(DashboardAction.setDetailsLoading(false))
                                            dispatch(DashboardAction.fetchData('details', false))
                                            dispatch(DashboardAction.setDetails([]))
                                            delay(ms).then(() => dispatch(DashboardAction.fetchData('details', true)))
                                        }
                                    }else if(match.pathname === '/report'){
                                        if(isReportsDataLoading){
                                            /// not found a solution yet ............................................. 
                                            // dispatch(ReportAction.setDataLoading(false))
                                            // dispatch(ReportAction.renewData(false))
                                            // delay(ms).then(() => dispatch(ReportAction.renewData(true)))
                                        }
                                            
                                    }else if(match.pathname === '/forecast'){
                                        console.log('Hello forecast')
                                    }


                                    toast.success(`${translation('selectedFirm')} ${selectedOption.label}`)

                                }
                                setShow()
                            }}
                        >
                            {translation('confirm')}
                        </Button>
                    </div>
                </> : 
                <div className={styles.noFirmFound}>  
                    <Framer rotate={[0, -2, 2, -2, 2, -2, 2, 0]}>
                        <Nofirm width={100} height={100}/>
                    </Framer>
                    <h1 className={styles.notFoundTxt}>{translation('noFirmFound')}</h1>
                </div >
            }

           
        </Modal>
    </>
  )
}

export default Firms