export type ScripturePassage = {
  id: 'ESV' | 'CUVS';
  label: string;
  text: string | null;
  error: string | null;
  attribution: string;
};