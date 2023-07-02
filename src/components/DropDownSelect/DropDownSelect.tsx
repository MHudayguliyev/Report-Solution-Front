import React, { ChangeEvent, CSSProperties, useEffect, useState } from 'react';

// own component library
import { Checkbox, Dropdown, Input } from '@app/compLibrary';
// custom styles
import styles from './DropDownSelect.module.scss';
import classNames from "classnames/bind";
// for translation
import { useTranslation } from 'react-i18next';
//own component library
import Preloader from '@app/compLibrary/Preloader/Preloader';
import usePrevious from '@app/hooks/usePrevious';
import { CheckObjOrArrForNull } from '@utils/helpers';

const cx = classNames.bind(styles);


export type SearchValues = {
   label: string
   value: string,
   connected: boolean
}

interface DropDownSelectProps<T> {
   title?: any
   data: T | any
   onChange: (value: SearchValues) => void
   dropDownContentStyle?: CSSProperties
   fetchStatuses: { isLoading: boolean, isError: boolean }
   /** @default false */
   titleSingleLine?: boolean
   value?: string | boolean | any
   maintitleOutside?: SearchValues
   isInputField?: boolean,
   disabled?: boolean,
   position?: 'up' | 'down'
}

function DropDownSelect<T extends SearchValues[]>(props: DropDownSelectProps<T>) {

   const {
      title,
      data,
      onChange,
      dropDownContentStyle,
      fetchStatuses,
      titleSingleLine,
      value,
      maintitleOutside,
      isInputField,
      disabled,
      position = 'down'
   } = props;

   // for translation
   const { t } = useTranslation();
   // array of selected elements
   const [arrSearch, setArrSearch] = useState<T | SearchValues[]>(data);
   const [mainTitle, setMainTitle] = useState<SearchValues | any>(value ? value : undefined);
   const prevMainTitle = usePrevious(maintitleOutside)

   useEffect(() => {
      setMainTitle(value)
   }, [value])

   useEffect(() => {
      if (prevMainTitle?.value !== maintitleOutside?.value)
         setMainTitle(maintitleOutside)
   }, [maintitleOutside])

   useEffect(() => {
      if(CheckObjOrArrForNull(data))
         setArrSearch(data);
   }, [data]);

   useEffect(() => {
      if (mainTitle?.value)
         onChange(mainTitle);
   }, [mainTitle])


   return (
      <Dropdown upPosition={position==='up'} disabled={disabled} dropDownContentStyle={dropDownContentStyle} customToggle={() => {
         return (
            <div className={styles.toggleWrapper}>
               <span className={
                  cx({
                     toggleTitle: true,
                     singleLine: titleSingleLine
                  })
               }>
                  {
                    mainTitle?.label ? mainTitle?.label : title
                  }
               </span>
               <i className='bx bx-chevron-down'></i>
            </div>
         )
      }} customElement={() => {
         return (
            <div className={styles.customElementWrapper}>
               {
                  fetchStatuses.isLoading ?
                     <div className={styles.preloader}>
                        <Preloader />
                     </div>
                     :
                     !fetchStatuses.isError ?
                        <>
                        
                         <div>
                            {
                               isInputField ? 
                               <div className={styles.searchWrapper}>
                                     <Input
                                        type='text'
                                        placeholder={`${t('search')}...`}
                                     />
                               </div> : ''
                            }
                         </div>
                        
                           <div className={styles.itemsWrapper}>
                              {
                                 arrSearch ? arrSearch!.length > 0 ?
                                    arrSearch.map((item: any, index: number) => {
                                       return (
                                          <span key={index} onClick={() => {
                                             setMainTitle(arrSearch[index])
                                          }} className={cx({
                                             item: true, 
                                             notConnected: position==='down' && !item.connected
                                          })}>
                                             {item.label}
                                          </span>
                                       )
                                    })
                                    :
                                    t("noData") : 
                                    null
                              }
                           </div>
                        </>
                        :
                        t('couldntFetch')
               }
            </div>
         )
      }} />
   )
}

export default DropDownSelect;