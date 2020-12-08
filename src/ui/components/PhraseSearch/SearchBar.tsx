import { ChangeEvent, FC, useCallback, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../../state'
import icon from '../../icon.svg'
import './SearchBar.scss'

const SearchBar: FC = observer(() => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    store.setQuery(e.target.value)
  }, [])

  return (
    <div className="SearchBar">
      <img className="icon" src={icon} alt="icon" />
      <input
        ref={inputRef}
        type="text"
        value={store.query}
        onChange={handleChange}
        placeholder="Search here..."
      />
      <button className="Radicals">字</button>
    </div>
  )
})

export default SearchBar
