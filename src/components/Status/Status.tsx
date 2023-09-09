import React from 'react'
import styles from './Statuse.module.scss'


interface StatusProps {
    name: string,
    id: number
}
const randomColor = Math.floor(Math.random()*16777215).toString(16);

const renderColor = (id: number) => {
  switch(id) {
    case 0:
      return <span className={styles.orange}></span>
    case 1:
      return <span className={styles.tomato}></span>
    case 2:
      return <span className={styles.blue}></span>
    case 3:
      return <span className={styles.green}></span>
    case 4:
      return <span className={styles.red}></span>
    default:
      return <span style={{background: `#${randomColor}`}}/>
  }
}

export const Status = (props: StatusProps) => {
  const {name, id} = props
  return (
    <div className={styles.status}>
      {renderColor(id)}
        <div>{name}</div>
    </div>
  )
}

export default Status
