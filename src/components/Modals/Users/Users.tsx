import React, { useEffect, useState } from 'react'
import { Modal } from '@app/compLibrary'
import CommonModalI from '../commonTypes'

// styles 
import styles from "./Users.module.scss";
import MaterialTable from '@app/components/MaterialTable/MaterialTable';
import { assignUsersToFirm } from '@app/api/Queries/Post';
import { AdminSubscribedUsers, AdminUsers, PostUsers } from '@app/api/Types/queryReturnTypes/Admin';
import { CheckObjOrArrForNull } from '@utils/helpers';
// react hot toast 
import toast from 'react-hot-toast'

interface UsersModalProps extends CommonModalI {
    data: AdminUsers[] | AdminSubscribedUsers[]
    fetchStatues: {isLoading: boolean, isError: boolean}
    onSuccess: Function
    paperData: {typeID: number | null, paperName: string, yPosition?: number}
    backendGuid: string
    translate:Function
}

const Users = (props: UsersModalProps) => {
    const {
        show, 
        setShow,
        data, 
        fetchStatues,
        onSuccess,
        paperData,
        backendGuid,
        translate
    } = props

    const [arr, setArr] = useState<AdminUsers[] | any>([])
    useEffect(() => {
        if(!fetchStatues.isError && !fetchStatues.isLoading)
            setArr(data)
    }, [data])

  return (
    <Modal
        className={styles.modalWrapper}
        isOpen={show}
        removePadding
        close={() => {
            setShow(false);
            setArr([])
        }}
        header={
            <div className={styles.header}> 
                {translate('selectUsers')}
            </div>
        }
    >
        <div className={styles.table}>
            <MaterialTable 
                show={show}
                setShow={() => {}}
                data={arr}
                paperData={paperData}
                enableRowSelection
                enableStickyHeader
                renderCustomAdminActions
                ignoreAdminRemoveBtn
                insideModal
                enablePagination={false}
                heightToExtract='350'
                density={'compact'}
                translation={translate}
                onAdd={async (userGuids) => {
                    if(CheckObjOrArrForNull(userGuids)){
                        try {
                            await assignUsersToFirm<PostUsers>({
                                to: 'firm',
                                firms: [backendGuid],
                                users: userGuids, 
                            })
                            onSuccess()
                            setShow(false)
                            // console.log('response', response)
                        } catch (error) {
                            console.log('error', error)
                        }
                    }else toast.error(translate('selectAtLeastAUser'))
                }}
            />
        </div>
    </Modal> 
  )
}

export default Users