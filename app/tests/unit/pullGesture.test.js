import test from 'node:test';
import assert from 'node:assert/strict';
import { PullGesture } from '../../src/features/onboarding/model/PullGesture.js';

const pointer = (y, timeStamp, extra = {}) => ({
  pointerId: 1,
  isPrimary: true,
  button: 0,
  clientY: y,
  timeStamp,
  ...extra,
});

test('a short slow pull returns; a recent flick completes', () => {
  const gesture = new PullGesture();
  gesture.start(pointer(300, 0), 1, 0);
  assert.equal(gesture.end(pointer(260, 500)).complete, false);
  assert.equal(gesture.active, false);

  gesture.start(pointer(300, 1000), 1, 0);
  assert.equal(gesture.end(pointer(250, 1050)).complete, true);
});

test('stale velocity and cancelled pointers never finish onboarding', () => {
  const gesture = new PullGesture();
  gesture.start(pointer(300, 0), 1, 0);
  gesture.move(pointer(250, 30));
  assert.equal(gesture.end(pointer(250, 300)).complete, false);

  gesture.start(pointer(300, 400), 1, 0);
  assert.equal(gesture.end(pointer(0, 500), true).complete, false);
  assert.equal(gesture.start(pointer(300, 600, { isPrimary: false }), 1, 0), false);
});
