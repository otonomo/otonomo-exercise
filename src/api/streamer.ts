import faker from 'faker'
import isFunction from 'lodash/fp/isFunction'
import type {CarData} from './data-generator'

type Generator = () => CarData
type Handler = (carData: CarData) => unknown

export default function createStreamerFrom(generator: Generator, range = DEFAULT_TIME_RANGE_IN_MS) {
  return new Streamer(generator, range)
}

const DEFAULT_TIME_RANGE_IN_MS = [1000, 5000]

export class Streamer {
  private isStreaming = false
  private handlers: Handler[] = []

  constructor(private readonly generator: Generator, private readonly timeRange = DEFAULT_TIME_RANGE_IN_MS) {
    if (!isFunction(generator)) {
      throw new Error('Streamer: Data generator must be a factory function')
    }
  }

  start() {
    this.isStreaming = true
    this.runTriggers()
  }

  stop() {
    this.isStreaming = false
  }

  runTriggers() {
    const [min, max] = this.timeRange
    const timeout = faker.random.number({ min, max })
    setTimeout(() => {
      if (this.isStreaming) {
        this.trigger()
        this.runTriggers()
      }
    }, timeout)
  }

  subscribe(handler: Handler) {
    this.handlers.push(handler)
  }

  removeHandler(handler: Handler) {
    this.handlers = this.handlers.filter(h => h !== handler)
  }

  trigger() {
    const record = this.generator()
    this.handlers.forEach(h => h(record))
  }
}
