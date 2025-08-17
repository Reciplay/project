class WakeWordProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) {
      return true;
    }

    const floatAudioData = input[0];
    if (!floatAudioData) {
      return true;
    }

    const sourceSampleRate = sampleRate;
    const targetSampleRate = 16000;
    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.floor(floatAudioData.length / ratio);
    const downsampled = new Float32Array(newLength);

    let inputIndex = 0;
    for (let i = 0; i < newLength; i++) {
      downsampled[i] = floatAudioData[Math.round(inputIndex)];
      inputIndex += ratio;
    }

    const pcm16 = new Int16Array(downsampled.length);
    for (let i = 0; i < downsampled.length; i++) {
      let s = Math.max(-1, Math.min(1, downsampled[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      pcm16[i] = s;
    }

    this.port.postMessage(pcm16);

    return true;
  }
}

registerProcessor("wake-capture", WakeWordProcessor);
