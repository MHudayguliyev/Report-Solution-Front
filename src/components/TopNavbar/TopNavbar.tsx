import React, { useEffect, useMemo, useRef, useState } from "react";
// custom styles
import styles from "./TopNavbar.module.scss";
import classNames from "classnames/bind";
import {HiOutlineMenu} from "react-icons/hi"
import {GrClose} from "react-icons/gr"
/// loading icon
import Loading from '@app/compLibrary/SkeletonCard/Loading'

import { useMatch } from "@tanstack/react-location";
import { useQuery } from "react-query";

/// react toast
import toast from 'react-hot-toast'
import user_image from "@app/assets/images/tuat.png";
import arrow_down from '@app/assets/customIcons/arrow_down.svg'
import arrow_up from '@app/assets/customIcons/arrow_up.svg'
// fake data for demonstration
import user_menu from "@app/assets/JsonData/user_menus.json";
import languages from "@app/assets/JsonData/language";
// own component library
import { Button, Col, Dropdown, Input, Row, Switch } from "@app/compLibrary";
import RightSidebar from "@app/components/RightSidebar/RightSidebar";
import { SelectLanuageMenu, UserToggle } from "./LanguageDropdown/LanguageDropdown";
import SelectTime from '@app/components/Modals/SelectTime/SelectTime'
// for translation
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";
// Action creators
import TopnavbarAction from '@redux/actions/TopnavbarAction'
import AuthAction from '@redux/actions/AuthAction'
import DashboardAction from '@redux/actions/DashboardAction'
import ReportAction from '@redux/actions/ReportAction'
import ThemeAction from "@app/redux/actions/ThemeAction";
import FormAction from "@app/redux/actions/FormAction";
//moment
import moment from "moment";
import { GetUser, GetUserActions, GetUserFirms, GetUserSubcsStatus } from "@app/api/Queries/Getters";
import { CheckObjOrArrForNull, isStrEmpty, checkDisconnectedClient } from "@utils/helpers";
import { UserFirms, UserFirmsList } from "@app/api/Types/queryReturnTypes/UserFirms";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import UserProfile from "../UserProfile/UserProfile";
import Themes from "../Themes/Themes";
import LogoutConfirm from "../Modals/LogoutConfirm/LogoutConfirm";
import useClickOutside from "@app/hooks/useClickOutsideDropdown";
import CustomTooltip from "@app/compLibrary/Tooltip/CustomTooltip";
import { Localization } from "@app/redux/types/ReportTypes";
// socket conn
import {socket} from '@app/socket/socket'
import Firms from "../Modals/Firms/Firms";
import { DisconnectedType } from "@redux/types/TopnavbarTypes";

const refetchData = ({socket,dispatch,path,receiver,endPoint,date,field}: {socket: any,dispatch: Function,path: string,receiver: {value: string},endPoint:string,date:any | {startDate: any, endDate: any} | Date,field?:{value: string, label: Localization}}) => {
  const message = {
    roomName: receiver?.value,endPoint,
    date,field: field?.value ?? ""
  }
  socket.emit('request_initial_data', message)
  if(path==='/dashboard'){
    dispatch(DashboardAction.setDashboardSettings({task: 'load', bool: true}))
  }else if(path==='/report'){
    dispatch(ReportAction.setReportDataLoading(true))
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



const cx = classNames.bind(styles)

const TopNavbar = () => {
  // for translation
  const { t, i18n } = useTranslation()
  const match = useMatch();
  const dispatch = useAppDispatch();
  const language = i18n.language
  /// redux states
  const refetchUserData = useAppSelector(state => state.authReducer.refetchUserData)
  const isDtlTblOpen = useAppSelector(state => state.dashboardReducer.isDtlTblOpen)
  const isDetsLoading = useAppSelector(state => state.dashboardReducer.detailsLoading)
  const isReportsDataLoading = useAppSelector(state => state.reportReducer.isReportsDataLoading)
  const receiver = useAppSelector(state => state.topNavbarReducer.receiver)
  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);
  const isShowTimeModal = useAppSelector((state: any) => state.formsReducer.showTimeModal)
  const activeIndex = useAppSelector(state => state.reportReducer.activeTabIndex)

  const renewDashboard = useAppSelector(state => state.topNavbarReducer.renewDashboard)
  const renewReport = useAppSelector(state => state.topNavbarReducer.renewReport)
  const autoRefreshActivated = useAppSelector(state => state.topNavbarReducer.autoRefreshActivated)
  const switched = useAppSelector(state => state.topNavbarReducer.switched)
  const time = useAppSelector(state => state.topNavbarReducer.timeToRefetch)
  const firmsList = useAppSelector(state => state.topNavbarReducer.firmsList)
  const cashesLoading = useAppSelector(state => state.dashboardReducer.cashesLoading)
  const date: any = useAppSelector(state => state.topNavbarReducer.dashboardDate)
  const startDate:any = useAppSelector(state => state.topNavbarReducer.reportStartDate)
  const endDate:any = useAppSelector(state => state.topNavbarReducer.reportEndDate)
  const endUrl = useAppSelector(state => state.reportReducer.endUrl)
  const field = useAppSelector(state => state.reportReducer.field)
  const fetcher = useAppSelector(state => state.dashboardReducer.fetchData)
 
  /// use states go here...
  const [isMinDay, setIsMinDay] = useState<boolean>(false)
  const [isReconnected, setReconnected] = useState<boolean>(false)
  const [subscDate, setSubscDate] = useState<string | number>()
  const [subscFullDate, setSubscFullDate] = useState<string | number | any>()
  const [disClient, setDisClient] = useState<DisconnectedType>({
    room: "", connected: false, last_conn_dt: ""
  })

  const menu_ref: any = useRef(null);
  const menu_toggle_ref: any = useRef(null);
  const [menuName, setMenuName] = useState<'profile'|'filter'|'theme'>('theme')
  const [disableOutClick, setDisableOutClick] = useState<boolean>(false)
  const [logoutModal, setLogoutModal] = useState<boolean>(false)
  const [showFirms, setShowFirms] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useClickOutside(menu_ref, menu_toggle_ref, disableOutClick)

  const authUser = JSON.parse(localStorage.getItem('authUser')!) || ""
  const userGuid:string = authUser?.user_guid ?? ""
    // queries
    const {
      data: firmsData,
      isLoading, 
      isError,
      refetch: refetchFirmsData
    } = useQuery(['getUserFirms', userGuid, isReconnected], 
    () => GetUserFirms(userGuid), {enabled: !!userGuid || isReconnected})

    const {
      data: userSubscData,
      refetch: refetchUserSubsc,
      isLoading: isUserSubscLoading, 
      isError: isUserSubscError
    } = useQuery('getUserSubscData', 
    () => GetUserSubcsStatus(userGuid), {enabled: !!userGuid})
    const {
      data: userPrivateData,
      isLoading: usrPrivateLoading, 
      isError: usrPrivateError,
      refetch: refetchUserPrivateData
    } = useQuery('getUserPrivateData', 
    () => GetUser(userGuid), {enabled: !!userGuid})

    const {
      data: userActions,
      isLoading: isActionsLoading, 
      isError: isActionsError,
      refetch: refetchUserActions
    } = useQuery('getUserAction', () => GetUserActions(userGuid), {enabled: !!userGuid})


    
  useEffect(() => {
    if(!switched){
      if(!autoRefreshActivated && time !== '5'){
        dispatch(TopnavbarAction.setTimetorefetch('5'))
      }
    }
  }, [switched])

  useEffect(() => {
    if(menuName==='profile')
      setDisableOutClick(true)
    else setDisableOutClick(false)
  }, [menuName])


  useEffect(() => {
    if(!socket) return
    const getFirms = (firms: UserFirms<string>[]) => {
      dispatch(TopnavbarAction.setFirmsList(firms))
    }
    const disconnectMess = (response: DisconnectedType) => {
      const {room, connected, last_conn_dt} = response
      setDisClient(prev => ({...prev, room, connected, last_conn_dt}))
    }
    const reconnected = (state: boolean) => {
      setReconnected(state)
    } 

    socket.on('list_clients', getFirms)
    socket.on('disconnection_message', disconnectMess)
    socket.on('reconnected', reconnected)
    return () => {
      socket.off('list_clients', getFirms)
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


  /// note: this side effect is to set receiver in case it isn't connected  
  useEffect(() => {
    if(!receiver.connected && CheckObjOrArrForNull(firmsList)){
      for(let i = 0; i < firmsList.length; i++){
        const firm = firmsList[i]
        if(firm.connected){
          dispatch(TopnavbarAction.setReceiver({
            connected: firm.connected,
            value: firm.value,
            label: firm.label
          })); break
        } 
      }
    }
  }, [firmsList])

  useEffect(() => {
    if((renewDashboard || renewReport) && isStrEmpty(receiver.value)){
      const initEndPoint = '/get'
      const path = match.pathname
      if(path==='/dashboard'){  /// not the dashboard details
        const endPoint = `${initEndPoint}/dashboard/`
        refetchData({socket,dispatch,path,receiver,endPoint,date})
      }else if(path==='/report'){ ///details run here
        dispatch(ReportAction.setReportData([]))
        const endPoint = `${initEndPoint}/report/${endUrl}`
        refetchData({socket,dispatch,path,receiver,endPoint,field,date: {startDate,endDate}})
      }
    }
  }, [renewDashboard, renewReport])

  useEffect(() => {
    if(autoRefreshActivated && receiver.connected){
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
    if(checkDisconnectedClient(disClient) && CheckObjOrArrForNull(firmsList)){
      dispatch(TopnavbarAction.updateFirmsOnDisconnect(disClient, t))
      dispatch(DashboardAction.setDashboardSettings({task: 'both', bool: false}))
      if(fetcher.details || fetcher.refetch)
        dispatch(DashboardAction.liberateFetcher())
      setDisClient(prev => ({...prev, room: "", connected: false, last_conn_dt: ""}))
    }
  }, [disClient])

  useEffect(() => {
    if(
      activeIndex===0 && moment(startDate).isAfter(moment(endDate)) || 
      activeIndex===0 && moment(startDate).isSame(moment(endDate))
    )
      dispatch(TopnavbarAction.setReportEndDate(moment(startDate).add(1, 'days').format('YYYY-MM-DD')))
  }, [startDate])

  useEffect(() => {
    if(refetchUserData)
      refetchUserSubsc()
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
          result += item + ' ' + t(locale) + ' '
        }
      }
      setSubscFullDate(result)
    }
  }, [userSubscData, language])

  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }
  const setShowTimeModal = () => {
    dispatch(FormAction.setShowTimeModal(!isShowTimeModal))
  }

  const Renew = () => {
    if(userSubscData?.subsc_name === "Null") 
      toast.error(t('subscribeFirst'))
    else {

      if(isStrEmpty(receiver.value) && receiver.connected){
        if(match.pathname === '/dashboard'){
          
            if(isDtlTblOpen && !isDetsLoading)
              dispatch(DashboardAction.fetchData('details', true))
            else if(!isDtlTblOpen && !cashesLoading) 
              dispatch(TopnavbarAction.setRenewDashboard(true))
        }else if(match.pathname === '/report' && !isReportsDataLoading){
          dispatch(TopnavbarAction.setRenewReport(true))
        }else if(match.pathname === '/forecast'){
          console.log('happy to be in forecast page')
        }
      }else 
        toast.error(t('select_firm'))
    }

  }

  /// usememo components
  const maxDate = useMemo(() => {
    let oneYearAfter = moment(new Date()).add(1,'years')
    if(oneYearAfter.month() !== 11 || oneYearAfter.date() !== 31){
      oneYearAfter.month(11).date(31)
    }
    return oneYearAfter
  }, [new Date()])

  const userProfileItself = useMemo((): JSX.Element => {
    if(
      (!usrPrivateLoading && !usrPrivateError) 
      // (!isActionsLoading && !isActionsError)
    ) {
      
    return (
      <UserProfile 
        userData={userPrivateData?.[0] ?? {}} 
        userActions={{data: userActions, loading: isActionsLoading, error: isActionsError}}
        userGuid={userGuid}
        onSuccess={(newValues) => {
          const {user_email, user_name, user_login} = newValues
          localStorage.setItem('authUser', JSON.stringify({
            ...authUser, user_name
          }))
          localStorage.setItem('UserPhone', user_login.replace('+993', ''))
          refetchUserSubsc()
          refetchUserPrivateData()
        }}
        showSideabar={showSidebar}
      />
    )
    }

    return <></>
  }, [userPrivateData, userActions, showSidebar])

  const timeModalItself = useMemo((): JSX.Element => {
    return isShowTimeModal ? (
      <SelectTime 
        show={isShowTimeModal} 
        setShow={setShowTimeModal}
      />
    ) : <></>
  }, [isShowTimeModal])


  const firms = useMemo(() => {
    return (
      <Firms
        show={showFirms}
        data={firmsList}
        setShow={() => setShowFirms(false)}
        translation={t}
      />
    )
  }, [showFirms, firmsList])


  const siderbarFilterMenu = (
    <div className={styles.sideBar}>
      <div className={styles.topBtnGroup}>
      <Row rowGutter={7} colGutter={10}>
        <Col>
          {

            match.pathname === '/dashboard' ? 
              <div className={styles.headInput}>
                <Input
                  type='date'
                  id="dashboardDateInput"
                  min='2000-01-01'
                  max={maxDate.format('YYYY-MM-DD')}
                  value={date}
                  onChange={(e) => {
                    const input: any = document.getElementById("dashboardDateInput");
                    const selectedDate = moment(e.target.value).format("YYYY-MM-DD")
                    const min = input.min
                    const max = input.max
                    if (selectedDate < min || selectedDate > max) {
                      input.value = "";
                    }else {
                      dispatch(TopnavbarAction.setDashboardDate(selectedDate)) 
                    }
                  }}
              />
              </div> : 
            match.pathname === '/report' ? 
            <div className={styles.headInput}>
              <Input
                type='date'
                min='2000-01-01'
                max={maxDate.format('YYYY-MM-DD')}
                id='reportDateInput1'
                value={startDate}
                onChange={(e) => {
                  const input: any = document.getElementById('reportDateInput1')
                  const selectedDate = moment(e.currentTarget.value).format('YYYY-MM-DD')
                  const min = input.min
                  const max = input.max
                  if (selectedDate < min || selectedDate > max) {
                    input.value = "";
                  }else {
                    
                    if (
                      moment(e.currentTarget.value).isBefore(moment(endDate)) || 
                      (activeIndex===0 && moment(e.currentTarget.value).isAfter(moment(endDate))) || 
                      (activeIndex===0 && moment(e.currentTarget.value).isSame(endDate))
                    )
                      dispatch(TopnavbarAction.setReportStartDate(e.currentTarget.value))
                    else dispatch(TopnavbarAction.setReportStartDate(moment(endDate).subtract(1, 'days').format('YYYY-MM-DD')))

                  }
                }}
                style={{borderRight: '1px solid #ccc'}}
                />
                <Input
                  disabled={activeIndex === 0}
                  type='date'
                  min='2000-01-01'
                  max={maxDate.format('YYYY-MM-DD')}
                  id='reportDateInput2'
                  value={endDate}
                  onChange={(e) => {
                    const input: any = document.getElementById('reportDateInput1')
                    const selectedDate = moment(e.currentTarget.value).format('YYYY-MM-DD')
                    const min = input.min
                    const max = input.max
                    if(selectedDate < min || selectedDate > max){
                      input.value = "";
                    }else {
                      if (moment(e.currentTarget.value).isAfter(moment(startDate)))
                        dispatch(TopnavbarAction.setReportEndDate(e.currentTarget.value))
                      else dispatch(TopnavbarAction.setReportEndDate(moment(startDate).add(1, 'days').format('YYYY-MM-DD')))
                    }
                  }}
                />  
            </div> : 
            null
          }
        </Col>

        <Col>
          <Button onClick={() => setShowFirms(true)} style={{padding: '13px',display:'flex',justifyContent:'center',alignContent:'center'}}  rounded type="contained" color="gray" 
            endIcon={
              showFirms ? 
                <img src={arrow_up} width={10} height={10}/> :
                  <img src={arrow_down} width={10} height={10}/>  
            }
          >
            {receiver.connected ? receiver.label : t('selectFirm')}
          </Button>
        </Col>
        
        <Col>
          <Button color="theme" style={{width: '97px',display:'flex',justifyContent:'center',alignContent:'center'}}  startIcon={<i className='bx bx-refresh' style={{fontSize: 20}}></i>} rounded onClick={Renew}>
            {t('refresh')}
          </Button>
        </Col>
        <Col>
          <div className={styles.topSwitchBox}>
            <Switch 
              checked={switched}
              onClick={() => {
                if(userSubscData?.subsc_name === "Null")
                  toast.error(t('subscribeFirst'))
                else {
                    if(!receiver.connected)
                      toast.error(t('select_firm'))
                    else {
                      dispatch(TopnavbarAction.setSwitched(!switched))
                      if(!switched)
                        dispatch(FormAction.setShowTimeModal(!isShowTimeModal)) 
                      if(autoRefreshActivated)
                        dispatch(TopnavbarAction.activateAutoRefresh(false));
                  } 

                }            
              }}
            />
            <span className={styles.filterTitle}>
            {t('autoRefresh')}
            </span>
            <span className={styles.filterTitle}>{autoRefreshActivated && time ? `${time} ${t('minutes')}.` : null}</span>
          </div>
        </Col>
      </Row>
      </div>
    {/* } */}
  </div>
  )
  const renderUserMenu = (
    <div className={styles.userDrpdown}>
      <div className={styles.subsc_head}>
        <h4 className={styles.subscription}>{t('subs')}</h4>
        {/* <span><i className="bx bxs-info-circle"></i></span> */}
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

      {firms}
      {/* {firmsModalItself} */}
      {timeModalItself}

      <div className={styles.topnav}>
        <div className={styles.menuIcon} onClick={() => toggleSidebar()}>
          {isOpenSideBar? <GrClose size={24}/> : <HiOutlineMenu size={24}/> }
        </div>
        <div className={styles.topnav__right_item}>
            {/* filter dropdown */}
            <Dropdown
              removeOutClick={showFirms || isShowTimeModal} // disable outclick when watching firms/ or setting timer
              dropDownContentStyle={{left: '10px', padding: '14px'}}
              transformOrigin='topLeft'
              customToggle={() => <div className={styles.filterIcon}><TbAdjustmentsHorizontal size={24} /></div>}
              renderBody={siderbarFilterMenu}
            />
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
          <div className={styles.topnav__right_item} onClick={() => {setShowSidebar(true), setMenuName('theme')}}>
            <i className="bx bx-palette"></i>
          </div>
              
          <RightSidebar menuRef={menu_ref} showMenu={showSidebar} setShowMenu={setShowSidebar} sidebarName={menuName}>
            { 
              // menuName == 'filter' ? 
              // siderbarFilterMenu
              // : 
              menuName == 'profile' ?
              userProfileItself
              : 
              menuName == 'theme' ?
              <Themes />
              :
              null
            }
          </RightSidebar>

        </div>
      </div>
    </>
  );
};

export default TopNavbar;
