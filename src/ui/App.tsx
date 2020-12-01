import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import Landing from './components/Landing'
import store from '../state'
import ResultList from './components/Results'
import SearchBar from './components/SearchBar'
import './App.scss'

const App: FC = observer(() => {
  return (
    <div className="App">
      <Landing />
      <SearchBar />
      <ResultList results={store.results} />
    </div>
  )
})

export default App
