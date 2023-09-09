import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';
import { Paper } from '@app/compLibrary';
import styles from './Tabs.module.scss'
import classNames from 'classnames/bind';
import {MdOutlineSummarize} from 'react-icons/md'
// redux actions
import ReportAction from '@redux/actions/ReportAction'

const cx = classNames.bind(styles);
interface TabListProps {
    data: any;
    value?: number
    onClick: (index: number) => void
}

const TabList = (props: TabListProps) => {
  const {
    data, 
    value, 
    onClick
  } = props

  /// redux states
  const activeIndex = useAppSelector(state => state.reportReducer.activeTabIndex)
  return (
    <Paper rounded fullHeight className={styles.dynamicTabs}>
      <div className={styles.tabList}>
        {
          data?.map((item: any, index: number) => {
            return (
              <button
                className={cx({
                  tab: true,
                  active: activeIndex === index
                })}
                onClick={() => onClick(index)}
              >
                <MdOutlineSummarize size={24}/>
             <h4>{item.tabName}</h4> 
            </button>
            )
          })
        }

      </div>   
      <div className={styles.panels}>
        {
          data?.map((item: any, index: number) => {
            return (
              <div className={cx({
                tabPanel: true,
                active: activeIndex === index
              })}>
              {item.panel}
            </div>
            )
          })
        }
      </div>
    </Paper>
  )
}

export default TabList