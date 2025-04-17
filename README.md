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

```log

```
