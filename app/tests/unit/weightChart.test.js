import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeightChart } from '../../src/features/health/model/weightChart.js';

test('the weight line changes with its measurements instead of using a static SVG snapshot', () => {
  const data = [
    { day: 'Пн', value: '77,1' },
    { day: 'Вт', value: '76,6' },
  ];
  const first = buildWeightChart(data);
  const updated = buildWeightChart([data[0], { ...data[1], value: '75,6' }]);

  assert.notEqual(first.line, updated.line);
  assert.equal(first.points[0].x, 7.5);
  assert.equal(first.points[1].x, 325.5);
  assert(updated.points[1].y > first.points[1].y);
  assert(first.area.endsWith('Z'));
  assert.deepEqual(data, [
    { day: 'Пн', value: '77,1' },
    { day: 'Вт', value: '76,6' },
  ]);
});

test('missing, invalid and out-of-range measurements never produce NaN geometry', () => {
  assert.deepEqual(buildWeightChart([]).points, []);
  assert.equal(buildWeightChart([{ value: '—' }]).line, '');
  assert.equal(buildWeightChart([{ value: 76 }], { min: 80, max: 70 }).line, '');
  const chart = buildWeightChart([{ value: 10 }, { value: 200 }]);
  assert.deepEqual(
    chart.points.map((point) => point.y),
    [58, 0],
  );
  assert(!chart.line.includes('NaN'));
});
