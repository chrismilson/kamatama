# Implementation

In order to enable offline lookups in the PWA, the dictionary will be
implemented with the [IndexedDB
API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Since an
IndexedDB can only be instantiated by the client, we must create the dictionary
in the client.

## Dictionaries

The original, raw dictionary files are stored in `./raw`. They all get compiled
to JSON by the `./dictToJSON.py` python script, and are the put into `./json`.
They are then included in the repository with
[`git-lfs`](https://git-lfs.github.com), a solution to storing large files on
github. 

On top of this, github pages does not support `git-lfs` resources, so instead of
fetching them from the base domain, I will fetch them from github's media cdn
with the following url:

> `https://media.githubusercontent.com/media/chrismilson/kamatama/master/dictionary/json/dictionaryFile.json`

The dictionaries currently in use are:

- [kanjidic2](http://www.edrdg.org/wiki/index.php/KANJIDIC_Project)
- [JMdict](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
