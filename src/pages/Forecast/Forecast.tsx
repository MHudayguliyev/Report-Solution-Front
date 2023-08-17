import React, { useState,  useEffect,useRef } from "react";
import { animateScroll as scroll } from 'react-scroll';
const Forecast = () => {
  const scrollToBottom = () => {
    console.log('scroll', scroll)
    scroll.scrollToBottom({
      duration: 1500,
      delay: 100,
      smooth: 'easeInOutQuint',
    });
  };

  return (
    <div style={{marginTop: '160px', height: '2000px'}}>  
        <button onClick={scrollToBottom}>Scrollable button</button>
    </div>
  )
}

export default Forecast