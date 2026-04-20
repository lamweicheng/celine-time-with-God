import type { ScriptureDisplayMode } from '@prisma/client';
import { CUVS_ATTRIBUTION, fetchCuvsPassage } from '@/lib/cuvs';
import { ESV_ATTRIBUTION, fetchEsvPassage } from '@/lib/esv';
import type { ScripturePassage } from '@/lib/scripture-types';

export async function fetchScripturePassages(mode: ScriptureDisplayMode, query: string): Promise<ScripturePassage[]> {
  const passages: ScripturePassage[] = [];

  if (mode === 'ESV' || mode === 'BOTH') {
    const result = await fetchEsvPassage(query);
    passages.push({
      id: 'ESV',
      label: 'ESV',
      text: result.text,
      error: result.error,
      attribution: ESV_ATTRIBUTION
    });
  }

  if (mode === 'CUVS' || mode === 'BOTH') {
    const result = await fetchCuvsPassage(query);
    passages.push({
      id: 'CUVS',
      label: 'CUVS',
      text: result.text,
      error: result.error,
      attribution: CUVS_ATTRIBUTION
    });
  }

  return passages;
}