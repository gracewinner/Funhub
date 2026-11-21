class JungleSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.14,
    delay = 0,
    slideTo?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick(): void {
    this.tone(520, 0.07, 'triangle', 0.09, 0, 660);
  }

  public playCatch(combo = 1): void {
    const base = 440 + Math.min(combo, 8) * 45;
    this.tone(base, 0.11, 'triangle', 0.14, 0, base * 1.28);
  }

  public playCombo(): void {
    this.tone(523.25, 0.1, 'triangle', 0.14, 0);
    this.tone(659.25, 0.1, 'triangle', 0.14, 0.07);
    this.tone(783.99, 0.14, 'triangle', 0.15, 0.14);
    this.tone(1046.5, 0.22, 'sine', 0.16, 0.21);
  }

  public playNote(index: number): void {
    const pentatonic = [392.0, 440.0, 523.25, 659.25, 783.99];
    const freq = pentatonic[index % pentatonic.length];
    this.tone(freq, 0.28, 'sine', 0.16);
    this.tone(freq * 2, 0.12, 'triangle', 0.05);
  }

  public playDrum(lane = 0): void {
    const pitches = [165, 210, 260];
    const freq = pitches[lane % pitches.length];
    this.tone(freq, 0.16, 'triangle', 0.2, 0, freq * 0.55);
  }

  public playHop(): void {
    this.tone(330, 0.1, 'sine', 0.12, 0, 540);
  }

  public playBubblePop(): void {
    this.tone(580, 0.09, 'sine', 0.14, 0, 920);
  }

  public playBossHit(): void {
    this.tone(240, 0.14, 'sawtooth', 0.08, 0, 480);
    this.tone(660, 0.16, 'triangle', 0.14, 0.05);
  }

  public playOops(): void {
    this.tone(260, 0.16, 'triangle', 0.14, 0, 155);
    this.tone(190, 0.18, 'sine', 0.12, 0.08, 120);
  }

  public playVictory(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.tone(n, 0.24, 'triangle', 0.15, idx * 0.1);
    });
  }
}

export const soundEngine = new JungleSoundEngine();
