import * as fs from 'fs';
import * as path from 'path';

test('CSV file should not be empty', () => {
  const filePath = path.join(__dirname, '../resources/cells.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  expect(content.trim().length).toBeGreaterThan(0);
});
