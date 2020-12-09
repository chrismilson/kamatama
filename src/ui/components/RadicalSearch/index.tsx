import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../../state'
import RadicalResultList from './RadicalResultList'
import RadicalSearchBar from './RadicalSearchBar'
import './RadicalSearch.scss'
import { runInAction } from 'mobx'

const RadicalSearch: FC = observer(() => {
  const active = store.searchByRadical
  return (
    <div
      className={['RadicalSearch', active && 'active']
        .filter(Boolean)
        .join(' ')}
    >
      <button
        className="close"
        onClick={() => {
          runInAction(() => {
            store.searchByRadical = false
          })
        }}
      >
        close
      </button>
      <RadicalResultList />
      <RadicalSearchBar />
    </div>
  )
})

export default RadicalSearch
