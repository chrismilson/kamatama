import { FC } from 'react'
import ResultsView from './components/ResultsView'
import store from '../state'
import './App.css'
import { observer } from 'mobx-react-lite'
import SearchBar from './components/SearchBar'

const App: FC = observer(() => {
  return (
    <div className="App">
      <SearchBar />
      <ResultsView results={store.results} />
    </div>
  )
})

export default App
