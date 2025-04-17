import express from 'express';

const router = express.Router();

/**
 * Generate an array of simulated IoT devices. To avoid DB costs and bottlenecks.
 * @param {number} count how many devices to simulate
 * @returns {Array<Object>} Array of simulated device objects
 */
function generateSimulatedDevices(count = 50) {
  const now = new Date().toISOString();
  const adjectives = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Echo',
    'Foxtrot',
    'Sierra',
    'Tango',
    'Victor',
    'Whiskey',
    'Zulu',
    'Yankee',
  ];
  const objects = [
    'PumpStation',
    'PressureRelay',
    'FlowController',
    'ValveArray',
    'MonitorUnit',
    'FlowSensor',
    'PressurePump',
    'ValveCluster',
    'HoseUnit',
    'ControlPanel',
    'FilterModule',
    'TempRegulator',
  ];

  return Array.from({ length: count }).map((_, i) => {
    const adj = adjectives[i % adjectives.length];
    const obj = objects[i % objects.length];
    const unique = String(100 + i);
    const lat = parseFloat((Math.random() * 180 - 90).toFixed(6));
    const long = parseFloat((Math.random() * 360 - 180).toFixed(6));
    const alt = parseFloat((Math.random() * 5000).toFixed(1));

    return {
      serialnumber: `SN${100000000000000 + i}`,
      name: `${adj}-${obj}-${unique}`,
      type: 'IoTDevice',
      team: `Team-${adj}`,
      current_psi: parseFloat((10 + Math.random() * 4000).toFixed(1)),
      last_update_time: now,
      location: { lat, long, alt },
      group: `${(100000 * Math.random()).toFixed(0)}`,
      alarms:
        Math.random() > 0.5
          ? [
            {
              date: now,
              type: ['overheat', 'low_pressure'][
                Math.floor(Math.random() * 2)
              ],
            },
          ]
          : [],
    };
  });
}

/**
 * GET /devices/stream
 * Simulate a stream of IoT devices.
 * @param {number} count Number of devices to simulate
 * @returns {Array<Object>} Array of simulated device objects in NDJSON format
 */
router.get('/devices/stream', (req, res) => {
  res.setHeader('Content-Type', 'application/x-ndjson');

  // ?count=NUM, default to 50
  const count = Math.min(parseInt(req.query.count, 10) || 5000, 50000);

  const devices = generateSimulatedDevices(count);
  devices.forEach((device) => {
    res.write(JSON.stringify(device) + '\n');
  });
  res.end();
});

export default router;
