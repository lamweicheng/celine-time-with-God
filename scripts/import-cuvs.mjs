import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const sourcePath = path.join(process.cwd(), 'scripture-source', 'chi-cuv-simp.usfx.xml');
const outputPath = path.join(process.cwd(), 'data', 'cuvs.json');

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
  processEntities: false
});

const xml = await fs.readFile(sourcePath, 'utf8');
const parsed = parser.parse(xml);
const usfxNode = parsed.find((node) => node.usfx)?.usfx;

if (!usfxNode) {
  throw new Error('Unable to find the <usfx> root in chi-cuv-simp.usfx.xml.');
}

const books = {};

for (const node of usfxNode) {
  if (!node.book) {
    continue;
  }

  const bookId = node[':@']?.['@_id'];

  if (!bookId) {
    continue;
  }

  const bookState = {
    title: '',
    chapters: {}
  };

  let currentChapter = null;
  let currentVerse = null;

  walkNodes(node.book, {
    onTitle(text) {
      if (!bookState.title) {
        bookState.title = text;
      }
    },
    onChapter(chapterId) {
      currentChapter = chapterId;
      currentVerse = null;

      if (!bookState.chapters[currentChapter]) {
        bookState.chapters[currentChapter] = {
          text: '',
          verses: {}
        };
      }
    },
    onVerse(verseId) {
      currentVerse = verseId;

      if (currentChapter && !bookState.chapters[currentChapter].verses[currentVerse]) {
        bookState.chapters[currentChapter].verses[currentVerse] = '';
      }
    },
    onVerseEnd() {
      currentVerse = null;
    },
    onText(text) {
      if (!currentChapter || !currentVerse) {
        return;
      }

      bookState.chapters[currentChapter].verses[currentVerse] += text;
    }
  });

  for (const [chapterId, chapterRecord] of Object.entries(bookState.chapters)) {
    chapterRecord.text = Object.entries(chapterRecord.verses)
      .map(([verseId, verseText]) => `${verseId} ${cleanText(verseText)}`)
      .join('\n');

    for (const verseId of Object.keys(chapterRecord.verses)) {
      chapterRecord.verses[verseId] = cleanText(chapterRecord.verses[verseId]);
    }

    if (!chapterRecord.text) {
      delete bookState.chapters[chapterId];
    }
  }

  books[bookId] = bookState;
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify({ books }), 'utf8');

console.log(`Imported ${Object.keys(books).length} CUVS books into ${path.relative(process.cwd(), outputPath)}.`);

function walkNodes(nodes, handlers) {
  for (const node of nodes) {
    for (const [key, value] of Object.entries(node)) {
      if (key === ':@' || value == null) {
        continue;
      }

      if (key === '#text') {
        const text = cleanText(value);
        if (text) {
          handlers.onText(text);
        }
        continue;
      }

      if (key === 'h') {
        const titleText = extractText(value);
        if (titleText) {
          handlers.onTitle(titleText);
        }
      }

      if (key === 'c') {
        const chapterId = node[':@']?.['@_id'];
        if (chapterId) {
          handlers.onChapter(chapterId);
        }
      }

      if (key === 'v') {
        const verseId = node[':@']?.['@_id'];
        if (verseId) {
          handlers.onVerse(verseId);
        }
      }

      if (key === 've') {
        handlers.onVerseEnd();
      }

      if (Array.isArray(value)) {
        walkNodes(value, handlers);
      }
    }
  }
}

function extractText(nodes) {
  return nodes
    .flatMap((node) => {
      if (typeof node['#text'] === 'string') {
        return [node['#text']];
      }

      return Object.values(node)
        .filter(Array.isArray)
        .flatMap((child) => extractText(child));
    })
    .map(cleanText)
    .join('')
    .trim();
}

function cleanText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}