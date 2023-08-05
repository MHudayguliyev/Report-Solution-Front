import React, { ReactNode } from 'react'
import { motion } from "framer-motion"

type FramerType = {
    children?: ReactNode
    rotate?: number[]
    transition?: {
        duration: number | any
    }
}

const Framer = (props: FramerType) => {
    const {
        children, 
        rotate = [0, -20, 20, -20, 20, -20, 20, 0],
        transition = { duration: 0.5 }
    } = props

  return (
    <motion.div
        whileHover={{
            rotateZ: rotate,
            transition,
        }}
    >
        {children}
    </motion.div>
  )
}

export default Framer