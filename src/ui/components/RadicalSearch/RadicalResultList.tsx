import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../../state'
import { KanjiCharacter } from '../../../types/Kanji'
import './RadicalResultList.scss'

const RadicalResultListItem: FC<KanjiCharacter> = (kanji) => {
  return (
    <div className="RadicalResultListItem">
      <pre>{kanji.literal}</pre>
    </div>
  )
}

const RadicalResultList: FC = observer(() => {
  const allKanji = store.radicalResult.slice(0, 30)

  return (
    <div className="RadicalResultList">
      {allKanji.map((kanji) => (
        <RadicalResultListItem key={kanji.literal} {...kanji} />
      ))}
    </div>
  )
})

export default RadicalResultList
