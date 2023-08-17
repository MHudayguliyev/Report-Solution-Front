import React, {useState, useEffect} from 'react'

export const useWindowScrollPositions = (reference: any) => {

    const [scrollPosition, setPosition] = useState({ scrollX: 0, scrollY: 0 })
 
    useEffect(() => {
        const handleScroll = () => {
           const element = reference.current;
           if (element) {
             const scrollPosition = element.scrollTop;
             console.log('element', scrollPosition)
             setPosition(prev => ({...prev, scrollY: scrollPosition}))
           }
        };
        const element = reference.current;
        if (element) {
          element.addEventListener("scroll", handleScroll);
        }
    
        return () => {
          if (element) {
            element.removeEventListener("scroll", handleScroll);
          }
        };
      }, []);
 
    return scrollPosition
}