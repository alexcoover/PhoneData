// IMPORTANT -> remove .js from filepath before testing, replace after.
import { Cell } from '../out/cell.js';

describe('Cell class - Xiaomi Mi Max 4 data', () => {
  it('correctly transforms and types Xiaomi Mi Max 4 data', () => {
    const raw = {
      oem: 'Xiaomi',
      model: 'Mi Max 4',
      launch_announced: null,
      launch_status: 'Cancelled',
      launch_date: null,
      body_dimensions: null,
      body_weight: "-", // check hyphen
      body_sim: 'Hybrid Dual SIM (Nano-SIM, dual stand-by)',
      display_type: 'IPS LCD capacitive touchscreen, 16M colors',
      display_size: '7.2 ',
      display_resolution: '1080 x 2310 pixels (~354 ppi density)',
      features_sensors: 'Fingerprint (rear-mounted), accelerometer, gyro, proximity, compass',
      platform_os: 'Android 9.0 (Pie)',
    };

    const cell = new Cell(raw);

    // Check strings and nulls
    expect(cell.getOEM()).toBe('Xiaomi');
    expect(cell.getModel()).toBe('Mi Max 4');
    expect(cell.getLaunchAnnounced()).toBeNull();
    expect(cell.getLaunchStatus()).toBe('Cancelled');
    expect(cell.getLaunchDate()).toBeNull();
    expect(cell.getBodyDimensions()).toBeNull();
    expect(cell.getBodyWeight()).toBeNull();
    expect(cell.getBodySim()).toBe('Hybrid Dual SIM (Nano-SIM, dual stand-by)');
    expect(cell.getDisplayType()).toBe('IPS LCD capacitive touchscreen, 16M colors');
    expect(cell.getDisplayResolution()).toBe('1080 x 2310 pixels (~354 ppi density)');
    expect(cell.getFeaturesSensors()).toBe('Fingerprint (rear-mounted), accelerometer, gyro, proximity, compass');

    // Check numbers
    expect(cell.getDisplaySize()).toBeCloseTo(7.2);  // float number check
    expect(cell.getFeatureCount()).toBe(5);

    // Check platform OS parsed as "Android 9.0"
    expect(cell.getPlatformOs()).toBe('Android 9.0 (Pie)');
  });
});
