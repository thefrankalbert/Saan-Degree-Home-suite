// Pure Web Audio ambient sound synthesizer for hotel TV experience
class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMode: 'fireplace' | 'zen' | 'off' = 'off';
  private fireNodes: { noise?: AudioNode; gain?: GainNode; timer?: number } = {};
  private zenTimer?: number;

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('Web Audio not supported on this TV browser:', e);
    }
  }

  public setMode(mode: 'fireplace' | 'zen' | 'off') {
    try {
      this.stop();
      this.currentMode = mode;
      if (mode === 'off') return;

      this.initContext();
      if (!this.ctx) return;

      if (mode === 'fireplace') {
        this.startFireplace();
      } else if (mode === 'zen') {
        this.startZen();
      }
      this.isPlaying = true;
    } catch (e) {
      console.warn('Failed to switch audio mode:', e);
    }
  }

  public getMode(): 'fireplace' | 'zen' | 'off' {
    return this.currentMode;
  }

  private startFireplace() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    try {
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
      filter.frequency.value = 380;

      const gain = ctx.createGain();
      gain.gain.value = 0.07;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      this.fireNodes.noise = whiteNoise;
      this.fireNodes.gain = gain;

      // Crackling embers simulation
      const crackle = () => {
        if (!this.isPlaying || this.currentMode !== 'fireplace' || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const crackleGain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200 + Math.random() * 1800, this.ctx.currentTime);
          crackleGain.gain.setValueAtTime(0.04 + Math.random() * 0.04, this.ctx.currentTime);
          crackleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          osc.connect(crackleGain);
          crackleGain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.05);
        } catch {
          // Ignored
        }

        const nextTime = Math.random() * 800 + 200;
        this.fireNodes.timer = window.setTimeout(crackle, nextTime);
      };

      crackle();
    } catch (e) {
      console.warn('Fireplace sound error:', e);
    }
  }

  private startZen() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    try {
      // Warm chord drone
      const chords = [220, 277.18, 329.63, 440]; // A major 7th gentle hotel chord
      chords.forEach(freq => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.value = 0.015;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
        } catch {
          // Ignored
        }
      });
    } catch (e) {
      console.warn('Zen sound error:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.fireNodes.timer) {
      clearTimeout(this.fireNodes.timer);
    }
    if (this.zenTimer) {
      clearTimeout(this.zenTimer);
    }
    try {
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close().catch(() => {});
        this.ctx = null;
      }
    } catch {
      // Ignored
    }
    this.fireNodes = {};
  }
}

export const ambientSound = new AmbientSoundManager();
