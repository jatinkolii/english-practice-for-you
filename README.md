# LingoQuest

A free, static website to learn English: word explorer with pronunciation, five games, XP, levels, streaks and badges. No backend, no build step, no API keys.

## Files

```
index.html
css/style.css
js/app.js
```

## Deploy on GitHub Pages

1. Create a new public repository on GitHub (for example `lingoquest`).
2. Upload these files, keeping the folder structure. `index.html` must be in the repository root.
3. Go to Settings, then Pages. Under Build and deployment choose "Deploy from a branch", branch `main`, folder `/ (root)`, then Save.
4. After about a minute the site is live at `https://YOUR-USERNAME.github.io/lingoquest/`.

## APIs used

| Purpose | API | Key needed |
|---|---|---|
| Definitions, phonetics, audio, examples | https://dictionaryapi.dev/ | No |
| Synonyms and antonyms | https://api.datamuse.com/ | Not until 1 Jan 2027 (see below) |
| Hindi translation (machine, may be imperfect) | https://mymemory.translated.net/ | No (daily free limit applies, check their terms) |
| Random word | https://random-word-api.herokuapp.com/ | No |

IMPORTANT: Datamuse has announced that from 1 January 2027 an API key will be required (100,000 requests per day per key). A key placed in front-end code on GitHub Pages is public, so do not rely on it. The site is built to survive this: if Datamuse or any API fails, the games use the built-in word list in `js/app.js` and the Learn page falls back to dictionaryapi.dev synonyms.

## Customize

- Add words: edit the `BANK` array in `js/app.js` (word, meaning, synonym).
- Add grammar questions: edit the `GRAMMAR` array.
- Change colors: edit the variables at the top of `css/style.css`.
- Progress is saved in the visitor's browser (localStorage), so it is per device.
