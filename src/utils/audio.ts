/**
 * Web Audio API synthesizer to procedurally generate the iconic Portuguese melodies
 * of the 25th of April, filtered to sound like a vintage 1974 radio broadcast.
 */

interface Note {
  freq: number;
  duration: number; // in seconds
}

// Melody frequencies for "Grândola, Vila Morena"
// Intro basic melody: G3, A3, G3, F3, G3, F3, E3, D3, E3, F3, G3, F3...
export const GRANDOLA_MELODY: Note[] = [
  { freq: 196.00, duration: 0.6 }, // G3 (Grân-)
  { freq: 220.00, duration: 0.4 }, // A3 (-do-)
  { freq: 196.00, duration: 0.8 }, // G3 (-la)
  { freq: 174.61, duration: 0.4 }, // F3 (vi-)
  { freq: 196.00, duration: 0.4 }, // G3 (-la)
  { freq: 174.61, duration: 0.4 }, // F3 (mo-)
  { freq: 164.81, duration: 0.4 }, // E3 (-re-)
  { freq: 146.83, duration: 0.8 }, // D3 (-na)
  
  { freq: 164.81, duration: 0.6 }, // E3 (Ter-)
  { freq: 174.61, duration: 0.4 }, // F3 (-ra)
  { freq: 196.00, duration: 0.8 }, // G3 (da)
  { freq: 174.61, duration: 0.4 }, // F3 (fra-)
  { freq: 164.81, duration: 0.4 }, // E3 (-ter-)
  { freq: 146.83, duration: 0.4 }, // D3 (-ni-)
  { freq: 130.81, duration: 0.4 }, // C3 (-da-)
  { freq: 146.83, duration: 1.2 }, // D3 (-de)
];

// Melody frequencies for "E Depois do Adeus"
// Verse: D4, C#4, D4, E4, F4, G4, A4...
export const ADEUS_MELODY: Note[] = [
  { freq: 293.66, duration: 0.5 }, // D4 (Quis)
  { freq: 277.18, duration: 0.3 }, // C#4 (sa-)
  { freq: 293.66, duration: 0.5 }, // D4 (-ber)
  { freq: 329.63, duration: 0.5 }, // E4 (quem)
  { freq: 349.23, duration: 0.5 }, // F4 (sou)
  { freq: 392.00, duration: 0.5 }, // G4 (o)
  { freq: 440.00, duration: 1.0 }, // A4 (que fa-)
  { freq: 392.00, duration: 0.8 }, // G4 (-ço)
  { freq: 349.23, duration: 0.8 }, // F4 (a-)
  { freq: 293.66, duration: 1.2 }, // D4 (-qui)
];

// Voice speech simulation using synth hum (Morse code lookalike or vintage beeps for testimony playback)
export const TESTIMONY_BEEP: Note[] = [
  { freq: 330, duration: 0.1 },
  { freq: 380, duration: 0.15 },
  { freq: 350, duration: 0.1 },
  { freq: 420, duration: 0.12 },
  { freq: 390, duration: 0.2 },
];

let audioCtx: AudioContext | null = null;
let currentSchedulerTimer: NodeJS.Timeout | null = null;
let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

function getAudioContext() {
  if (!audioCtx) {
    // Standard and vendor prefixed context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Stops any actively playing procedural audio.
 */
export function stopProceduralAudio() {
  if (currentSchedulerTimer) {
    clearTimeout(currentSchedulerTimer);
    currentSchedulerTimer = null;
  }
  
  activeOscillators.forEach(({ osc, gain }) => {
    try {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    } catch (e) {
      // already stopped or removed
    }
  });
  activeOscillators = [];
}

/**
 * Plays a preloaded melody sequentially using simple osc synthesizers
 * and paths through a "Bandpass Filter" to sound like a vintage radio.
 */
export function playMelody(notes: Note[], onNoteChange?: (index: number) => void, onComplete?: () => void) {
  stopProceduralAudio();
  
  const ctx = getAudioContext();
  let timeOffset = ctx.currentTime;
  
  // Create an old AM Radio Bandpass Filter to filter out high and low frequencies
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1000; // Peak around 1kHz for retro radio box sound
  bandpass.Q.value = 1.5; // High Q for telephone/vintage narrow frequency effect
  
  // Add some soft pink/white noise or retro static hum
  const staticGain = ctx.createGain();
  staticGain.gain.setValueAtTime(0.015, ctx.currentTime); // very low hum
  
  // Connect background radio static
  const oscStatic = ctx.createOscillator();
  oscStatic.type = 'triangle';
  oscStatic.frequency.value = 50; // 50 Hz line hum
  
  oscStatic.connect(staticGain);
  staticGain.connect(bandpass);
  bandpass.connect(ctx.destination);
  
  oscStatic.start();
  // Keep track of background hum
  activeOscillators.push({ osc: oscStatic, gain: staticGain });
  
  let currentNoteIndex = 0;
  
  const scheduleNextNote = () => {
    if (currentNoteIndex >= notes.length) {
      // Finished melody
      if (onComplete) onComplete();
      return;
    }
    
    if (onNoteChange) {
      onNoteChange(currentNoteIndex);
    }
    
    const note = notes[currentNoteIndex];
    
    // Create oscillator (warm vintage triangle wave)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime);
    
    // Add sub-harmonic sine wave for full analog warm synth sound (like deep Zeca Voices)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(note.freq / 2, ctx.currentTime);
    
    // Gain / envelope controls
    const noteGain = ctx.createGain();
    const now = ctx.currentTime;
    
    // Smooth Attack-Decay envelope to simulate retro woodwinds or organs
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.2, now + 0.05); // attack (0.2 volume)
    noteGain.gain.setValueAtTime(0.2, now + note.duration - 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + note.duration); // release
    
    // Connect everything
    osc.connect(noteGain);
    subOsc.connect(noteGain);
    noteGain.connect(bandpass);
    
    osc.start(now);
    subOsc.start(now);
    
    activeOscillators.push({ osc, gain: noteGain });
    activeOscillators.push({ osc: subOsc, gain: noteGain });
    
    // Schedule stop
    const stopTimeMs = note.duration * 1000;
    
    currentSchedulerTimer = setTimeout(() => {
      try {
        osc.stop();
        subOsc.stop();
      } catch (e) {}
      
      currentNoteIndex++;
      scheduleNextNote();
    }, stopTimeMs);
  };
  
  // Start scheduling
  scheduleNextNote();
}

/**
 * Procedural retro morse/voice simulator to click-trigger vintage key notes
 */
export function playHistoricBleep() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = Math.random() * 200 + 400; // random warm tone
  
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}
