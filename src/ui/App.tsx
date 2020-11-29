import { FC } from 'react'
import ResultList from './components/Results'
import store from '../state'
import './App.css'
import { observer } from 'mobx-react-lite'
import SearchBar from './components/SearchBar'

const App: FC = observer(() => {
  return (
    <div className="App">
      <SearchBar />
      <ResultList results={store.results} />
    </div>
  )
})

export default App
