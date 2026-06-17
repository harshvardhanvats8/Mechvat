/**
 * Web Audio API synthesizer for premium mechanical, hydraulic, and gear sounds
 * Matches the required "mechanical feel and sound in click responses" perfectly without external audio files.
 */
class MechanicalAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMutedState(): boolean {
    return this.isMuted;
  }

  playClick(type: "metallic" | "hydraulic" | "gear" | "pneumatic") {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case "metallic": {
        // Metallic clink of high carbon alloy steels
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1800, now);
        osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(3200, now);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1500, now);
        filter.Q.setValueAtTime(5, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.08);
        osc2.stop(now + 0.08);
        break;
      }
      case "hydraulic": {
        // Subtle pneumatic exhaust hiss or fluid valve sealing
        const bufferSize = this.ctx.sampleRate * 0.15; // 150ms buffer
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.15);
        break;
      }
      case "gear": {
        // Quick dual-click to sound like tooth mating
        const playToothContact = (timeOffset: number) => {
          if (!this.ctx) return;
          const clickTime = now + timeOffset;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, clickTime);
          osc.frequency.setValueAtTime(220, clickTime + 0.015);

          gain.gain.setValueAtTime(0.06, clickTime);
          gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(clickTime);
          osc.stop(clickTime + 0.025);
        };

        playToothContact(0);
        playToothContact(0.018); // Second tooth engages slightly after
        break;
      }
      case "pneumatic": {
        // High pressure solenoid valve release sound
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = "highpass";
        filter.frequency.setValueAtTime(2500, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.18);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.25);
        break;
      }
    }
  }
}

export const mechanicalAudio = new MechanicalAudioEngine();
