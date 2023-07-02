//@ts-nocheck
import React, {useState, useEffect, useMemo} from 'react'
import { useMatch } from '@tanstack/react-location';
import { useAppSelector,useAppDispatch }  from '@app/hooks/redux_hooks';
import { useTranslation } from 'react-i18next';
import MaterialReactTable, { 
  MRT_FullScreenToggleButton,
  MRT_PaginationState, 
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton, 
  MRT_ToggleDensePaddingButton, type MRT_ColumnDef } from 'material-react-table';
import { CheckObjOrArrForNull } from '@utils/helpers';
import { createTheme, darken, ThemeProvider } from '@mui/material';
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

function setTabUrl(index: number): string {
  let endUrl: string=''
  switch(index){
    case 0: 
      endUrl = 'mat_stock_amount_cost'
      break;
    case 1: 
      endUrl = 'mat_gross_profitability'
      break;
  }
  return endUrl
}

const setData = (data: any, name: string | any, t: Function) => {
  if(CheckObjOrArrForNull(data)){
    if(
      name===t('purchase') ||
      name===t('returnOfPurchace') ||
      name=== t('sale')||
      name=== t('returnOfSold')
    ){
      for(let i = 0; i < data?.length; i++){
        const item = data[i]
        if(item.ord_date){
          item.ord_date = moment(data[i].ord_date).format('HH:MM:SS')
        }else if(item.inv_date){
          item.inv_date = moment(data[i].inv_date).format('HH:MM:SS')
        }
      }    
    }
  }
  return data
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
    onGoBack: () => void
    translation: Function
    data: any,
    isLoading: boolean,
    tableName?: string,
    paperData: {typeID: number | string | null, paperName: string},
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
    tabs?: Array<string>,
    dropdownData?: {value: string, label: string}[]
    /** for report page */
    field?: {value: string, label: string}  
}

const cx = classNames.bind(styles)
const MaterialTable = (props: TableProps) => {
  const match = useMatch()
  const { i18n } = useTranslation()
  const language = i18n.language
  const theme = useAppSelector(state => state.themeReducer)
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme.mode, 
          background: {
            default:
              theme.mode === 'light'
                ? '#ffffff' 
                : '#2d2d2d', 
          }, 
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
    onGoBack,
    translation,
    data, 
    tableName,
    paperData,
    enableColumnResizing = false,
    enableStickyHeader = false,
    renderCustomActions = false,
    renderBottomToolbarActions = false,
    density = 'comfortable',
    tabs,
    dropdownData,
    field
} = props

  const [findings, setFindings] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [colResult, setColResult] = useState<{accessorKey: string, header: string}[]>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 32,
  });
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)


  useEffect(() => {
    setFindings(setData(data,tableName,translation))
  }, [data])

  useEffect(() => {
    if(match.pathname === '/dashboard')
      setColumns(tableLocalization[paperData.paperName])
    else if(match.pathname === '/report') 
      setColumns(tableLocalization[paperData.paperName][field?.value])
  }, [paperData, field])

  useEffect(() => {
    if(CheckObjOrArrForNull(findings)){
      setColResult(columns?.map((item: any) => {
        return {
          accessorKey: item.accessorKey,
          header: item[language as string],
        }
      }))
    }else {
      setColResult([])
    }
  }, [findings, language])

  const classes = useStyles();
  const dispatch = useAppDispatch()
  const activeIndex = useAppSelector(state => state.reportReducer.activeIndex)

  return (
    <>
      {
        show ? 
        <div className={cx({
          table__container: true
        })}>
          <div className={classes.root}>
            <ThemeProvider theme={createTheme(tableTheme, language === 'en' ? en : language === 'ru' ?  ru : tm)}>
              <MaterialReactTable
                localization={language === 'en' ? eng : language === 'ru' ?  rus : tm}
                enableColumnResizing={enableColumnResizing} 
                enableStickyHeader={enableStickyHeader}
                columnResizeMode="onChange" 
                onPaginationChange={setPagination}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [32,64,128,256,512,1024]
                }}
                renderToolbarInternalActions={({ table }) => (
                  <>
                    <span onClick={() => setShowSearch(!showSearch)} className={cx({
                      globalSearch: true, 
                      whitify: theme.mode !== 'light'
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
                      onClick={() => {setShow(); setShowSearch(false); onGoBack()}} 
                      className={cx({
                        chevron__left: true, 
                        whitify: theme.mode !== 'light'
                      })}
                      >
                        <i className='bx bx-arrow-back'></i>
                      </span>}
                      {
                        tableName && <h4>{tableName}</h4>
                      }
                      {
                        tabs?.length ?
                        tabs?.map((tab: any, index: number) => (
                          <div key={index} className={styles.tablePanel} 
                            onClick={() => {
                              if(!isLoading){
                                dispatch(ReportAction.setActiveindex(index));
                                dispatch(ReportAction.setEndUrl(setTabUrl(index)))
                              }
                            }
                            }
                            >
                           <span className={cx({activeIndex: activeIndex===index})}>{tab}</span> 
                          </div>
                        ))  : ""
                      }
                    </div>
                  </> 
                }  
                renderBottomToolbarCustomActions={() => 
                  renderBottomToolbarActions ? 
                  <>
                    <div className={`${styles.filterInput} ${styles.filterSelect}`}>
                      <DropDownSelect 
                        titleSingleLine
                        title={field!.label ?? dropdownData![0].label}
                        dropDownContentStyle={{right: '0'}}
                        data={dropdownData}
                        onChange={(item: any) => dispatch(ReportAction.setField(item))}
                        fetchStatuses={{ isLoading: false, isError: false }}
                        position='up'
                      />
                    </div>
                  </> : <div className={`${styles.filterSelect}`}/>
                }
                muiTableContainerProps={{ 
                  sx: { 
                    height: isFullScreen ? '100vh' : 'calc(100vh - 230px)',
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
                    color: '#070708',
                    fontWeight: 700
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    color: '#070708',
                    fontWeight: 450
                  },
                }}
                initialState={{ 
                  pagination: { pageSize: pagination.pageSize, pageIndex: pagination.pageIndex },
                  density, columnVisibility: {is_prepayment: false}
                }}
                columns={findings ? colResult : []}
                data={findings ?? []} 
                state={{isLoading, pagination, showGlobalFilter: showSearch}}
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