import { ChangeEvent, FC, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../state'

const SearchBar: FC = observer(() => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    store.setQuery(e.target.value)
  }, [])

  return (
    <div className="SearchBar">
      <input type="text" value={store.query} onChange={handleChange} />
    </div>
  )
})

export default SearchBar
