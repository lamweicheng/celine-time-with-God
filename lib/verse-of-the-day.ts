import { getDayOfYear } from '@/lib/reading-plans';

const VERSE_REFERENCES = [
  'Psalm 119:105',
  'Matthew 11:28',
  'Isaiah 26:3',
  'Lamentations 3:22-23',
  'John 15:5',
  'Proverbs 3:5-6',
  'Romans 8:1',
  'Philippians 4:6-7',
  'James 1:5',
  'Psalm 46:10',
  'Hebrews 4:16',
  'Micah 6:8',
  'John 14:27',
  'Romans 12:2',
  '2 Corinthians 12:9',
  'Galatians 5:22-23',
  'Psalm 23:1',
  'Isaiah 40:31',
  'Colossians 3:15',
  'Ephesians 2:8-9',
  'Psalm 27:1',
  '1 Peter 5:7',
  'Hebrews 12:1-2',
  'Matthew 5:14-16',
  'John 1:5',
  'Romans 15:13',
  'Psalm 37:4',
  'Joshua 1:9',
  '1 Thessalonians 5:16-18',
  'Psalm 51:10',
  'Revelation 21:5'
] as const;

export function getVerseOfTheDay(date = new Date(), timeZone?: string | null) {
  const index = (getDayOfYear(date, timeZone) - 1 + VERSE_REFERENCES.length) % VERSE_REFERENCES.length;
  return VERSE_REFERENCES[index] ?? VERSE_REFERENCES[0];
}