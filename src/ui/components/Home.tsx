import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../state'
import ResultList from './Results'
import SearchBar from './SearchBar'

const Home: FC = observer(() => {
  return (
    <div className="Home">
      <SearchBar />
      <ResultList results={store.results} />
    </div>
  )
})

export default Home
