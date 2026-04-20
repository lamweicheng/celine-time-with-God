export const DEFAULT_AMBIENCE_YOUTUBE_URL = 'https://www.youtube.com/watch?v=4U1xfZjvFTo&t=1384s';
export const AMBIENCE_URL_COOKIE = 'twg-ambience-youtube-url';
export const DEFAULT_AMBIENCE_VOLUME = 35;

type ParsedYoutubeUrl = {
  videoId: string;
  startSeconds: number;
};

export function normalizeYoutubeUrl(value?: string | null) {
  const parsed = parseYoutubeUrl(value);

  if (!parsed) {
    return DEFAULT_AMBIENCE_YOUTUBE_URL;
  }

  const url = new URL('https://www.youtube.com/watch');
  url.searchParams.set('v', parsed.videoId);

  if (parsed.startSeconds > 0) {
    url.searchParams.set('t', String(parsed.startSeconds));
  }

  return url.toString();
}

export function buildYoutubeEmbedUrl(value?: string | null) {
  const parsed = parseYoutubeUrl(value);

  if (!parsed) {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    loop: '1',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    playlist: parsed.videoId,
    start: String(parsed.startSeconds)
  });

  return `https://www.youtube-nocookie.com/embed/${parsed.videoId}?${params.toString()}`;
}

export function getYoutubeVideoConfig(value?: string | null) {
  return parseYoutubeUrl(value);
}

function parseYoutubeUrl(value?: string | null): ParsedYoutubeUrl | null {
  const candidate = value?.trim();

  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      return videoId
        ? {
            videoId,
            startSeconds: parseYoutubeTime(parsed.searchParams.get('t') ?? parsed.searchParams.get('start') ?? '0')
          }
        : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId =
        parsed.searchParams.get('v') ??
        parsed.pathname.split('/').filter(Boolean)[1] ??
        null;

      if (!videoId) {
        return null;
      }

      return {
        videoId,
        startSeconds: parseYoutubeTime(parsed.searchParams.get('t') ?? parsed.searchParams.get('start') ?? '0')
      };
    }

    return null;
  } catch {
    return null;
  }
}

function parseYoutubeTime(value: string) {
  if (!value) {
    return 0;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const hours = /(?:(\d+)h)/.exec(value)?.[1];
  const minutes = /(?:(\d+)m)/.exec(value)?.[1];
  const seconds = /(?:(\d+)s)/.exec(value)?.[1];

  return Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0);
}