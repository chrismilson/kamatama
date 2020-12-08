import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import './App.scss'

import Landing from './components/Landing'
import Phrase from './components/Phrase'
import RadicalSearch from './components/RadicalSearch'
import PhraseSearch from './components/PhraseSearch'

const App: FC = observer(() => {
  return (
    <div className="App">
      <Landing />
      <Phrase />
      {/* <RadicalSearch /> */}
      <PhraseSearch />
    </div>
  )
})

export default App
