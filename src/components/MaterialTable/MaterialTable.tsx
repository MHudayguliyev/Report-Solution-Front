//@ts-nocheck
import React, {useState, useEffect, useMemo, useRef} from 'react'
import { useAppSelector,useAppDispatch }  from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
import MaterialReactTable, { 
  MRT_FullScreenToggleButton,
  MRT_PaginationState, 
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton, 
  type MRT_RowSelectionState,
  MRT_ToggleDensePaddingButton, type MRT_ColumnDef } from 'material-react-table';
import { CheckIfArray, CheckObjOrArrForNull, capitalize, isDateValid, isStrEmpty  } from '@utils/helpers';
import { createTheme, darken,  ThemeProvider } from '@mui/material';
import { makeStyles } from "@material-ui/core";
import { MRT_Localization_RU as rus} from 'material-react-table/locales/ru';
import { MRT_Localization_EN as eng} from 'material-react-table/locales/en';
import { ruRU as ru, enUS as en } from '@mui/material/locale';
import tm from '@app/locales/tm/table-translation.json'
// styles
import styles from './MaterialTable.module.scss'
import classNames from 'classnames/bind';
/// moment js
import moment from 'moment';
// complibraries 
import Button from '@app/compLibrary/Button'
// components 
import DropDownSelect from '../DropDownSelect/DropDownSelect';
/// json data
import tableLocalization from '@app/assets/JsonData/table-localization.json' assert {type: 'json'}
/// redux actions
import ReportAction from '@redux/actions/ReportAction';
import AdminAction from '@redux/actions/AdminAction'
/// types
import { AllAdminUsers } from '@app/api/Types/queryReturnTypes/Admin';
import { FieldType, Localization } from '@app/redux/types/ReportTypes';
import { AdminFilterOptions } from '@app/Types/utils';
// svgs
import AddUserSvg from '../Icons/AddUser';
import DeleteUserSvg from '../Icons/DeleteUser';

type TableProps = {
    data: any
    show: boolean
    setShow: (scrollY: number) => void
    translation?: Function | any
    isLoading?: boolean
    tableName?: any
    onLanguageChange?: Function | any
    onFirmOrSubscChange?: (data: any) => void
    paperData: {typeID: number | null, paperName: string, yPosition?: number},
    /** @defaultValue true */
    enablePagination?: boolean
    /** @defaultValue false */
    enableColumnResizing? : boolean
    /** @defaultValue false */
    enableStickyHeader?: boolean
    /** @defaultValue comfortable */
    density?: 'compact' | 'comfortable' | 'spacious',
    /** @defaultValue false */
    renderCustomDashboardActions?: boolean
    /** @defaultValue false */
    renderCustomAdminActions?: boolean
    /** @defaultValue false */
    renderCustomAdminFilter?: boolean
    adminFilterOptions?: AdminFilterOptions[]
    /** @defaultValue false */
    ignoreAdminRemoveBtn?: boolean
    adminActiveTab?: number
    onAdd?: (userGuids: string[]) => Promise<void> | (() => Promise<void>)
    onRemove?: (userGuids: string[]) => Promise<void> | (() => Promise<void>)
    /** @defaultValue false */
    renderBottomToolbarActions?: boolean
    /** @defaultValue 250px */
    heightToExtract?: '600' | '550' | '500' | '475' | '400' | '370' | '350'| '250' | '200' | '150' | '100'
    /** for report page */
    dropdownData?: FieldType[]
    tabs?: Localization[]
    onTabChange?: (index: number) => void
    field?: FieldType
    /** @defaultValue false */
    enableRowActions?: boolean
    onEdit?: (data : AllAdminUsers[]) => void
    /** @defaultValue false */
    enableRowSelection?: boolean
    /** @defaultValue true */
    enableMultiRowSelection?: boolean
    /** @defaultValue false */
    insideModal?:boolean
}

interface TableColType extends Localization {
  accessorKey: string, 
}

const cx = classNames.bind(styles)
const MaterialTable = (props: TableProps) => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const theme = useAppSelector(state => state.themeReducer)

  const useStyles = makeStyles(() => ({
    root: {
      "& .MuiPaper-root": {
        // padding: '15px',
      },
      "& .MuiToolbar-root": {
        overflow: 'visible', 
        background: theme.mode==='theme-mode-light' ? '#F7F6E7' : '#1b2430'
      },
      "& .MuiTableRow-head": {
        background: theme.mode==='theme-mode-light' ? '#ffffff' : '#2e313c',
      }
    }
  }));

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme.mode==='theme-mode-light' ? 'light' : 'dark', 
          background: {
            default:
              theme.mode === 'theme-mode-light'
                ? '#ffffff' 
                : '#2d2d2d', 
          }
        },
        typography: {
          fontFamily: [
            'Panton'
          ].join(','),
            button: {
            textTransform: 'none', 
            fontSize: '1.2rem',
          },
        },
      }),
    [theme],
  );

  const {
    data, 
    show,
    isLoading, 
    setShow, 
    translation,
    tableName,
    onLanguageChange,
    onFirmOrSubscChange, 
    paperData,
    enablePagination = true, 
    enableColumnResizing = false,
    enableStickyHeader = false,
    renderCustomDashboardActions = false,
    renderCustomAdminActions = false, 
    renderCustomAdminFilter = false, 
    adminFilterOptions, 
    adminActiveTab,
    ignoreAdminRemoveBtn = false, 
    onAdd,
    onRemove, 
    renderBottomToolbarActions = false,
    density = 'comfortable',
    heightToExtract = '250', 
    tabs,
    onTabChange, 
    dropdownData,
    field, 
    enableRowSelection = false,
    enableRowActions = false,
    onEdit,
    enableMultiRowSelection = true,
    insideModal = false
} = props

  const tableRef:any = useRef(null)
  const [count, setCount] = useState<number>(0)
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 64,
  });
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [name, setName] = useState<string>(tableName?.label??"")

  const finding = useMemo(() => {
    return data
  }, [data])

  const tableCols = useMemo((): TableColType[] => {
    return field !== undefined ? tableLocalization[paperData.paperName][field?.value] 
            : tableLocalization[paperData.paperName]
  }, [paperData, field])

  const cols = useMemo(() => {
    if(CheckObjOrArrForNull(finding)){
      setCount(finding?.length)
      return tableCols?.map(item => {
        return {
          accessorKey: item.accessorKey,
          header: item[language as keyof TableColType],
          enableColumnActions: !insideModal, 
          Cell: ({ cell }: {cell:any}) => {
            const id = cell.column.id
            const activeSt = id==='is_subsc_active'
            const expiredSt = id==='is_subsc_expired'
            const cancelledSt = id==='is_subsc_canceled'
            const activeUsrSt = id==='is_user_active'
            const usrConfirmed = id ==='is_user_confirm'

            if(
              (activeSt||expiredSt||cancelledSt||activeUsrSt||usrConfirmed)
            ){
              const realVal = cell.getValue()
              const value = realVal.toLocaleString()
              const locales = {
                  en: {
                    active: 'Active', notActive:'Not active',
                    expired: 'Expired', notExpired: 'Not expired', 
                    cancelled: 'Cancelled', notCancelled: 'Not cancelled',
                    confirmed: 'Confirmed', notConfirmed: 'Not confirmed'
                  }, 
                  tm: {
                    active: 'Aktiw', notActive: 'Aktiw däl', 
                    expired: 'Möhleti gutardy', notExpired: 'Möhleti gutarmady', 
                    cancelled: 'Ýatyryldy', notCancelled: 'Ýatyrylmadyk',
                    confirmed: 'Tassyklandy', notConfirmed: 'Tassyklanmady'
                  }, 
                  ru: {
                    active: 'Активен', notActive: 'Неактивен', 
                    expired: 'Истек', notExpired: 'Не истек', 
                    cancelled: 'Отменено', notCancelled: 'Не отменено',
                    confirmed: 'Подтверждён', notConfirmed: 'Не подтверждено'
                  }
                }
                const locale = locales[language]
                return (
                  <div className={styles.statuses}>
                    <span
                      className={cx({
                        status: true,
                        [`state${capitalize(value)}`]: (expiredSt||cancelledSt),
                        [`active${capitalize(value)}`]:  (activeSt||activeUsrSt||usrConfirmed)
                      })}
                    ></span>
                    <div>
                      {
                        realVal&&activeSt ? locale['active']:
                        realVal&&expiredSt ? locale['expired'] : 
                        realVal&&cancelledSt ? locale['cancelled'] : 
                        realVal&&activeUsrSt ? locale['active'] : 
                        realVal&&usrConfirmed ? locale['confirmed'] :
                        !realVal&&activeSt ? locale['notActive'] :
                        !realVal&&expiredSt ? locale['notExpired'] : 
                        !realVal&&cancelledSt ? locale['notCancelled'] : 
                        !realVal&&activeUsrSt ? locale['notActive'] :
                        !realVal&&usrConfirmed ? locale['notConfirmed'] : ""
                      }
                    </div>
                  </div>
                )
            }else if(
              (id==='subsc_start_date'||
              id==='subsc_end_date'||
              id==='action_crt_mdf_dt'||
              id==='ord_date'||
              id==='inv_date'
              )
              ){
                const date = cell.getValue()
                if(isDateValid(date)){
                  const formattedDt = id==='ord_date'||id==='inv_date' ? 
                                      moment(date).format('HH:MM:SS') : 
                                        moment(date).format('DD.MM.YYYY HH:MM')
                  return formattedDt
                }
                return date
              }else if(id==='action_amount'||id==='user_balance'){
                return (
                  <div className={cx({
                    redify: cell.getValue().toLocaleString().startsWith('-')
                  })}>
                    {cell.getValue()}
                  </div>
                )
              }
            return <>{cell.getValue()}</>
          }
        }
      }) 
    }
    return []
  }, [finding,language])

  const rowsPerPageOptions = useMemo(() => {
    const tempLimitNumber = 1024
    let rowsPerPageArr = [64,128,256,512,tempLimitNumber]
    return count > tempLimitNumber ? rowsPerPageArr = [...rowsPerPageArr, count] : rowsPerPageArr
  }, [count])

  useEffect(()=> {
    if(onLanguageChange) 
      onLanguageChange(tableName)
  }, [language])

  useEffect(() => {
    if(typeof tableName !== 'undefined'){
      const {value, label} = tableName
      if(
        (value==='purchase'||value==='returnOfPurchace'||
        value==='sale'||value==='returnOfSold') 
        && language==='ru'
      ){
        if(value==='purchase')
          setName('Фактуры закупок')
        else if(value==='sale')
          setName('Фактуры продаж')
        else if(value==='returnOfPurchace')
          setName('Фактуры по возвратам')
        else if(value==='returnOfSold')
          setName('Фактуры по продажам')
      }else {

        if(
          (value==='purchase'||value==='returnOfPurchace'||
          value==='sale'||value==='returnOfSold')
        )
          setName(label + ' ' + translation('adders.invoice'))
        else if(value==='creditsFromSale')
          setName(label + ' ' + translation('adders.credFromSale'))
        else if(value==='debtsFromPurchace')
          setName(label + ' ' + translation('adders.debtsFromPurch'))
        else 
          setName(tableName?.label)
      }
    }
  }, [tableName])

  useEffect(() => {
    if(CheckObjOrArrForNull(rowSelection) && !enableMultiRowSelection)
      onFirmOrSubscChange(tableRef?.current.getSelectedRowModel()?.flatRows?.[0]?.original)
  }, [rowSelection]);

  useEffect(() => {
    /// remove checked box when tab changes
    setRowSelection({}) 
  },[adminActiveTab])

  const classes = useStyles();
  const dispatch = useAppDispatch()
  const activeTabIndex = useAppSelector(state => state.reportReducer.activeTabIndex)
  const adminSelectedUsrGuid = useAppSelector(state => state.adminReducer.userGuid)

  return (
    <>
      {
        show ? 
        <div className={cx({
          table__container: true
        })}>
          <div className={classes.root}>
            <ThemeProvider theme={createTheme(tableTheme, )}>
              <MaterialReactTable
                tableInstanceRef={tableRef}
                localization={language === 'en' ? eng : language === 'ru' ?  rus : tm}
                enableColumnResizing={enableColumnResizing} 
                enableStickyHeader={enableStickyHeader}
                enableRowActions={enableRowActions}
                enableMultiRowSelection={enableMultiRowSelection}
                enablePagination={enablePagination}
                enableRowSelection={enableRowSelection}
                columnResizeMode="onChange" 
                positionToolbarAlertBanner="none"  
                onPaginationChange={setPagination}
                onRowSelectionChange={setRowSelection} 
                muiTablePaginationProps={{rowsPerPageOptions}}
                renderToolbarInternalActions={({ table }) => (
                  <>
                    <span onClick={() => setShowSearch(!showSearch)} className={cx({
                      globalSearch: true, 
                      whitify: theme.mode == 'theme-mode-dark'
                    })}><i className='bx bx-search'></i>
                    </span>
                    <MRT_ToggleFiltersButton table={table} />
                    {insideModal ? "" : <MRT_ShowHideColumnsButton table={table} />}
                    <MRT_ToggleDensePaddingButton table={table} />
                    <div onClick={() => setIsFullScreen(!isFullScreen)}>
                      <MRT_FullScreenToggleButton table={table} />
                    </div>
                  </>
                )}
                renderRowActions={({row, table}) => {
                  return (
                    <i className='bx bx-edit' style={{fontSize: '26px'}}
                      onClick={() => {
                        const userGuid = row.original?.user_guid
                        if(userGuid===adminSelectedUsrGuid)
                          dispatch(AdminAction.forceUpdateUserGuid(true))
                        else dispatch(AdminAction.setUserGuid(userGuid))
                      }}
                    >
                    </i>
                    ) 
                }}
                // renderRowActionMenuItems={({row, table}) => {
                //   console.log('row', row)
                //   return (
                //     <i className='bx bx-edit' style={{fontSize: '26px'}}></i>
                //     ) 
                // }}
                renderTopToolbarCustomActions={({ table }) => {
                  const userGuids = table.getSelectedRowModel().flatRows?.map(row => row?.original?.user_guid)
                  return (
                    <>
                      <div className={cx({
                        topToolBar: true,
                        addWidthToTopToolbar:enableRowActions||renderCustomDashboardActions
                      })}>
                        {
                          enableRowActions && 
                          <>
                            <Button 
                              disable={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} 
                              type='contained' 
                              color='theme' 
                              rounded
                              onClick={() => onEdit(table.getSelectedRowModel()?.flatRows?.map(row => row.original))}
                            >
                              Fill balance
                            </Button>
                          </>
                        }
                        {
                          renderCustomAdminActions && 
                          <div className={styles.adminActionsWrapper}>
                            <div style={{fontSize: '25px', marginLeft: '6px',}} onClick={() => onAdd(userGuids)}>
                              <AddUserSvg />
                            </div>
                            {
                            ignoreAdminRemoveBtn ? 
                            "" : 
                            <div style={{fontSize: '25px', color:'#EB1D36'}} onClick={() => onRemove(userGuids)}>
                              <DeleteUserSvg />
                            </div>
                            }
                            {
                              renderCustomAdminFilter && 
                              <div >
                                <select onChange={e => console.log('e', e.target.value)}>
                                  {adminFilterOptions?.map((item, i) => (
                                    <option key={i} value={item.value}>{item[language as string]}</option>
                                  ))}
                                </select>
                              </div>
                            }
                          </div>
                        }
                        {
                          renderCustomDashboardActions && 
                          <span 
                            title='back' 
                            onClick={() => {setShow(paperData?.yPosition ?? 0); setShowSearch(false)}}   
                            className={cx({
                              chevron__left: true, 
                              whitify: theme.mode === 'theme-mode-dark'
                            })}
                          >
                            <i className='bx bx-arrow-back'></i>
                          </span>
                        }
                        {
                          isStrEmpty(name) && 
                          <h4
                            className={cx({
                              tableTitle: true,
                              addMarginToTitle: renderCustomDashboardActions||enableRowActions
                            })}
                          >
                            {name}
                            </h4>
                        }
                        {
                          tabs ? tabs?.map((tab: any, index: number) => (
                            <div key={index} className={styles.tablePanel} 
                              onClick={() => {
                                if(!isLoading)
                                  onTabChange(index)
                              }
                              }
                              >
                             <span className={cx({activeIndex: activeTabIndex===index})}>{tab[language]}</span> 
                            </div>
                          ))  : ""
                        }
                      </div>
                    </> 
                    ) 
                }
                }
                renderBottomToolbarCustomActions={() => 
                  renderBottomToolbarActions ? 
                  <>
                    <div className={styles.dropDown}>
                      <label>{translation && translation('groupBy')}</label>
                      <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                        <DropDownSelect 
                          titleSingleLine
                          title={field!.label[language] ?? dropdownData![0].label[language]}
                          dropDownContentStyle={{right: '0'}}
                          data={dropdownData}
                          onChange={(item: any) => dispatch(ReportAction.setField(item))}
                          fetchStatuses={{ isLoading, isError: false }}
                          position='up'
                          language={language}
                        />
                      </div>
                    </div>
                  </> : <div className={`${styles.filterSelect}`}/>
                }
                muiTableContainerProps={{ 
                  sx: { 
                    height: isFullScreen ? '100vh' : `calc(100vh - ${heightToExtract}px)`,
                    background: theme.mode==='theme-mode-light' ? '#ffffff' : '#2e313c',
                    scrollbarWidth: 'thin',
                    scrollBehavior: 'smooth',
                    overflowY: 'overlay',
                    "&::-webkit-scrollbar": {
                        width: 10,
                        height: 10, 
                        background: 'transparent'
                      },
                      // "&::-webkit-scrollbar-track": {
                      //   backgroundColor: "transparent"
                      // },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#edf2f7",
                        borderRadius: 10
                      }

                  
                  } 
                }}
                muiTableBodyRowProps={() => ({
                  sx: {
                    cursor: 'pointer',
                    background: theme.mode==='theme-mode-light' ? '#ffffff' : '#2e313c',
                  }
                })}          
                muiLinearProgressProps={({ isTopToolbar }) => ({
                  sx: {
                    display: isTopToolbar ? 'block' : 'none',
                  }
                })}
                muiSearchTextFieldProps={{
                  sx: { width: '200px' },
                }} 
                muiTableHeadCellProps={{
                  sx: {
                    color: theme.mode === 'theme-mode-light' ? '#070708' : '#ffffff',
                    fontWeight: 700, 
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    color: theme.mode === 'theme-mode-light' ? '#070708' : '#ffffff',
                    fontWeight: 450
                  },
                }}
                columns={cols ?? []}
                data={finding ?? []} 
                initialState={{pagination: { pageSize: pagination.pageSize, pageIndex: pagination.pageIndex },
                density, columnVisibility: {is_prepayment: false,}}}
                state={{isLoading, pagination, showGlobalFilter: showSearch,rowSelection}}
              /> 
            </ThemeProvider>
          </div>
      </div> : 
      null
      }
    </>
  )
}

export default MaterialTable