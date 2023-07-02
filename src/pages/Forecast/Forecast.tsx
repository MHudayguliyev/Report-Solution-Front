import React, {useEffect, useState, useMemo} from 'react'

const Forecast = () => {
  const [number, setNumber] = useState(0)

  const data = useMemo(() => {
    return {
        key: "Maksat"
    }
}, [number]);

  useEffect(() => {
    console.log("data", data)
  }, [data])

  return (
    <div>

    </div>
  )
}

export default Forecast