//@ts-noCheck
import React, {useState, useEffect, useMemo} from 'react'
import { useAppSelector,useAppDispatch }  from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
import MaterialReactTable, { 
  MRT_FullScreenToggleButton,
  MRT_PaginationState, 
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton, 
  MRT_ToggleDensePaddingButton, type MRT_ColumnDef } from 'material-react-table';
import { CheckIfArray, CheckObjOrArrForNull  } from '@utils/helpers';
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
/// json data
import tableLocalization from '@app/assets/JsonData/table-localization.json' assert {type: 'json'}
import ReportAction from '@app/redux/actions/ReportAction';
import DropDownSelect from '../DropDownSelect/DropDownSelect';
import { FieldType, Localization } from '@app/redux/types/ReportTypes';

const setData = (data: any, name: {label:string, value:string}, t: Function) => {
  const dataClone = CheckIfArray(data) ? data?.map((item:any) => ({...item})) : []
  if(CheckObjOrArrForNull(dataClone) && name !== {}){
    if(
      name.label===t('purchase') ||
      name.label===t('returnOfPurchace') ||
      name.label=== t('sale')||
      name.label=== t('returnOfSold') || 
      name.label===t('actions')
    ){
      for(let i = 0; i < dataClone.length; i++){
        const item = dataClone[i]
        if(item.ord_date){
          item.ord_date = moment(item.ord_date).format('HH:MM:SS')
        }else if(item.inv_date){
          item.inv_date = moment(item.inv_date).format('HH:MM:SS')
        }else if(item.action_crt_mdf_dt){
          item.action_crt_mdf_dt = moment(item.action_crt_mdf_dt).format('DD.MM.YYYY HH:MM')
        }
      }    
    }
  }
  return dataClone
}

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiPaper-root": {
      padding: '5px'
    },
    "& .MuiToolbar-root": {
      overflow: 'visible'
    }
  }
}));


type TableProps = {
    show: boolean;
    setShow: Function
    translation: Function
    data: any,
    isLoading: boolean,
    tableName?: any,
    onLanguageChange?: Function | any
    paperData: {typeID: number | null, paperName: string},
    /** @defaultValue false */
    enableColumnResizing? : boolean,
    /** @defaultValue false */
    enableStickyHeader?: boolean
    /** @defaultValue comfortable */
    density?: 'compact' | 'comfortable' | 'spacious',
    /** @defaultValue false */
    renderCustomActions?: boolean,
    /** @defaultValue false */
    renderBottomToolbarActions?: boolean
    /** @defaultValue 250px */
    heightToExtract?: '600' | '550' | '500' | '475' | '400' | '350' | '250' | '200' | '150' | '100'
    /** for report page */
    dropdownData?: FieldType[]
    tabs?: Localization[],
    field?: FieldType
}

interface TableColType extends Localization {
  accessorKey: string, 
}

const cx = classNames.bind(styles)
const MaterialTable = (props: TableProps) => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const theme = useAppSelector(state => state.themeReducer)
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
    show,
    isLoading, 
    setShow, 
    translation,
    data, 
    tableName,
    onLanguageChange,
    paperData,
    enableColumnResizing = false,
    enableStickyHeader = false,
    renderCustomActions = false,
    renderBottomToolbarActions = false,
    density = 'comfortable',
    heightToExtract = '250', 
    tabs,
    dropdownData,
    field
} = props

  const [count, setCount] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 64,
  });
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [name, setName] = useState<string>(tableName?.label??"")

  const finding = useMemo(() => {
    return data ? setData(data, tableName??{}, translation) : []
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
    setName(tableName?.label)
  }, [tableName])

  const classes = useStyles();
  const dispatch = useAppDispatch()
  const activeTabIndex = useAppSelector(state => state.reportReducer.activeTabIndex)
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
                localization={language === 'en' ? eng : language === 'ru' ?  rus : tm}
                enableColumnResizing={enableColumnResizing} 
                enableStickyHeader={enableStickyHeader}
                columnResizeMode="onChange" 
                onPaginationChange={setPagination}
                muiTablePaginationProps={{rowsPerPageOptions}}
                renderToolbarInternalActions={({ table }) => (
                  <>
                    <span onClick={() => setShowSearch(!showSearch)} className={cx({
                      globalSearch: true, 
                      whitify: theme.mode == 'theme-mode-dark'
                    })}><i className='bx bx-search'></i>
                    </span>
                    <MRT_ToggleFiltersButton table={table} />
                    <MRT_ShowHideColumnsButton table={table} />
                    <MRT_ToggleDensePaddingButton table={table} />
                    <div onClick={() => setIsFullScreen(!isFullScreen)}>
                      <MRT_FullScreenToggleButton table={table} />
                    </div>
                  </>
                )}
                renderTopToolbarCustomActions={() => 
                  <>
                    <div className={cx({
                      topToolBar: renderCustomActions || tabs?.length
                    })}>
                      {renderCustomActions && <span title='back' 
                      onClick={() => {setShow(); setShowSearch(false)}}   
                      className={cx({
                        chevron__left: true, 
                        whitify: theme.mode === 'theme-mode-dark'
                      })}
                      >
                        <i className='bx bx-arrow-back'></i>
                      </span>}
                      {
                        name && <h4>{name}</h4>
                      }
                      {
                        tabs ? tabs?.map((tab: any, index: number) => (
                          <div key={index} className={styles.tablePanel} 
                            onClick={() => {
                              if(!isLoading)
                                dispatch(ReportAction.setTabActiveIndex(index));
                            }
                            }
                            >
                           <span className={cx({activeIndex: activeTabIndex===index})}>{tab[language]}</span> 
                          </div>
                        ))  : ""
                      }
                    </div>
                  </> 
                }  
                renderBottomToolbarCustomActions={() => 
                  renderBottomToolbarActions ? 
                  <>
                    <div className={styles.dropDown}>
                      <label>{translation('groupBy')}</label>
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
                    scrollbarWidth: 'thin',
                    scrollBehavior: 'smooth',
                    overflowY: 'overlay',
                    "&::-webkit-scrollbar": {
                        width: 10,
                        height: 10
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent"
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#edf2f7",
                        borderRadius: 10
                      }
                  } 
                }}
                muiTableBodyRowProps={() => ({
                  sx: {
                    cursor: 'pointer',
                    color: 'red'
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
                    fontWeight: 700
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    color: theme.mode === 'theme-mode-light' ? '#070708' : '#ffffff',
                    fontWeight: 450
                  },
                }}
                // renderRowActions={(row) => console.log("row", row)}
                columns={cols ?? []}
                data={finding ?? []} 
                initialState={{pagination: { pageSize: pagination.pageSize, pageIndex: pagination.pageIndex },
                density, columnVisibility: {is_prepayment: false}}}
                state={{isLoading, pagination, showGlobalFilter: showSearch, }}
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