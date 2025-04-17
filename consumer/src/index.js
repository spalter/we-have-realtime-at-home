import fetch from 'node-fetch';
import { TextDecoder } from 'util';
import fs from 'fs';

const DEVICES_API_URL =
  process.env.DEVICES_API_URL || 'http://localhost:5000/api/devices/stream';
const DEVICES_COUNT = parseInt(process.env.DEVICES_COUNT, 10) || 5000;

/**
 * Fetches the NDJSON stream from the server, parses each line as it arrives,
 * and writes the raw NDJSON to a file (overwriting on each cycle).
 */
async function fetchDevices() {
  const logStream = fs.createWriteStream('device_log.ndjson', { flags: 'w' });

  try {
    let numberOfDevices = 0;
    const url = new URL(DEVICES_API_URL);
    url.searchParams.set('count', DEVICES_COUNT);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const decoder = new TextDecoder();
    let buffer = '';

    for await (const chunk of res.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        logStream.write(line + '\n');
        numberOfDevices++;
      }

      console.log(`Processed ${lines.length} devices in chunk`);
    }
    console.log(`Total devices processed: ${numberOfDevices}`);
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    logStream.end();
  }
}

/**
 * Orchestrator that waits 200 ms after fetchDevices() completes
 * and logs the delta (in seconds) since the last full update.
 */
async function startPolling() {
  let lastEnd = Date.now();

  while (true) {
    await fetchDevices();
    const now = Date.now();
    const deltaSec = ((now - lastEnd) / 1000).toFixed(2);
    console.log(`Delta since last full update: ${deltaSec}s`);

    lastEnd = now;
    await new Promise((resolve) => setTimeout(resolve, 200)); // We wait here in purpose, to make it easier to see the delta
  }
}

startPolling();
