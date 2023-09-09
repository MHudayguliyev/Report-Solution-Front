import React, { useEffect, useMemo, useState } from 'react'
import MaterialTable from '@app/components/MaterialTable/MaterialTable'
import Users from '@app/components/Modals/Users/Users'
import { useQuery } from 'react-query'
import { GetAdminFirms,  GetAdminUsers, GetAllAdminUsers } from '@app/api/Queries/Getters'
import { CheckObjOrArrForNull } from '@utils/helpers'
import { unsetFromFirm } from '@app/api/Queries/Post'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Localization } from '@app/redux/types/ReportTypes'

//styles
import classNames from 'classnames/bind'
import styles from './Admin.module.scss'
import BalanceOperationModal from '@app/components/Modals/BalanceOperation'
import { AllAdminUsers, MtrlTableAllAdminUsers } from '@app/api/Types/queryReturnTypes/Admin'
import { TableNameType } from '@app/Types/utils'
// redux selectors/dispatcher
import { useAppSelector, useAppDispatch } from '@app/hooks/redux_hooks'
// redux actions
import AdminAction from '@redux/actions/AdminAction'
import SubscriptionModal from '@app/components/Modals/Subscription'
 
const cx = classNames.bind(styles)
const Admin = () => {
  const dispatch = useAppDispatch()
  const { i18n, t } = useTranslation()
  const language = i18n.language

  // redux states
  const foreignRefetchCommand = useAppSelector(state => state.adminReducer.refetchState)

  const [activeTab, setActiveTab] = useState<number>(0)
  const [tableName, setTableName] = useState<TableNameType>({
    label: "", value: ""
  })
  const [backendGuid, setBackendGuid] = useState<string>("")
  const [assUsers, setAssUsers] = useState<any>([])
  const [selectedUsrData, setSelectedUsrData] = useState<MtrlTableAllAdminUsers[]>([])
  const [openBalanceOper, setOpenBalanceOper] = useState<boolean>(false)
  const [openSubscribtion, setOpenSubscribtion] = useState<boolean>(false)
  const [showUnsetUsrModal, setShowUnsetUsrModal] = useState<boolean>(false)
  // queries
  const {
    data: firms, 
    refetch: refetchFirms
  } = useQuery('getAdminFirms', () => GetAdminFirms())

  const {
    data: assignedUsers, 
    isLoading: isAssignedUsersLoading, 
    isError: isAssignedUsersError,
    refetch: refetchAssignedUsers
  } = useQuery(['getAdminAssignedUsers', backendGuid], 
    () => GetAdminUsers({backendGuid, assigned:true}), {enabled: !!backendGuid})

  const {
    data: unAssignedUsers, 
    isLoading: isUnAssignedUsersLoading, 
    isError: isUnAssignedUsersError,
    refetch: refetchUnAssignedUsers
  } = useQuery(['getAdminUnAssignedUsers', backendGuid], 
      () => GetAdminUsers({backendGuid, assigned: false}), {enabled: !!backendGuid})
  const {
    data: allAdminUsers, 
    isLoading:isAllUsersLoading, 
    isError: isAllUsersError, 
    refetch: refetchAllUsers
  } = useQuery(['getAllAdminUsers', activeTab], () => GetAllAdminUsers(), {enabled: activeTab===1})
  // console.log('allAdminUsers', allAdminUsers)
  function SetNameFN(data: TableNameType) {
    setTableName(prev => ({...prev, value: data.value, label: data.label}))
  }

  useEffect(() => {
    if(foreignRefetchCommand){
      if(activeTab===0)
        refetchFirms()
      else refetchAllUsers()
      dispatch(AdminAction.setRefetchState(false)) // got it
    }
  }, [foreignRefetchCommand])

  useEffect(() => {
    if(!isAssignedUsersError && !isAssignedUsersLoading)
      setAssUsers(assignedUsers)
  }, [assignedUsers])

  useEffect(() => {
    if(activeTab===0)
      SetNameFN({value: 'selectFirm', label: t('selectFirm')})
    else if(activeTab==1)
      SetNameFN({value: 'users', label:t('users')})
    /// empty this data when tab changes 
    setAssUsers([])
  }, [activeTab])

  const paperDataMem = useMemo(() => {
      return {
        firms: {typeID: 0,paperName: "firms"},
        users: {typeID: 0,paperName: "users"}, 
        allUsers: {typeID: 0,paperName: "allUsers"},
        subscriptions: {typeID: 0,paperName: "subscriptions"},
        usersOfSubscription: {typeID: 0,paperName: "usersOfSubscription"},
      }
  }, [])
  
  const tabs = useMemo(() => {
    const innerTabs: Localization[] = [
      {en: 'Set users to firms', ru: 'Set users to firms', tm: 'Set users to firms'}, 
      {en: 'User balance', ru: 'User balance', tm: 'User balance'}, 
      // {en: 'Subscriptions', ru: 'Subscriptions', tm: 'Subscriptions'}
    ]

    return (
      <div className={styles.tabs}>
        {
          innerTabs.map((tab, i) => (
            <div 
              className={cx({
                tab: true,
                active: activeTab===i
              })} 
              onClick={() => setActiveTab(i)}
              key={i}
            >
              <span>{tab[language as keyof Localization]}</span>
            </div>
          ))
        }
      </div>
    )
  }, [activeTab])


  const balanceOperationModal = useMemo(() => {
    return (
      <BalanceOperationModal 
        show={openBalanceOper}
        setShow={() => setOpenBalanceOper(false)}
        onSuccess={() => refetchAllUsers()}
        data={selectedUsrData}
        translation={t}
      />
    )
  }, [openBalanceOper])  

  const subscriptionsModal = useMemo(() => {
    return (
      <SubscriptionModal 
        show={openSubscribtion}
        setShow={() => setOpenSubscribtion(false)}
        onSuccess={() => refetchAllUsers()}
        data={selectedUsrData}
        translation={t}
      />
    )
  }, [openSubscribtion])

  const unSetUsersModal = useMemo(() => {  // modal with table in
    if(showUnsetUsrModal && CheckObjOrArrForNull(unAssignedUsers)){
      return (
        <Users 
          show={showUnsetUsrModal}
          setShow={setShowUnsetUsrModal}
          onSuccess={() => {
            refetchAssignedUsers()
            refetchUnAssignedUsers()
          }}
          data={unAssignedUsers!}
          fetchStatues={{
            isError:isUnAssignedUsersError, 
            isLoading: isUnAssignedUsersLoading
          }}
          paperData={activeTab===0?paperDataMem.users:paperDataMem.usersOfSubscription}
          backendGuid={backendGuid}
          translate={t}
        />
      )
    }else{
      setShowUnsetUsrModal(false) 
      return (
        <></>
      )
    }
}, [showUnsetUsrModal])

  // const filterOptions = useMemo(() => {
  //   return [
  //     {value: 'notExpired', en: 'Not expired', ru: 'Не истекший', tm: 'Möhleti gutarmadyklar'},
  //     {value: 'expired',en: 'Expired', ru: 'Истекший', tm: 'Möhleti gutaranlar'}, 
  //     {value:'all', en: 'All', ru: 'Все', tm: 'Hemmesi'}
  //   ]
  // }, [])


  return (
    <div className={styles.wrapper}>
      {tabs}
      {unSetUsersModal}
      {balanceOperationModal}
      {subscriptionsModal}
      <div className={styles.tables}>
        <div className={styles.firms}> 
        {/* left side table */}
          <MaterialTable
            show={activeTab===0}
            setShow={() => {}}
            onFirmOrSubscChange={data => {
              setBackendGuid(data.backend_guid as string)
            }}
            data={firms}
            paperData={paperDataMem.firms}
            tableName={tableName}
            onLanguageChange={(data:any) => {
              SetNameFN({value: data.value, label: t(data.value)})
            }}
            translation={t}
            density={'compact'}
            heightToExtract='270'
            columnSize={25}
            enableRowSelection
            enableColumnResizing
            enableMultiRowSelection={false}
            adminActiveTab={activeTab}
          />
        </div>
        <div className={styles.users}>
          {/* right side table */}
          <MaterialTable
            show={activeTab===0}
            setShow={() => {}}
            data={assUsers}
            paperData={paperDataMem.users}
            density={'compact'}
            heightToExtract='270'
            columnSize={80}
            enableRowSelection
            enableMultiRowSelection
            renderCustomAdminActions
            renderCustomAdminFilter={activeTab===2}
            // adminFilterOptions={filterOptions}
            translation={t}
            onAdd={async () => {
              setShowUnsetUsrModal(true)
            }}
            onRemove={async (userGuids) => { 
              if(CheckObjOrArrForNull(userGuids)){
                try {
                  await unsetFromFirm(userGuids, backendGuid)
                  refetchAssignedUsers()
                  refetchUnAssignedUsers()
                } catch (error) {
                  console.log('error', error)
                }
              }else toast.error(t('noUsrtoRemove'))
            }}
          />
        </div>
      </div>

      <div className={styles.allUsers}>
          <MaterialTable 
            heightToExtract='270'
            columnSize={180}
            show={activeTab===1}
            setShow={() => {}}
            data={allAdminUsers}
            isLoading={isAllUsersLoading}
            paperData={paperDataMem.allUsers}
            tableName={tableName}
            translation={t}
            enableRowSelection
            enableRowActions
            onRowActionBalance={data => {
              setSelectedUsrData(data)
              setOpenBalanceOper(true)
            }}
            onRowActionsSubsc={data => {
              setSelectedUsrData(data)
              setOpenSubscribtion(true)
            }}
          />
      </div>

    </div>
  )
}

export default Admin