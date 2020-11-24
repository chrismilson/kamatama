This web application uses the
[JMdict/EDICT](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
and [KANJIDIC](http://www.edrdg.org/wiki/index.php/KANJIDIC_Project) dictionary
files. These files are the property of the [Electronic Dictionary Research and
Development Group](http://www.edrdg.org/), and are used in conformance with the
Group's [licence](http://www.edrdg.org/edrdg/licence.html).

# Kamatama Jisho

I have used the [Takoboto](http://takoboto.jp/) android app for several years.
It is a very good dictionary for many use cases:

- It has a kanji search by radicals.
- Searching can be done in Japanese with any combination of different scripts;
  Kanji, Hiragana, Katakana and Romaji.
- Searching can also be done in English.
- All searches are entered into the same single input, leading to a very simple
  design.

I have recently become restless with the lack of modernism in the app's
development though. I believe there are several drawbacks to the app:

- It is not available on Apple's App Store.
- It is not particularly aesthetically pleasing.
- The web version of the app is not available offline.

Frustration with the above drew me to develop this app. This app is based on the
exact same dictionaries as takoboto, but is intended to be installed as a PWA
([Progresive Web
App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)). The
PWA will be installable and will provide offline functionaloty, straight from
the browser.

_**NOTE:** Due to the problems associated with romanisation of Japanese (should
スーパー be supa, suupaa, su-pa- or some combination of them?), this dictionary
is intended for use by people who have studied some Japanese and can at least
read kana. If you cannot read kana, [this guide to
hiragana](https://www.tofugu.com/japanese/learn-hiragana/) on the [tofugu
blog](https://www.tofugu.com/) is a great place to start._
