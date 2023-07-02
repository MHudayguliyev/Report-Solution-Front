import React, {useState} from 'react'
import MaterialTable from '../MaterialTable/MaterialTable'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { GetUserActions } from '@app/api/Queries/Getters'

 const UserActionTable = () => {
    const {t} = useTranslation()
    const authUser = JSON.parse(localStorage.getItem('authUser')!) || null
    const userGuid:string = authUser?.user_guid ?? '' 
    const [paperData, setPaperData] = useState<{typeID: number | null, paperName: string}>({typeID: 0,paperName: "user_actions"})


    const {
        data: UserActions,
        isError: isRolesError,
        isLoading: isRolesLoading,
    } = useQuery('getUserAction', () => GetUserActions(userGuid), {enabled: !!userGuid})
    console.log('user action', UserActions)
    
  return (
    <div>
        <MaterialTable
              show
              setShow={() => {}}
              onGoBack={() => {}}
              data={UserActions}
              paperData={paperData}
              translation={t}
              isLoading={isRolesLoading}
              enableStickyHeader
              // renderBottomToolbarActions
              density={'compact'}
              // dropdownData={fields}
              // field={field}
        />
    </div>
  )
}


export default UserActionTable