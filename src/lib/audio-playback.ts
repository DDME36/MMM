type Track = 'ambient' | 'song';
type AudioSource = Pick<HTMLAudioElement, 'paused' | 'play' | 'pause' | 'addEventListener' | 'removeEventListener'>;

/** One playback intent owns both elements, including pending play() promises. */
export function createAudioPlayback(ambient: AudioSource, song: AudioSource, onState: (ambient: boolean, song: boolean) => void, onError: () => void) {
  const sources = { ambient, song };
  let target: Track | null = null;
  let backgroundEnabled = false;
  let request = 0;
  let disposed = false;
  const update = () => onState(target === 'ambient' && !ambient.paused, target === 'song' && !song.paused);
  const select = (next: Track | null) => {
    target = next;
    const version = ++request;
    for (const track of ['ambient', 'song'] as const) if (track !== next) sources[track].pause();
    update();
    if (!next) return;
    sources[next].play().then(() => {
      // An older successful request must never restart a track after a switch/mute.
      if (disposed || target !== next) sources[next].pause();
      if (!disposed) update();
    }).catch(() => {
      if (disposed || version !== request) return;
      onError();
      select(next === 'song' && backgroundEnabled ? 'ambient' : null);
    });
  };
  const finishSong = () => { if (target === 'song') select(backgroundEnabled ? 'ambient' : null); };
  const listeners: Array<[AudioSource, string, EventListener]> = [];
  const listen = (source: AudioSource, type: string, handler: () => void) => {
    source.addEventListener(type, handler);
    listeners.push([source, type, handler]);
  };
  for (const track of ['ambient', 'song'] as const) {
    listen(sources[track], 'play', () => {
      if (target !== track) sources[track].pause();
      else sources[track === 'song' ? 'ambient' : 'song'].pause();
      update();
    });
    listen(sources[track], 'pause', () => { if (track === 'song' && song.paused) finishSong(); update(); });
    listen(sources[track], 'error', () => {
      if (target !== track) return;
      onError();
      if (track === 'song') finishSong(); else select(null);
    });
  }
  listen(song, 'ended', finishSong);
  const setAllowed = (allowed: boolean) => {
    backgroundEnabled = allowed;
    select(allowed ? target === 'song' ? 'song' : 'ambient' : null);
  };
  return {
    setAllowed,
    startExperience: () => { if (backgroundEnabled && target !== 'song') select('ambient'); },
    toggleAmbient: () => setAllowed(target !== 'ambient'),
    toggleSong: () => select(target === 'song' ? backgroundEnabled ? 'ambient' : null : 'song'),
    toggleSound: () => setAllowed(target === null),
    dispose: () => {
      disposed = true; ++request; target = null;
      for (const [source, type, handler] of listeners) source.removeEventListener(type, handler);
      ambient.pause(); song.pause();
    },
  };
}
