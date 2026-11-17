export function playQueueChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const context = new AudioContextClass()
    const playTone = (frequency: number, delay: number, duration: number) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.001, context.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.24, context.currentTime + delay + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + delay + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(context.currentTime + delay)
      oscillator.stop(context.currentTime + delay + duration)
    }
    playTone(659.25, 0, 0.55)
    playTone(523.25, 0.24, 0.85)
  } catch {
    // Browsers can block audio until the first user gesture.
  }
}
