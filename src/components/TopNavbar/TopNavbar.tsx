import React, { useContext, useEffect, useRef, useState } from "react";

// custom styles
import styles from "./TopNavbar.module.scss";
import classNames from "classnames/bind";
import {HiOutlineMenu} from "react-icons/hi"
import {GrClose} from "react-icons/gr"
/// error icon
import error from '@app/assets/images/bad-gateway.png'
/// loading icon
import Loading from '@app/compLibrary/SkeletonCard/Loading'

import { useMatch } from "@tanstack/react-location";
import { useQuery } from "react-query";

/// react toast
import toast from 'react-hot-toast'
import user_image from "../../assets/images/tuat.png";
// fake data for demonstration
import user_menu from "@app/assets/JsonData/user_menus.json";
import languages from "@app/assets/JsonData/language";
// own component library
import { Button, Col, Dropdown, Input, Row, Switch } from "@app/compLibrary";
import RightSidebar from "@app/components/RightSidebar/RightSidebar";
import { SelectLanuageMenu, UserToggle } from "./LanguageDropdown/LanguageDropdown";
// for translation
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";


// Action creators
import AuthAction from '@redux/actions/AuthAction'
import DashboardAction from '@redux/actions/DashboardAction'
import ReportAction from '@redux/actions/ReportAction'
import ThemeAction from "@app/redux/actions/ThemeAction";
import moment from "moment";
import FormAction from "@app/redux/actions/FormAction";
import DropDownSelect from "../DropDownSelect/DropDownSelect";
import { GetUser, GetUserActions, GetUserFirms, GetUserSubcsStatus } from "@app/api/Queries/Getters";
import { CheckObjOrArrForNull, isStrEmpty, setDashboardLoading } from "@utils/helpers";
import { SocketContext } from "@app/context/context";
import { UserFirms } from "@app/api/Types/queryReturnTypes/UserFirms";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import UserProfile from "../UserProfile/UserProfile";
import Themes from "../Themes/Themes";
import LogoutConfirm from "../Modals/LogoutConfirm/LogoutConfirm";
import useClickOutside from "@app/hooks/useClickOutsideDropdown";
import CustomTooltip from "@app/compLibrary/Tooltip/CustomTooltip";




const logout = () => {
  localStorage.removeItem('accessTokenCreatedTime');
  localStorage.removeItem('authUser');
  localStorage.removeItem('storage');
  window.location.reload();
}
const refetchData = ({socket,dispatch,path,receiver,endPoint,date,field}: {socket: any,dispatch: Function,path: string,receiver: {value: string},endPoint:string,date:any | {startDate: any, endDate: any} | Date,field?:{value: string, label: string}}) => {
  const message = {
    roomName: receiver?.value,endPoint,
    date,field: field?.value ?? ""
  }
  // console.log()
  socket.emit('request_initial_data', message)
  if(path==='/dashboard'){
    setDashboardLoading(dispatch, true)
  }else if(path==='/report'){
    dispatch(ReportAction.setDataLoading(true))
  }else if(path==='/forecast'){
    /// HELLO FORECAST
  }
}

const renderUserToggle = () => {
  let userName;
  try {
    const authUser = localStorage.getItem('authUser') || '';
    userName = JSON.parse(authUser);
  } catch (err) {
    userName = { user_name: 'Who are you?' }
  }
  return (
    <div className={styles.topnav__right_user}>
      <div className={styles.topnav__right_user__image}>
        <img src={user_image} alt="" />
      </div>
      <div className={styles.topnav__right_user__name}>{userName.user_name}</div>
    </div>
  )
};

type TopNavbarProps = {
  setShowModal?: Function | any
  showModal?: boolean;
}

const cx = classNames.bind(styles)

const TopNavbar = (props: TopNavbarProps) => {
  const socket: any = useContext(SocketContext)
  // for translation
  const { t, i18n } = useTranslation()
  const match = useMatch();
  const dispatch = useAppDispatch();
  const language = i18n.language
  /// redux states
  const refetchUserData = useAppSelector(state => state.authReducer.refetchUserData)
  const isDtlTblOpen = useAppSelector(state => state.dashboardReducer.isDtlTblOpen)
  const isDetsLoading = useAppSelector(state => state.dashboardReducer.detailsLoading)
  const isReportsDataLoading = useAppSelector(state => state.reportReducer.isDataLoading)
  const receiver: {label: string, value: string, connected: boolean} = useAppSelector(state => state.dashboardReducer.receiver)
  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
  const isShowTimeModal = useAppSelector((state: any) => state.formsReducer.showTimeModal)
  const activeIndex = useAppSelector(state => state.reportReducer.activeIndex)

  const renewDashboard = useAppSelector(state => state.dashboardReducer.renewData)
  const renewReport = useAppSelector(state => state.reportReducer.renewData)
  const autoRefreshActivated = useAppSelector(state => state.dashboardReducer.autoRefreshActivated)
  const switched = useAppSelector(state => state.dashboardReducer.switched)
  const time = useAppSelector(state => state.dashboardReducer.timeToRefetch)
  const firmsList = useAppSelector(state => state.dashboardReducer.firmsList)
  const cashesLoading = useAppSelector(state => state.dashboardReducer.cashesLoading)
  const date: any = useAppSelector(state => state.dashboardReducer.date)
  const startDate:any = useAppSelector(state => state.reportReducer.startDate)
  const endDate:any = useAppSelector(state => state.reportReducer.endDate)
  const endUrl:string = useAppSelector(state => state.reportReducer.endUrl)
  const field = useAppSelector(state => state.reportReducer.field)
  const fetcher = useAppSelector(state => state.dashboardReducer.fetchData)
 
  /// use states go here...
  const [isMinDay, setIsMinDay] = useState<boolean>(false)
  const [isReconnected, setReconnected] = useState<boolean>(false)
  const [subscDate, setSubscDate] = useState<string | number>()
  const [subscFullDate, setSubscFullDate] = useState<string | number | any>()
  const [disClient, setDisClient] = useState<string>("")
  const authUser = JSON.parse(localStorage.getItem('authUser')!) || null

  const userGuid:string = authUser?.user_guid ?? '' 
    // queries
    const {
      data: firmsData,
      isLoading, 
      isError,
      refetch: refetchFirmsData
    } = useQuery(['getUserFirms', authUser?.access_token, userGuid, isReconnected], 
    () => GetUserFirms(authUser?.access_token, userGuid), {enabled: !!userGuid || isReconnected})

    const {
      data: userData
    } = useQuery('getUserData', 
    () => GetUser(authUser?.access_token, userGuid), {enabled: !!userGuid})

    const {
      data: userSubscData,
      refetch: refetchUserSubsc,
      isLoading: isUserSubscLoading, 
      isError: isUserSubscError
    } = useQuery('getUserSubscData', 
    () => GetUserSubcsStatus(authUser?.access_token, userGuid), {enabled: !!userGuid})

  useEffect(() => {
    if(!socket) return
    const getClients = (firms: UserFirms<string>[]) => {
      if(CheckObjOrArrForNull(firms)){
        const firmsClone: any = firms.map(item => {
            return {
              connected: item.connected,
              value: item.backend_guid,
              label: item.firm_name
            }
        })
        dispatch(DashboardAction.setFirmsList(firmsClone))
      }
    }
    const disconnectMess = (response: string) => {
      setDisClient(response)
    }
    const reconnected = (state: boolean) => {
      setReconnected(state)
    } 

    socket.on('list_clients', getClients)
    socket.on('disconnection_message', disconnectMess)
    socket.on('reconnected', reconnected)
    return () => {
      socket.off('list_clients', getClients)
      socket.off('disconnection_message', disconnectMess)
      socket.off('reconnected', reconnected)

    }
  }, [socket])

  useEffect(() => {
    if(isReconnected){
      refetchFirmsData()
      setReconnected(!isReconnected)
      toast.success(t('reconnected'), {duration: 2*1000})
    }
  }, [isReconnected])

  useEffect(() => {
    if(!isLoading && !isError)
      if(socket)
        socket.emit('request_clients', firmsData)
  }, [firmsData])

  useEffect(() => {
    if(CheckObjOrArrForNull(firmsList)){
      for(let i = 0; i < firmsList.length; i++){
        const firm = firmsList[i]
        if(firm.connected){
          dispatch(DashboardAction.setReceiver(firm)); break
        } 
      }
    }
  }, [firmsList])


  useEffect(() => {
    if(renewDashboard || renewReport && isStrEmpty(receiver.value)){
      const initEndPoint = '/get'
      const path = match.pathname
      if(path==='/dashboard'){
        const endPoint = `${initEndPoint}/dashboard/`
        refetchData({socket,dispatch,path,receiver,endPoint,date})
      }else if(path==='/report'){
        const endPoint = `${initEndPoint}/report/${endUrl}`
        refetchData({socket,dispatch,path,receiver,endPoint,field,date: {startDate,endDate}})
      }
    }
  }, [renewDashboard, renewReport])

  useEffect(() => {
    if(match.pathname==='/dashboard' && isReportsDataLoading)
      dispatch(ReportAction.setDataLoading(!isReportsDataLoading))
  }, [match.pathname, isReportsDataLoading]) // to cancel socket request when switched to dashboard

  
  useEffect(() => {
    if(isStrEmpty(receiver.value) && autoRefreshActivated){
      const timer = time as number * 60 * 1000
      const path = match.pathname
      const initEndPoint = '/get'
      if(path==='/dashboard'){
        const endPoint = `${initEndPoint}/dashboard/`
        const interval = setInterval(() => {
          refetchData({socket,dispatch,path,receiver,endPoint,date}) 
        }, timer)
        return () => clearInterval(interval)
      }
      else if(path==='/report'){
        const endPoint = `${initEndPoint}/report/${endUrl}`
        const interval = setInterval(() => {
          refetchData({socket,dispatch,path,receiver,endPoint,field,date: {startDate,endDate}})
        }, timer) 
        return () => clearInterval(interval)
      }
    }
  }, [
    match.pathname,
    autoRefreshActivated,
    endUrl,field, receiver,
    startDate,endDate,date
  ])

  useEffect(() => {
    if(isStrEmpty(disClient) && CheckObjOrArrForNull(firmsList)){
        const firmsListClone = firmsList.map((value: any) => ({...value}))
        for(let i = 0; i < firmsListClone.length; i++){
          const firm = firmsListClone[i]
          if(firm.value === disClient){
            firm.connected = false
            dispatch(DashboardAction.setReceiver(firm))
            toast.error(firm.label + t('disconnected'), {duration: 2*1000})
          }

          if((autoRefreshActivated || switched) && firm.connected){
            dispatch(DashboardAction.activateAutoRefresh(true))
            dispatch(DashboardAction.setSwitched(true))
          }else if(!firm.connected || (autoRefreshActivated || switched)) {
            dispatch(DashboardAction.activateAutoRefresh(false))
            dispatch(DashboardAction.setSwitched(false))
          }
        }
        if(fetcher.details || fetcher.refetch)
          dispatch(DashboardAction.liberateFetcher())
        if(isDetsLoading)
          dispatch(DashboardAction.setDetailsLoading(false))
        dispatch(DashboardAction.setFirmsList(firmsListClone))
        setDashboardLoading(dispatch, false)
        setDisClient('')
    }
  }, [disClient])


  useEffect(() => {
    if(
      activeIndex===0 && moment(startDate).isAfter(moment(endDate)) || 
      activeIndex===0 && moment(startDate).isSame(moment(endDate))
    )
      dispatch(ReportAction.setEndDate(moment(startDate).add(1, 'days').format('YYYY-MM-DD')))
  }, [startDate])

  useEffect(() => {
    if(refetchUserData){
      refetchUserSubsc()
    }
  }, [refetchUserData])


  useEffect(() => {
    if(CheckObjOrArrForNull(userSubscData)){
      const array = ['years','months','days','hours','minutes']
      for(let i = 0; i < array.length; i++){
        const item = userSubscData?.remain_date[i][array[i]] 
        const locale: string = Object.keys(userSubscData?.remain_date[i])[0]
        if(locale === 'days' && item <=3 )
          setIsMinDay(true)
        else setIsMinDay(false)
        
        if(item > 0){
          setSubscDate(item + ' ' + t(locale)); break;
        }
      }
      let result = ''
      for(let i = 0; i < array.length; i++){
        const item = userSubscData?.remain_date[i][array[i]] 
        const locale: string = Object.keys(userSubscData?.remain_date[i])[0]
        if(item > 0){
          result += item + t(locale) + ' '
        }
      }
      setSubscFullDate(result)
    }
  }, [userSubscData, language])

  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }

  const Renew = () => {
    if(isStrEmpty(receiver.value) && receiver.connected){
      if(match.pathname === '/dashboard'){
        
          if(isDtlTblOpen && !isDetsLoading)
            dispatch(DashboardAction.fetchData('details', true))
          else if(!isDtlTblOpen && !cashesLoading) 
            dispatch(DashboardAction.setRenewData(true))

      }else if(match.pathname === '/report'){
        dispatch(ReportAction.renewData(true))
      }else if(match.pathname === '/forecast'){
        console.log('happy to be in forecast page')
      }
    }else 
      toast.error(t('select_firm'))
  }

  const siderbarFilterMenu = (
    <div className={styles.sideBar}>
      <div className={styles.topBtnGroup}>
      <Row rowGutter={10} colGutter={10}>
        <Col>
          <div className={styles.headInput}>
            {
              match.pathname === '/dashboard' ? 
                <Input
                  type='date'
                  value={date}
                  onChange={(e) => {
                    dispatch(DashboardAction.setDate(moment(e.target.value).format("YYYY-MM-DD"))) 
                  }}
                /> : 
                match.pathname === '/report' ? 
                <>
                  <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => {
                    if (
                      moment(e.currentTarget.value).isBefore(moment(endDate)) || 
                      (activeIndex===0 && moment(e.currentTarget.value).isAfter(moment(endDate))) || 
                      (activeIndex===0 && moment(e.currentTarget.value).isSame(endDate))
                    )
                      dispatch(ReportAction.setStartDate(e.currentTarget.value))
                    else dispatch(ReportAction.setStartDate(moment(endDate).subtract(1, 'days').format('YYYY-MM-DD')))
                  }}
                  style={{borderRight: '1px solid #ccc'}}
                />
                <Input
                  disabled={activeIndex === 0}
                  type='date'
                  max="9999-12-31T23:59" 
                  value={endDate}
                  onChange={(e) => {
                    if (moment(e.currentTarget.value).isAfter(moment(startDate)))
                      dispatch(ReportAction.setEndDate(e.currentTarget.value))
                    else dispatch(ReportAction.setEndDate(moment(startDate).add(1, 'days').format('YYYY-MM-DD')))
                  }}
                />
                </> : 
                match.pathname === '/forecast' ? 
                <></> : null
            }
            </div>
        </Col>

        <Col>
        <div className={`${styles.filterInput} ${styles.filterSelect}`}>
          <DropDownSelect
            dropDownContentStyle={{right: '0'}}
            titleSingleLine
            onChange={item => {
              dispatch(DashboardAction.setReceiver(item))
            }}
            fetchStatuses={{ isLoading: false, isError: false }}
            title={receiver.value ? receiver.label : t('firms')}
            data={firmsList}
          />
        </div>
        </Col>
        
        <Col>
          <Button color="theme" startIcon={<i className='bx bx-refresh' style={{fontSize: 22}}></i>} rounded onClick={Renew}>
            {t('refresh')}
          </Button>
        </Col>
        <Col>
          <div className={styles.topSwitchBox}>
            <Switch 
              checked={switched}
              onClick={() => {
                if(!receiver.connected)
                  toast.error(t('select_firm'))
                else {
                  dispatch(DashboardAction.setSwitched(!switched))
                  if(!switched)
                    dispatch(FormAction.setShowTimeModal(!isShowTimeModal)) 
                  if(autoRefreshActivated)
                    dispatch(DashboardAction.activateAutoRefresh(false));
                }             
              }}
            />
            <span className={styles.filterTitle}>
            {t('autoRefresh')}
            </span>
            <span className={styles.filterTitle}>{autoRefreshActivated && time ? `${time} min.` : null}</span>
          </div>
        </Col>
      </Row>
      </div>
    {/* } */}
  </div>
  )

  const menu_ref: any = useRef(null);
  const menu_toggle_ref: any = useRef(null);
  const [showSidebar, setShowSidebar] = useClickOutside(menu_ref, menu_toggle_ref)

  const [menuName, setMenuName] = useState('')
  const [logoutModal, setLogoutModal] = useState(false)
  const renderUserMenu = (
    <div className={styles.userDrpdown}>
      <div className={styles.subsc_head}>
        <h4 className={styles.subscription}>{t('subs')}</h4>
        <span><i className="bx bxs-info-circle"></i></span>
      </div>

      {
        isUserSubscError ? 
        <div className={styles.error__container}>
            <h4>{t('noSubcFound')}</h4>
        </div>  
        : 
        isUserSubscLoading ? 
        <div className={styles.loading}><Loading /></div> 
        : 
        <div>
        <div className={styles.subs}>
            {userSubscData?.subsc_name === "Null" ? 
              <h4>{t('noSubcFound')}</h4>
            : 
            <CustomTooltip content={userSubscData?.subsc_desc}>
              <div className={styles.subs__name}>
                <h4>{userSubscData?.subsc_name}</h4>
              </div>
            </CustomTooltip>
            }
        </div>
        {userSubscData?.subsc_name !== "Null" && 
        <div className={styles.subs}>
          <h4 className={styles.subs__txt}>{t('planDuration')}</h4>
          <CustomTooltip content={subscFullDate !== '' && subscFullDate}>
            <span className={cx({
              plan__duration: isMinDay
            })}>{subscDate}</span>
          </CustomTooltip>
        </div>
        }
        <div className={styles.subs}>
          <h4 className={styles.subs__txt}>{t('balance')}</h4>
          <span>{userSubscData?.user_balance}</span>
        </div>
      </div>

      }

      <div className={styles.footer}>
        <div  className={styles.notification_item} onClick={() => {setShowSidebar(true), setMenuName('profile')}}>
          <i className='bx bx-user'></i>
          <h4>{t('profile')}</h4>
        </div> 
        {/* onClick={() => {setShowSidebar(true), setMenuName('profile')}} */}

        <div className={styles.notification_item}>
          <i className='bx bx-cog'></i>
          <h4>{t('settings')}</h4>
        </div>
        <div onClick={() => setLogoutModal(true)} className={cx({notification_item: true, logoutBtn: true})}>
          <i className='bx bx-log-out-circle bx-rotate-180'></i>
              <h4>{t('logout')}</h4>
          </div>
        <LogoutConfirm show={logoutModal} setShow={setLogoutModal} />
      </div>
    </div>
  ) 



  return (
    <>

      <div className={styles.topnav}>
        <div className={styles.menuIcon} onClick={() => toggleSidebar()}>
          {isOpenSideBar? <GrClose size={24}/> : <HiOutlineMenu size={24}/> }
        </div>
        <div className={styles.filterIcon} onClick={() => {setShowSidebar(true), setMenuName('filter')}}>
          <TbAdjustmentsHorizontal size={24} />
        </div>
        <div className={styles.filterItems}>
          {siderbarFilterMenu}
        </div>
        
        <div className={styles.topnav__right}>
          <div className={styles.topnav__right_item}>
            {/* User dropdown */}
            <Dropdown
              customToggle={() => renderUserToggle()}
              contentData={user_menu}
              renderBody={renderUserMenu}
              onClick={() => dispatch(AuthAction.refetchUserData(!refetchUserData))}
            />
          </div>
          <div className={styles.topnav__right_item}>
            {/* Select language dropdown */}
            <Dropdown
              customToggle={() =>
                <UserToggle data={languages} />
              }
              contentData={languages}
              renderItems={(item, index) =>
                <SelectLanuageMenu {...item} key={index} />
              }
            />
          </div>
          <div className={styles.topnav__right_item} ref={menu_toggle_ref} onClick={() => {setShowSidebar(true), setMenuName('theme')}}>
            <i className="bx bx-palette"></i>
          </div>
          <RightSidebar menuRef={menu_ref} showMenu={showSidebar} setShowMenu={setShowSidebar} sidebarName={menuName}>
            { menuName == 'filter' ? 
              siderbarFilterMenu
              : 
              menuName == 'profile' ?
              <UserProfile userData={userData[0] ?? {}}/>
              : 
              menuName == 'theme' ?
              <Themes />
              :
              ''
            }
          </RightSidebar>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
