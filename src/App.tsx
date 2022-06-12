import './App.scss'
import React, { ChangeEvent, PureComponent } from 'react'
import generateCarData, { CarData } from './api/data-generator'
import createStreamerFrom, { Streamer } from './api/streamer'
import { SubscribedVin } from './App.types';
import Input from './components/Input';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import { isEqual } from 'lodash';
import EventNotification from './components/EventNotification';
import { VIN_REG_EXP } from './App.consts';
import createRandomColor from './dom-utils/colors';

const STREAMERS_CACHE: {[vin: string]: Streamer } = {};

interface Props {}

interface State {
  subscribedVinsMap: {[vin:string]: SubscribedVin};
  receivedEvents: CarData[];
  vinInputStr: string;
}

class App extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      subscribedVinsMap:{},
      receivedEvents: [],
      vinInputStr: '',
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
          STREAMERS_CACHE[subVin.id].subscribe(this.handleReceivedEvent);
          STREAMERS_CACHE[subVin.id].start()
        }
      })
    }
  }

  handleReceivedEvent = (carData: CarData) => {
    this.setState((curState) => {
      return {
        receivedEvents: [
          carData,
          ...curState.receivedEvents
        ]
      }
    })
  }

  handleVinInputChange = (e: ChangeEvent) => {
    this.setState({
      vinInputStr: (e.target as HTMLInputElement).value,
    })
  }

  handleAddButtonClick = () => {
    const candidateVin = this.state.vinInputStr;
    if (!candidateVin || this.state.subscribedVinsMap[candidateVin]) {
      return;
    }
    this.setState((curState) => {
      return {
        subscribedVinsMap: {
          ...curState.subscribedVinsMap,
          [candidateVin]: {
            id: candidateVin,
            index: Object.keys(curState.subscribedVinsMap).length,
            color: createRandomColor(),
            isPaused: false,
          }
        },
        vinInputStr: '',
      }

    });
  }

  handleVinCheckboxChange = (clickedVinId: string) => {
    this.setState((curState) => {
      return {
        subscribedVinsMap: {
          ...curState.subscribedVinsMap,
          [clickedVinId]: {
            ...curState.subscribedVinsMap[clickedVinId],
            isPaused: !curState.subscribedVinsMap[clickedVinId].isPaused
          }
        }
      }
    })
  }

  render() {

    const { subscribedVinsMap, receivedEvents, vinInputStr } = this.state;

    const isAddButtonDisabled = !VIN_REG_EXP.test(vinInputStr) || subscribedVinsMap[vinInputStr];

    return <React.Fragment>
      <div className="app-pane app-left-pane">
        <div className="app-pane-top-bar app-left-pane-top-bar">
          <Input value={vinInputStr} placehoder="Vin"
            onChange={this.handleVinInputChange}
          ></Input>
          <Button disabled={isAddButtonDisabled} onClick={this.handleAddButtonClick}>Add</Button>
        </div>
        <ul className="app-left-pane-vins-list">
          {Object.values(subscribedVinsMap).map((subVin) => <li key={subVin.id} style={{order: subVin.index}}>
            <Checkbox style={{color:subVin.color}} checked={!subVin.isPaused} onChange={() => { this.handleVinCheckboxChange(subVin.id) }}>{subVin.id}</Checkbox>
          </li>)}
        </ul>
      </div>
      <div className="app-pane app-right-pane">
        <div className="app-pane-top-bar app-right-pane-top-bar">
            <Checkbox>Filter events in which fuel level is below 15%</Checkbox>
        </div>
        <ul className="app-left-pane-events-list">
          {receivedEvents.map((carData) => <li key={`${carData.vin}-${carData.timestamp}`}>
            <EventNotification carEvent={carData} color={subscribedVinsMap[carData.vin].color}></EventNotification>
          </li>)}
        </ul>
      </div>
    </React.Fragment>
  }
}

export default App;
