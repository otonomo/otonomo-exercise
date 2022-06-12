import './App.css'
import React from 'react'
import generateCarData from './api/data-generator'
import createStreamerFrom from './api/streamer'
import logo from './logo.svg'

const App = () => {
  const [carData, setCarData] = React.useState({})
  const streamer = React.useMemo(() => createStreamerFrom(() => generateCarData('12345678901234567')), [])

  React.useEffect(() => {
    streamer.subscribe(setCarData)
    streamer.start()
    return () => { }
  }, [streamer])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logos" />
        <div>
          Edit <code>src/App.tsx</code> and save to reload.
          <pre>{JSON.stringify(carData)}</pre>
        </div>
      </header>
    </div>
  )
}

export default App
