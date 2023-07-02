import React, { ReactNode } from 'react'
import { Tooltip } from 'react-tooltip'


interface CustomTooltipProps {
    content: string | undefined
    children: ReactNode
}

const CustomTooltip = (props: CustomTooltipProps) => {
    const { content, children} = props
  return (
    <>
        <a data-tooltip-id='my-tooltip' data-tooltip-content={content}>
            {children}
        </a>
        <Tooltip id='my-tooltip' />
    </>
  )
}

export default CustomTooltip
