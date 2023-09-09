import React, {useState, useEffect} from 'react'
import styles from './Circles.module.scss'
import img_1 from '../../../public/1.png'
import img_2 from '../../../public/2.png'
import img_3 from '../../../public/3.png'
import img_4 from '../../../public/4.png'
import img_5 from '../../../public/5.png'
import img_6 from '../../../public/6.png'
import img_7 from '../../../public/7.png'
import img_8 from '../../../public/8.png'
import img_9 from '../../../public/9.png'
import img_10 from '../../../public/10.png'
import img_11 from '../../../public/11.png'


const images: any = [
  {url: img_1,size: Math.floor((Math.random() * 150) + 30)},
  {url: img_2,size: Math.floor((Math.random() * 150) + 31)},
  {url: img_3,size: Math.floor((Math.random() * 150) + 32)},
  {url: img_4,size: Math.floor((Math.random() * 150) + 33)},
  {url: img_5,size: Math.floor((Math.random() * 150) + 34)},
  {url: img_6,size: Math.floor((Math.random() * 150) + 35)},
  {url: img_7,size: Math.floor((Math.random() * 150) + 36)},
  {url: img_8,size: Math.floor((Math.random() * 150) + 37)},
  {url: img_9,size: Math.floor((Math.random() * 150) + 38)},
  {url: img_10,size: Math.floor((Math.random() * 150) + 39)},
  {url: img_11,size: Math.floor((Math.random() * 150) + 40)},
]
const Circles = () => {
  return (
    <>
    <ul className={styles.circles}>
      {
        images.map((image : any, index: number) => (
          <li key={index}>
            <img src={image.url} alt=""  height={image.size}/>
          </li>
        ))
      }
      </ul>
    </>
  )
}

export default Circles