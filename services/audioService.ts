// Decodes raw PCM data from Gemini TTS and plays it
export const playRawAudio = async (audioData: ArrayBuffer, sampleRate = 24000) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate,
  });

  // Helper to decode raw PCM
  const decodeAudioData = (
    data: ArrayBuffer,
    ctx: AudioContext,
    rate: number,
    numChannels: number
  ): AudioBuffer => {
    const dataInt16 = new Int16Array(data);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, rate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32 [-1.0, 1.0]
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  try {
    const audioBuffer = decodeAudioData(audioData, audioContext, sampleRate, 1); // Mono channel assumption for TTS
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    return source; // Return source in case we want to stop it later
  } catch (error) {
    console.error("Error playing audio", error);
    await audioContext.close();
    throw error;
  }
};
