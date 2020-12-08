import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../../state'
import { radicalsByStrokeCount } from './common'
import './RadicalSearchBar.scss'

const RadicalButton: FC<{ radical: string }> = observer(({ radical }) => {
  const selected = store.radicalQuery.has(radical)

  return (
    <button
      className={['RadicalButton', selected && 'selected']
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        store.toggleRadicalQuery(radical)
      }}
    >
      {radical}
    </button>
  )
})

const RadicalSearchBar: FC = observer(() => {
  return (
    <div className="RadicalSearchBar">
      {radicalsByStrokeCount
        .map((radicals, strokes): [string[], number] => [radicals, strokes])
        .filter(([radicals, _strokes]) => radicals.length > 0)
        .map(([radicals, strokeCount]) => (
          <div className="radicalGroup" key={strokeCount}>
            <div className="strokeCount">{strokeCount}</div>
            <div className="radicals">
              {radicals.map((radical) => (
                <RadicalButton key={radical} radical={radical} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
})

export default RadicalSearchBar
