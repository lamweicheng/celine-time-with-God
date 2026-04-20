import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { BIBLE_BOOKS } from '@/lib/bible';

export const CUVS_ATTRIBUTION =
  'Scripture quotations marked CUVS are from the Chinese Union Version Simplified (CUVS), sourced from the Open Bibles public-domain USFX text.';

type CuvsBookRecord = {
  title: string;
  chapters: Record<string, { text: string; verses: Record<string, string> }>;
};

type CuvsData = {
  books: Record<string, CuvsBookRecord>;
};

type ParsedReference = {
  bookId: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
};

const CUVS_BOOK_IDS = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH',
  'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON',
  'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL',
  'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN',
  'JUD', 'REV'
];

const BOOK_IDS_BY_SLUG = Object.fromEntries(
  BIBLE_BOOKS.map((book, index) => [book.slug, CUVS_BOOK_IDS[index]])
) as Record<string, string>;

const BOOK_LOOKUPS = BIBLE_BOOKS.flatMap((book) => {
  const aliases = [book.name];

  if (book.slug === 'psalms') {
    aliases.push('Psalm');
  }

  return aliases.map((alias) => ({ alias: alias.toLowerCase(), slug: book.slug, chapters: book.chapters }));
}).sort((left, right) => right.alias.length - left.alias.length);

let cuvsDataPromise: Promise<CuvsData> | null = null;

export async function fetchCuvsPassage(query: string) {
  const parsedReference = parseCuvsQuery(query);

  if (!parsedReference) {
    return {
      text: null,
      error: 'Unable to parse this Scripture reference for CUVS.'
    };
  }

  const data = await loadCuvsData();
  const book = data.books[parsedReference.bookId];
  const chapter = book?.chapters[String(parsedReference.chapter)];

  if (!book || !chapter) {
    return {
      text: null,
      error: 'This passage is not available in the local CUVS data.'
    };
  }

  const referenceLabel = buildCuvsReferenceLabel(book.title, parsedReference);

  if (!parsedReference.verseStart) {
    return {
      text: `${referenceLabel}\n\n${chapter.text}`,
      error: null
    };
  }

  const verseEnd = parsedReference.verseEnd ?? parsedReference.verseStart;
  const lines: string[] = [];

  for (let verse = parsedReference.verseStart; verse <= verseEnd; verse += 1) {
    const verseText = chapter.verses[String(verse)];
    if (verseText) {
      lines.push(`${verse} ${verseText}`);
    }
  }

  return {
    text: lines.length ? `${referenceLabel}\n\n${lines.join('\n')}` : null,
    error: lines.length ? null : 'This verse range is not available in the local CUVS data.'
  };
}

async function loadCuvsData() {
  if (!cuvsDataPromise) {
    const filePath = path.join(process.cwd(), 'data', 'cuvs.json');
    cuvsDataPromise = readFile(filePath, 'utf8').then((content) => JSON.parse(content) as CuvsData);
  }

  return cuvsDataPromise;
}

function parseCuvsQuery(query: string): ParsedReference | null {
  const normalizedQuery = query.trim();
  const match = BOOK_LOOKUPS.find((item) => normalizedQuery.toLowerCase().startsWith(item.alias));

  if (!match) {
    return null;
  }

  const remainder = normalizedQuery.slice(match.alias.length).trim();
  const bookId = BOOK_IDS_BY_SLUG[match.slug];

  if (!bookId) {
    return null;
  }

  if (!remainder) {
    return match.chapters === 1 ? { bookId, chapter: 1 } : null;
  }

  const referenceMatch = remainder.match(/^(\d+)(?::(\d+)(?:-(\d+))?)?$/);

  if (!referenceMatch) {
    return null;
  }

  return {
    bookId,
    chapter: Number(referenceMatch[1]),
    verseStart: referenceMatch[2] ? Number(referenceMatch[2]) : undefined,
    verseEnd: referenceMatch[3] ? Number(referenceMatch[3]) : undefined
  };
}

function buildCuvsReferenceLabel(bookTitle: string, reference: ParsedReference) {
  if (!reference.verseStart) {
    return `${bookTitle} ${reference.chapter}`;
  }

  const verseEnd = reference.verseEnd ?? reference.verseStart;
  const verseRange = verseEnd === reference.verseStart
    ? `${reference.verseStart}`
    : `${reference.verseStart}-${verseEnd}`;

  return `${bookTitle} ${reference.chapter}:${verseRange}`;
}