import './App.scss'
import React, { PureComponent } from 'react'
import generateCarData, { CarData } from './api/data-generator'
import createStreamerFrom, { Streamer } from './api/streamer'
import { SubscribedVin } from './App.types';
import Input from './components/Input';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import { isEqual } from 'lodash';

const STREAMERS_CACHE: {[vin: string]: Streamer } = {};

interface Props {}

interface State {
  subscribedVinsMap: {[vin:string]: SubscribedVin};
  receivedEvents: CarData[];
}

class App extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      subscribedVinsMap:{},
      receivedEvents: [],
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!isEqual(prevState.subscribedVinsMap, this.state.subscribedVinsMap)) {
      Object.values(this.state.subscribedVinsMap).forEach((subVin) => {
        const prevSubVin = prevState.subscribedVinsMap[subVin.id];
        if (isEqual(subVin, prevSubVin)) {
          return;
        }
        if (prevSubVin === undefined) {
          STREAMERS_CACHE[subVin.id] = createStreamerFrom(() => generateCarData(subVin.id))
          // STREAMERS_CACHE[subVin.id].subscribe(null)
          STREAMERS_CACHE[subVin.id].start()
        }
      })
    }
    const streamer = React.useMemo(() => createStreamerFrom(() => generateCarData('12345678901234567')), [])

    React.useEffect(() => {
      
      return () => { }
    }, [streamer])
  }

  render() {

    const { subscribedVinsMap } = this.state;
    return <React.Fragment>
      <div className="app-pane app-left-pane">
        <div className="app-pane-top-bar app-left-pane-top-bar">
          <Input></Input>
          <Button>Add</Button>
        </div>
        <ul className="app-left-pane-vins-list">
          {Object.values(subscribedVinsMap).map((subVin) => <li key={subVin.id} style={{order: subVin.index}}>
            <Checkbox>{subVin.id}</Checkbox>
          </li>)}
        </ul>
      </div>
      <div className="app-pane app-right-pane">
        <div className="app-pane-top-bar app-right-pane-top-bar">
            <Checkbox>Filter events in which fuel level is below 15%</Checkbox>
        </div>
      </div>
    </React.Fragment>
  }
}

export default App;
