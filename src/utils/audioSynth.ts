// Pure Web Audio ambient sound synthesizer for hotel TV experience
class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMode: 'fireplace' | 'zen' | 'off' = 'off';
  private fireNodes: { noise?: AudioNode; gain?: GainNode; timer?: number } = {};
  private zenTimer?: number;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMode(mode: 'fireplace' | 'zen' | 'off') {
    this.stop();
    this.currentMode = mode;
    if (mode === 'off') return;

    this.initContext();
    if (mode === 'fireplace') {
      this.startFireplace();
    } else if (mode === 'zen') {
      this.startZen();
    }
    this.isPlaying = true;
  }

  public getMode(): 'fireplace' | 'zen' | 'off' {
    return this.currentMode;
  }

  private startFireplace() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Pink/Brown noise generator for gentle fire rumble
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm wood combustion low frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    whiteNoise.start();

    // Occasional tiny crackle clicks
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || this.currentMode !== 'fireplace') return;
      if (Math.random() > 0.4) {
        const osc = this.ctx.createOscillator();
        const crackleGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250 + Math.random() * 800, now);
        crackleGain.gain.setValueAtTime(0.04 * (Math.random() + 0.5), now);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(crackleGain);
        crackleGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    }, 180);

    this.fireNodes = { noise: whiteNoise, gain: masterGain, timer: crackleInterval };
  }

  private startZen() {
    if (!this.ctx) return;
    const playChime = () => {
      if (!this.ctx || this.currentMode !== 'zen') return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C, E, G, C5, E5
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 4.6);
    };

    playChime();
    this.zenTimer = window.setInterval(playChime, 6000);
  }

  public stop() {
    if (this.fireNodes.timer) {
      clearInterval(this.fireNodes.timer);
    }
    if (this.fireNodes.noise && 'stop' in this.fireNodes.noise) {
      try {
        (this.fireNodes.noise as AudioScheduledSourceNode).stop();
      } catch {
        // Ignored
      }
    }
    if (this.zenTimer) {
      clearInterval(this.zenTimer);
    }
    this.isPlaying = false;
    this.currentMode = 'off';
  }
}

export const ambientSound = new AmbientSoundManager();
