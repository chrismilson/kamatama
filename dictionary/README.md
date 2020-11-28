# Implementation

In order to enable offline lookups in the PWA, the dictionary will be
implemented with the [IndexedDB
API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Since an
IndexedDB can only be instantiated by the client, we must create the dictionary
in the client.

## Dictionaries

The original, raw dictionary files are stored in `./raw`. They all get compiled
to JSON by the `./dictToJSON.py` python script, and are put into the public
folder as part of the build process.

Since they will be hosted on github-pages, I can all compression associated
problems as they will be handled by the static gh-pages server.

To include them in my code, instead of the async `import('some.json')`, I will
use the `fetch('some.json').then(res => res.json())` method.

The dictionaries currently in use are:

- [kanjidic2](http://www.edrdg.org/wiki/index.php/KANJIDIC_Project)
- [JMdict](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
