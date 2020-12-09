import { ChangeEvent, FC, useCallback, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../../state'
import icon from '../../icon.svg'
import radicalSearchIcon from './radical-search-icon.svg'
import './SearchBar.scss'
import { runInAction } from 'mobx'

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
      <img
        className="Radicals"
        src={radicalSearchIcon}
        alt="search by radical"
        onClick={() => {
          runInAction(() => {
            store.searchByRadical = true
          })
        }}
      />
    </div>
  )
})

export default SearchBar
