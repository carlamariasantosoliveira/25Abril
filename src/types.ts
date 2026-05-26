export interface TimelineEvent {
  id: string;
  time: string;
  hour: number; // For sorting/filtering
  title: string;
  location: string;
  description: string;
  detailedText: string;
  importance: 'critical' | 'alert' | 'normal';
  imagePlaceholder?: string;
  audioTrack?: {
    songTitle: string;
    artist: string;
    description: string;
    lyricsKeySelection: string[];
    importance: string;
  };
}

export interface Captain {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  birthDeath: string;
  biography: string;
  accomplishments: string[];
  quote: string;
  imageUrl: string;
  secondaryImage?: string;
}

export interface Testimony {
  id: string;
  name: string;
  ageIn1974: number;
  occupation: string;
  location: string;
  narrative: string;
  vibe: 'hopeful' | 'tense' | 'liberated' | 'reflective';
  audioClipText?: string;
}

export interface PhotoItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'ruas' | 'militar' | 'simbolos' | 'celebracoes';
  description: string;
  year: string;
  location?: string;
}
