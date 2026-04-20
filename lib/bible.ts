export type Testament = 'OLD' | 'NEW';

export type BibleBook = {
  slug: string;
  name: string;
  shortName: string;
  testament: Testament;
  chapters: number;
  order: number;
};

export type ChapterReference = {
  bookSlug: string;
  chapter: number;
};

export const BIBLE_BOOKS: BibleBook[] = [
  { slug: 'genesis', name: 'Genesis', shortName: 'Gen.', testament: 'OLD', chapters: 50, order: 1 },
  { slug: 'exodus', name: 'Exodus', shortName: 'Ex.', testament: 'OLD', chapters: 40, order: 2 },
  { slug: 'leviticus', name: 'Leviticus', shortName: 'Lev.', testament: 'OLD', chapters: 27, order: 3 },
  { slug: 'numbers', name: 'Numbers', shortName: 'Num.', testament: 'OLD', chapters: 36, order: 4 },
  { slug: 'deuteronomy', name: 'Deuteronomy', shortName: 'Deut.', testament: 'OLD', chapters: 34, order: 5 },
  { slug: 'joshua', name: 'Joshua', shortName: 'Josh.', testament: 'OLD', chapters: 24, order: 6 },
  { slug: 'judges', name: 'Judges', shortName: 'Judg.', testament: 'OLD', chapters: 21, order: 7 },
  { slug: 'ruth', name: 'Ruth', shortName: 'Ruth', testament: 'OLD', chapters: 4, order: 8 },
  { slug: '1-samuel', name: '1 Samuel', shortName: '1 Sam.', testament: 'OLD', chapters: 31, order: 9 },
  { slug: '2-samuel', name: '2 Samuel', shortName: '2 Sam.', testament: 'OLD', chapters: 24, order: 10 },
  { slug: '1-kings', name: '1 Kings', shortName: '1 Kings', testament: 'OLD', chapters: 22, order: 11 },
  { slug: '2-kings', name: '2 Kings', shortName: '2 Kings', testament: 'OLD', chapters: 25, order: 12 },
  { slug: '1-chronicles', name: '1 Chronicles', shortName: '1 Chron.', testament: 'OLD', chapters: 29, order: 13 },
  { slug: '2-chronicles', name: '2 Chronicles', shortName: '2 Chron.', testament: 'OLD', chapters: 36, order: 14 },
  { slug: 'ezra', name: 'Ezra', shortName: 'Ezra', testament: 'OLD', chapters: 10, order: 15 },
  { slug: 'nehemiah', name: 'Nehemiah', shortName: 'Neh.', testament: 'OLD', chapters: 13, order: 16 },
  { slug: 'esther', name: 'Esther', shortName: 'Est.', testament: 'OLD', chapters: 10, order: 17 },
  { slug: 'job', name: 'Job', shortName: 'Job', testament: 'OLD', chapters: 42, order: 18 },
  { slug: 'psalms', name: 'Psalms', shortName: 'Ps.', testament: 'OLD', chapters: 150, order: 19 },
  { slug: 'proverbs', name: 'Proverbs', shortName: 'Prov.', testament: 'OLD', chapters: 31, order: 20 },
  { slug: 'ecclesiastes', name: 'Ecclesiastes', shortName: 'Eccl.', testament: 'OLD', chapters: 12, order: 21 },
  { slug: 'song-of-solomon', name: 'Song of Solomon', shortName: 'Song', testament: 'OLD', chapters: 8, order: 22 },
  { slug: 'isaiah', name: 'Isaiah', shortName: 'Isa.', testament: 'OLD', chapters: 66, order: 23 },
  { slug: 'jeremiah', name: 'Jeremiah', shortName: 'Jer.', testament: 'OLD', chapters: 52, order: 24 },
  { slug: 'lamentations', name: 'Lamentations', shortName: 'Lam.', testament: 'OLD', chapters: 5, order: 25 },
  { slug: 'ezekiel', name: 'Ezekiel', shortName: 'Ezek.', testament: 'OLD', chapters: 48, order: 26 },
  { slug: 'daniel', name: 'Daniel', shortName: 'Dan.', testament: 'OLD', chapters: 12, order: 27 },
  { slug: 'hosea', name: 'Hosea', shortName: 'Hos.', testament: 'OLD', chapters: 14, order: 28 },
  { slug: 'joel', name: 'Joel', shortName: 'Joel', testament: 'OLD', chapters: 3, order: 29 },
  { slug: 'amos', name: 'Amos', shortName: 'Amos', testament: 'OLD', chapters: 9, order: 30 },
  { slug: 'obadiah', name: 'Obadiah', shortName: 'Obad.', testament: 'OLD', chapters: 1, order: 31 },
  { slug: 'jonah', name: 'Jonah', shortName: 'Jonah', testament: 'OLD', chapters: 4, order: 32 },
  { slug: 'micah', name: 'Micah', shortName: 'Mic.', testament: 'OLD', chapters: 7, order: 33 },
  { slug: 'nahum', name: 'Nahum', shortName: 'Nah.', testament: 'OLD', chapters: 3, order: 34 },
  { slug: 'habakkuk', name: 'Habakkuk', shortName: 'Hab.', testament: 'OLD', chapters: 3, order: 35 },
  { slug: 'zephaniah', name: 'Zephaniah', shortName: 'Zeph.', testament: 'OLD', chapters: 3, order: 36 },
  { slug: 'haggai', name: 'Haggai', shortName: 'Hag.', testament: 'OLD', chapters: 2, order: 37 },
  { slug: 'zechariah', name: 'Zechariah', shortName: 'Zech.', testament: 'OLD', chapters: 14, order: 38 },
  { slug: 'malachi', name: 'Malachi', shortName: 'Mal.', testament: 'OLD', chapters: 4, order: 39 },
  { slug: 'matthew', name: 'Matthew', shortName: 'Matt.', testament: 'NEW', chapters: 28, order: 40 },
  { slug: 'mark', name: 'Mark', shortName: 'Mark', testament: 'NEW', chapters: 16, order: 41 },
  { slug: 'luke', name: 'Luke', shortName: 'Luke', testament: 'NEW', chapters: 24, order: 42 },
  { slug: 'john', name: 'John', shortName: 'John', testament: 'NEW', chapters: 21, order: 43 },
  { slug: 'acts', name: 'Acts', shortName: 'Acts', testament: 'NEW', chapters: 28, order: 44 },
  { slug: 'romans', name: 'Romans', shortName: 'Rom.', testament: 'NEW', chapters: 16, order: 45 },
  { slug: '1-corinthians', name: '1 Corinthians', shortName: '1 Cor.', testament: 'NEW', chapters: 16, order: 46 },
  { slug: '2-corinthians', name: '2 Corinthians', shortName: '2 Cor.', testament: 'NEW', chapters: 13, order: 47 },
  { slug: 'galatians', name: 'Galatians', shortName: 'Gal.', testament: 'NEW', chapters: 6, order: 48 },
  { slug: 'ephesians', name: 'Ephesians', shortName: 'Eph.', testament: 'NEW', chapters: 6, order: 49 },
  { slug: 'philippians', name: 'Philippians', shortName: 'Phil.', testament: 'NEW', chapters: 4, order: 50 },
  { slug: 'colossians', name: 'Colossians', shortName: 'Col.', testament: 'NEW', chapters: 4, order: 51 },
  { slug: '1-thessalonians', name: '1 Thessalonians', shortName: '1 Thess.', testament: 'NEW', chapters: 5, order: 52 },
  { slug: '2-thessalonians', name: '2 Thessalonians', shortName: '2 Thess.', testament: 'NEW', chapters: 3, order: 53 },
  { slug: '1-timothy', name: '1 Timothy', shortName: '1 Tim.', testament: 'NEW', chapters: 6, order: 54 },
  { slug: '2-timothy', name: '2 Timothy', shortName: '2 Tim.', testament: 'NEW', chapters: 4, order: 55 },
  { slug: 'titus', name: 'Titus', shortName: 'Titus', testament: 'NEW', chapters: 3, order: 56 },
  { slug: 'philemon', name: 'Philemon', shortName: 'Philem.', testament: 'NEW', chapters: 1, order: 57 },
  { slug: 'hebrews', name: 'Hebrews', shortName: 'Heb.', testament: 'NEW', chapters: 13, order: 58 },
  { slug: 'james', name: 'James', shortName: 'James', testament: 'NEW', chapters: 5, order: 59 },
  { slug: '1-peter', name: '1 Peter', shortName: '1 Pet.', testament: 'NEW', chapters: 5, order: 60 },
  { slug: '2-peter', name: '2 Peter', shortName: '2 Pet.', testament: 'NEW', chapters: 3, order: 61 },
  { slug: '1-john', name: '1 John', shortName: '1 John', testament: 'NEW', chapters: 5, order: 62 },
  { slug: '2-john', name: '2 John', shortName: '2 John', testament: 'NEW', chapters: 1, order: 63 },
  { slug: '3-john', name: '3 John', shortName: '3 John', testament: 'NEW', chapters: 1, order: 64 },
  { slug: 'jude', name: 'Jude', shortName: 'Jude', testament: 'NEW', chapters: 1, order: 65 },
  { slug: 'revelation', name: 'Revelation', shortName: 'Rev.', testament: 'NEW', chapters: 22, order: 66 }
];

const booksBySlug = new Map(BIBLE_BOOKS.map((book) => [book.slug, book]));

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((book) => book.testament === 'OLD');
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter((book) => book.testament === 'NEW');
export const TOTAL_BIBLE_CHAPTERS = BIBLE_BOOKS.reduce((total, book) => total + book.chapters, 0);
export const OLD_TESTAMENT_CHAPTERS = OLD_TESTAMENT_BOOKS.reduce((total, book) => total + book.chapters, 0);
export const NEW_TESTAMENT_CHAPTERS = NEW_TESTAMENT_BOOKS.reduce((total, book) => total + book.chapters, 0);

export function getBookBySlug(bookSlug: string) {
  return booksBySlug.get(bookSlug) ?? null;
}

export function getBookChapters(bookSlug: string) {
  const book = getBookBySlug(bookSlug);
  if (!book) {
    return [];
  }

  return Array.from({ length: book.chapters }, (_, index) => index + 1);
}

export function getReferenceLabel(bookSlug: string, chapter: number) {
  const book = getBookBySlug(bookSlug);
  return book ? `${book.name} ${chapter}` : `${bookSlug} ${chapter}`;
}

export function getPassageQuery(bookSlug: string, chapter: number) {
  const book = getBookBySlug(bookSlug);

  if (!book) {
    return `${bookSlug} ${chapter}`;
  }

  if (book.chapters === 1) {
    return book.name;
  }

  return `${book.name} ${chapter}`;
}

export function listAllChapters() {
  return BIBLE_BOOKS.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      bookSlug: book.slug,
      chapter: index + 1
    }))
  );
}

export function getAdjacentChapter(bookSlug: string, chapter: number, direction: 'previous' | 'next') {
  const currentBook = getBookBySlug(bookSlug);
  if (!currentBook) {
    return null;
  }

  if (direction === 'previous') {
    if (chapter > 1) {
      return { bookSlug, chapter: chapter - 1 };
    }

    const previousBook = BIBLE_BOOKS[currentBook.order - 2];
    return previousBook ? { bookSlug: previousBook.slug, chapter: previousBook.chapters } : null;
  }

  if (chapter < currentBook.chapters) {
    return { bookSlug, chapter: chapter + 1 };
  }

  const nextBook = BIBLE_BOOKS[currentBook.order];
  return nextBook ? { bookSlug: nextBook.slug, chapter: 1 } : null;
}

export function isValidChapter(bookSlug: string, chapter: number) {
  const book = getBookBySlug(bookSlug);
  return Boolean(book && chapter >= 1 && chapter <= book.chapters);
}

export function getChapterKey(reference: ChapterReference) {
  return `${reference.bookSlug}:${reference.chapter}`;
}

export function expandBooks(bookSlugs: string[]) {
  return bookSlugs.flatMap((bookSlug) =>
    getBookChapters(bookSlug).map((chapter) => ({
      bookSlug,
      chapter
    }))
  );
}