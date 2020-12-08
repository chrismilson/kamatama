import { FC } from 'react'
import RadicalResultList from './RadicalResultList'
import RadicalSearchBar from './RadicalSearchBar'
import './RadicalSearch.scss'

const RadicalSearch: FC = () => {
  return (
    <div className="RadicalSearch">
      <RadicalResultList />
      <RadicalSearchBar />
    </div>
  )
}

export default RadicalSearch
