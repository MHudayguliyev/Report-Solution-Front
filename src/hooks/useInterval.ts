import React, {useRef, useEffect} from 'react'

const useInterval = (callback: Function, delay: number) => {
    const intervalRef:any = useRef(null);
    const savedCallback = useRef(callback);

    // useEffect(() => {
    //     // savedCallback.current = callback;
    // }, [callback]);

    // useEffect(() => {
    //     const tick = () => savedCallback.current();
    //     if (typeof delay === 'number') {
    //         // intervalRef.current = window.setInterval(tick, delay);
    //         // return () => window.clearInterval(intervalRef.current);
    //     }
    // }, [delay])

    return intervalRef;
}

export default useInterval