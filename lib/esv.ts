const ESV_ENDPOINT = 'https://api.esv.org/v3/passage/text/';

export const ESV_ATTRIBUTION =
  'Scripture quotations are from The Holy Bible, English Standard Version (ESV), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.';

export async function fetchEsvPassage(query: string) {
  const apiKey = process.env.ESV_API_KEY;

  if (!apiKey) {
    return {
      text: null,
      error: 'Set ESV_API_KEY to load Scripture text from the official ESV API.'
    };
  }

  const params = new URLSearchParams({
    q: query,
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
    'include-passage-references': 'true',
    'include-verse-numbers': 'true',
    'include-first-verse-numbers': 'true',
    'include-chapter-numbers': 'false'
  });

  const response = await fetch(`${ESV_ENDPOINT}?${params.toString()}`, {
    headers: {
      Authorization: `Token ${apiKey}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    return {
      text: null,
      error: 'The ESV API request failed. Check ESV_API_KEY and try again.'
    };
  }

  const payload = (await response.json()) as { passages?: string[] };

  return {
    text: payload.passages?.[0]?.trim() ?? null,
    error: null
  };
}