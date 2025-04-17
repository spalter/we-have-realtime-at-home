# We have Realtime at Home

This project is a test to see how much we can do with a REST server based on Node.js that provides as much data as possible per request while not blocking the thread for file transfer sizes.

## Run the Simulation

### Development

> Don't forget to install the packges in the server and consumer directories first. You can do that with `cd <dir> && npm install`.

```bash
npm run dev
```

### With Podman

```bash
npm run podman:start
npm run podman:stop
```

### Stats

Checkout the consumer log e.g. from the podman output, there is the number of processed messages + the deltatime.

Example:

```log
Processed 53 devices in chunk
Processed 19 devices in chunk
Processed 29 devices in chunk
Processed 15 devices in chunk
Processed 39 devices in chunk
Processed 30 devices in chunk
Processed 10 devices in chunk
Processed 19 devices in chunk
Processed 24 devices in chunk
Processed 5 devices in chunk
Processed 77 devices in chunk
Total devices processed: 10000
Delta since last full update: 0.61s
```
