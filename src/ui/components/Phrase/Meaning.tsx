import { FC } from 'react'
import { JMSense } from '../../../types/JMEntry'

const humanReadablePartOfSpeech = {
  'adj-f': 'noun or verb acting prenominally',
  'adj-i': 'adjective (keiyoushi)',
  'adj-ix': 'adjective (keiyoushi) - yoi/ii class',
  'adj-kari': "'kari' adjective (archaic)",
  'adj-ku': "'ku' adjective (archaic)",
  'adj-na': 'adjectival nouns or quasi-adjectives (keiyodoshi)',
  'adj-nari': 'archaic/formal form of na-adjective',
  'adj-no': "nouns which may take the genitive case particle 'no'",
  'adj-pn': 'pre-noun adjectival (rentaishi)',
  'adj-shiku': "'shiku' adjective (archaic)",
  'adj-t': "'taru' adjective",
  adv: 'adverb (fukushi)',
  'adv-to': "adverb taking the 'to' particle",
  aux: 'auxiliary',
  'aux-adj': 'auxiliary adjective',
  'aux-v': 'auxiliary verb',
  conj: 'conjunction',
  cop: 'copula',
  ctr: 'counter',
  exp: 'expressions (phrases, clauses, etc.)',
  int: 'interjection (kandoushi)',
  n: 'noun (common) (futsuumeishi)',
  'n-adv': 'adverbial noun (fukushitekimeishi)',
  'n-pr': 'proper noun',
  'n-pref': 'noun, used as a prefix',
  'n-suf': 'noun, used as a suffix',
  'n-t': 'noun (temporal) (jisoumeishi)',
  num: 'numeric',
  pn: 'pronoun',
  pref: 'prefix',
  prt: 'particle',
  suf: 'suffix',
  unc: 'unclassified',
  'v-unspec': 'verb unspecified',
  v1: 'Ichidan verb',
  'v1-s': 'Ichidan verb - kureru special class',
  'v2a-s': "Nidan verb with 'u' ending (archaic)",
  'v2b-k': "Nidan verb (upper class) with 'bu' ending (archaic)",
  'v2b-s': "Nidan verb (lower class) with 'bu' ending (archaic)",
  'v2d-k': "Nidan verb (upper class) with 'dzu' ending (archaic)",
  'v2d-s': "Nidan verb (lower class) with 'dzu' ending (archaic)",
  'v2g-k': "Nidan verb (upper class) with 'gu' ending (archaic)",
  'v2g-s': "Nidan verb (lower class) with 'gu' ending (archaic)",
  'v2h-k': "Nidan verb (upper class) with 'hu/fu' ending (archaic)",
  'v2h-s': "Nidan verb (lower class) with 'hu/fu' ending (archaic)",
  'v2k-k': "Nidan verb (upper class) with 'ku' ending (archaic)",
  'v2k-s': "Nidan verb (lower class) with 'ku' ending (archaic)",
  'v2m-k': "Nidan verb (upper class) with 'mu' ending (archaic)",
  'v2m-s': "Nidan verb (lower class) with 'mu' ending (archaic)",
  'v2n-s': "Nidan verb (lower class) with 'nu' ending (archaic)",
  'v2r-k': "Nidan verb (upper class) with 'ru' ending (archaic)",
  'v2r-s': "Nidan verb (lower class) with 'ru' ending (archaic)",
  'v2s-s': "Nidan verb (lower class) with 'su' ending (archaic)",
  'v2t-k': "Nidan verb (upper class) with 'tsu' ending (archaic)",
  'v2t-s': "Nidan verb (lower class) with 'tsu' ending (archaic)",
  'v2w-s':
    "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)",
  'v2y-k': "Nidan verb (upper class) with 'yu' ending (archaic)",
  'v2y-s': "Nidan verb (lower class) with 'yu' ending (archaic)",
  'v2z-s': "Nidan verb (lower class) with 'zu' ending (archaic)",
  v4b: "Yodan verb with 'bu' ending (archaic)",
  v4g: "Yodan verb with 'gu' ending (archaic)",
  v4h: "Yodan verb with 'hu/fu' ending (archaic)",
  v4k: "Yodan verb with 'ku' ending (archaic)",
  v4m: "Yodan verb with 'mu' ending (archaic)",
  v4n: "Yodan verb with 'nu' ending (archaic)",
  v4r: "Yodan verb with 'ru' ending (archaic)",
  v4s: "Yodan verb with 'su' ending (archaic)",
  v4t: "Yodan verb with 'tsu' ending (archaic)",
  v5aru: 'Godan verb - -aru special class',
  v5b: "Godan verb with 'bu' ending",
  v5g: "Godan verb with 'gu' ending",
  v5k: "Godan verb with 'ku' ending",
  'v5k-s': 'Godan verb - Iku/Yuku special class',
  v5m: "Godan verb with 'mu' ending",
  v5n: "Godan verb with 'nu' ending",
  v5r: "Godan verb with 'ru' ending",
  'v5r-i': "Godan verb with 'ru' ending (irregular verb)",
  v5s: "Godan verb with 'su' ending",
  v5t: "Godan verb with 'tsu' ending",
  v5u: "Godan verb with 'u' ending",
  'v5u-s': "Godan verb with 'u' ending (special class)",
  v5uru: 'Godan verb - Uru old class verb (old form of Eru)',
  vi: 'intransitive verb',
  vk: 'Kuru verb - special class',
  vn: 'irregular nu verb',
  vr: 'irregular ru verb, plain form ends with -ri',
  vs: 'noun or participle which takes the aux. verb suru',
  'vs-c': 'su verb - precursor to the modern suru',
  'vs-i': 'suru verb - included',
  'vs-s': 'suru verb - special class',
  vt: 'transitive verb',
  vz: 'Ichidan verb - zuru verb (alternative form of -jiru verbs)'
}

const humanReadableField = {
  agric: 'agriculture',
  anat: 'anatomy',
  archeol: 'archeology',
  archit: 'architecture, building',
  art: 'art, aesthetics',
  astron: 'astronomy',
  audvid: 'audio-visual',
  aviat: 'aviation',
  baseb: 'baseball',
  biochem: 'biochemistry',
  biol: 'biology',
  bot: 'botany',
  Buddh: 'Buddhism',
  bus: 'business',
  chem: 'chemistry',
  Christn: 'Christianity',
  comp: 'computing',
  cryst: 'crystallography',
  ecol: 'ecology',
  econ: 'economics',
  elec: 'electricity, elec. eng.',
  electr: 'electronics',
  embryo: 'embryology',
  engr: 'engineering',
  ent: 'entomology',
  finc: 'finance',
  fish: 'fishing',
  food: 'food, cooking',
  gardn: 'gardening, horticulture',
  genet: 'genetics',
  geogr: 'geography',
  geol: 'geology',
  geom: 'geometry',
  go: 'go (game)',
  golf: 'golf',
  gramm: 'grammar',
  grmyth: 'Greek mythology',
  hanaf: 'hanafuda',
  horse: 'horse-racing',
  law: 'law',
  ling: 'linguistics',
  logic: 'logic',
  MA: 'martial arts',
  mahj: 'mahjong',
  math: 'mathematics',
  mech: 'mechanical engineering',
  med: 'medicine',
  met: 'climate, weather',
  mil: 'military',
  music: 'music',
  ornith: 'ornithology',
  paleo: 'paleontology',
  pathol: 'pathology',
  pharm: 'pharmacy',
  phil: 'philosophy',
  photo: 'photography',
  physics: 'physics',
  physiol: 'physiology',
  print: 'printing',
  psych: 'psychology, psychiatry',
  Shinto: 'Shinto',
  shogi: 'shogi',
  sports: 'sports',
  stat: 'statistics',
  sumo: 'sumo',
  telec: 'telecommunications',
  tradem: 'trademark',
  vidg: 'video game',
  zool: 'zoology'
}

const humanReadableMisc = {
  abbr: 'abbreviation',
  arch: 'archaism',
  char: 'character',
  chn: "children's language",
  col: 'colloquialism',
  company: 'company name',
  creat: 'creature',
  dated: 'dated term',
  dei: 'deity',
  derog: 'derogatory',
  ev: 'event',
  fam: 'familiar language',
  fem: 'female term or language',
  fict: 'fiction',
  given: 'given name or forename, gender not specified',
  hist: 'historical term',
  hon: 'honorific or respectful (sonkeigo) language',
  hum: 'humble (kenjougo) language',
  id: 'idiomatic expression',
  joc: 'jocular, humorous term',
  leg: 'legend',
  litf: 'literary or formal term',
  'm-sl': 'manga slang',
  male: 'male term or language',
  myth: 'mythology',
  'net-sl': 'Internet slang',
  obj: 'object',
  obs: 'obsolete term',
  obsc: 'obscure term',
  'on-mim': 'onomatopoeic or mimetic word',
  organization: 'organization name',
  oth: 'other',
  person: 'full name of a particular person',
  place: 'place name',
  poet: 'poetical term',
  pol: 'polite (teineigo) language',
  product: 'product name',
  proverb: 'proverb',
  quote: 'quotation',
  rare: 'rare',
  relig: 'religion',
  sens: 'sensitive',
  serv: 'service',
  sl: 'slang',
  station: 'railway station',
  surname: 'family or surname',
  uk: 'word usually written using kana alone',
  unclass: 'unclassified name',
  vulg: 'vulgar expression or word',
  work: 'work of art, literature, music, etc. name',
  X: 'rude or X-rated term (not displayed in educational software)',
  yoji: 'yojijukugo'
}

const Meaning: FC<JMSense> = ({
  kanji,
  reading,
  partOfSpeech,
  reference,
  field,
  misc,
  glossary
}) => {
  return (
    <li className="Meaning">
      {kanji.length + reading.length > 0 && (
        <span className="info restriction">
          Meaning restricted to {[...kanji, ...reading].join(', ')}
        </span>
      )}
      {partOfSpeech.length > 0 && (
        <span className="info partOfSpeech">
          {partOfSpeech.map((pos) => humanReadablePartOfSpeech[pos]).join(', ')}
        </span>
      )}
      {reference.length > 0 && (
        <span className="info seeAlso">See also: {reference.join(', ')}</span>
      )}
      {field.length > 0 && (
        <span className="info field">
          Related to: {field.map((f) => humanReadableField[f]).join(', ')}
        </span>
      )}
      {misc.length > 0 && (
        <span className="info misc">
          {misc.map((m) => humanReadableMisc[m]).join(', ')}
        </span>
      )}
      {glossary.length > 0 && (
        <div className="glossary">
          {glossary.map(({ value }) => (
            <div className="item" key={value}>
              {value}
            </div>
          ))}
        </div>
      )}
    </li>
  )
}

export default Meaning
