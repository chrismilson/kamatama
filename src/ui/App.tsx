import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import Landing from './components/Landing'
import store from '../state'
import PhraseResultList from './components/Results'
import SearchBar from './components/SearchBar'
import './App.scss'
import Phrase from './components/Phrase'

const App: FC = observer(() => {
  return (
    <div className="App">
      <Landing />
      <Phrase />
      <SearchBar />
      <PhraseResultList results={store.phraseResults} />
    </div>
  )
})

export default App
