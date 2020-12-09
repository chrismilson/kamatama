import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import store from '../../../state'
import { KanjiCharacter, KanjiReadingMeaningGroup } from '../../../types/Kanji'
import './RadicalResultList.scss'

const RadicalResultListItem: FC<KanjiCharacter> = ({
  literal,
  readingMeaning
}) => {
  return (
    <div
      className="RadicalResultListItem"
      onClick={() => {
        store.setQuery((old) => old + literal)
        runInAction(() => {
          store.searchByRadical = false
        })
      }}
    >
      <div className="literal">{literal}</div>
      <div className="info">
        <div className="reading">
          {readingMeaning
            ?.flatMap((meaningGroupOrNanori) => {
              if ('value' in meaningGroupOrNanori) {
                return [meaningGroupOrNanori.value]
              } else {
                return meaningGroupOrNanori.reading.map(
                  (reading) => reading.value
                )
              }
            })
            .join('、')}
        </div>
        <div className="meaning">
          {readingMeaning
            ?.filter((possiblyNanori) => !('value' in possiblyNanori))
            .flatMap((meaningGroup) =>
              (meaningGroup as KanjiReadingMeaningGroup).meaning.map(
                (meaning) => meaning.value
              )
            )
            .join(', ')}
        </div>
      </div>
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
