const BASE_URL = import.meta.env.VITE_API_BASE_URL || location.origin
const DEFAULT_COUNT = parseInt(import.meta.env.VITE_STREAM_COUNT, 10) || 100
const STREAM_DELAY_MS = parseInt(import.meta.env.VITE_STREAM_DELAY_MS, 10) || 200
const delay = ms => new Promise(r => setTimeout(r, ms))

/**
 * Fetch a stream of devices from the server. While streaming, the
 * function will call the provided callbacks for each device and chunk.
 * The stream can be aborted by calling the returned controller's abort method.
 * 
 * @param {function} onDevice Callback for each device object
 * @param {function} onComplete Callback when the stream is complete
 * @param {function} onChunk Callback for each chunk of devices
 * @returns {AbortController} Controller to abort the stream
 */
export function streamDevices(
  onDevice,
  onComplete,
  onChunk
) {
  const count = DEFAULT_COUNT

  const url = new URL('/api/devices/stream', BASE_URL)
  url.searchParams.set('count', count)
  const controller = new AbortController()

  fetch(url.toString(), { signal: controller.signal })
    .then(res => {
      if (!res.body) throw new Error('ReadableStream not supported')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      async function readChunk() {
        const { done, value } = await reader.read()
        if (done) {
          onComplete?.()
          return
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        const parsed = lines
          .filter(l => l.trim())
          .map(l => JSON.parse(l))

        parsed.forEach(onDevice)
        onChunk?.(parsed.length)

        await delay(STREAM_DELAY_MS)
        readChunk()
      }

      readChunk()
    })
    .catch(err => {
      if (err.name !== 'AbortError') console.error('stream error:', err)
      else onComplete?.()
    })

  return controller
}
