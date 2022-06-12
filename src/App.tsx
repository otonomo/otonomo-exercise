import './App.scss'
import React, { PureComponent } from 'react'
import generateCarData from './api/data-generator'
import createStreamerFrom, { Streamer } from './api/streamer'
import { SubscribedVin } from './App.types';
import Input from './components/Input';
import Button from './components/Button';
import Checkbox from './components/Checkbox';

const STREAMERS_CACHE: {[vin: string]: Streamer } = {};

interface Props {}

interface State {
  subscribedVinsMap: {[vin:string]: SubscribedVin};
}

class App extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      subscribedVinsMap:{},
    }
  }
  /*
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
*/


  render() {

    const { subscribedVinsMap } = this.state;
    return <React.Fragment>
      <div className="app-pane app-left-pane">
        <div className="app-left-pane-top-bar">
          <Input></Input>
          <Button>Add</Button>
        </div>
        <ul className="app-left-pane-vins-list">
          {Object.values(subscribedVinsMap).map((subVin) => <li key={subVin.id}>
            <Checkbox>{subVin.id}</Checkbox>
          </li>)}
        </ul>
      </div>
      <div className="app-pane app-right-pane">

      </div>
    </React.Fragment>
  }
}

export default App;
