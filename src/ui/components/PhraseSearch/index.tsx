import { FC } from 'react'
import PhraseResultList from './PhraseResults'
import PhraseSearchBar from './SearchBar'
import './PhraseSearch.scss'

const PhraseSearch: FC = () => {
  return (
    <div className="PhraseSearch">
      <PhraseSearchBar />
      <PhraseResultList />
    </div>
  )
}

export default PhraseSearch
