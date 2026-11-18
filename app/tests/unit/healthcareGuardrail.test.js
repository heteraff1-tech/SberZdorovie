import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssistantResponse } from '../../src/features/assistant/model/healthcareGuardrail.js';

test('HC-001 escalates high pulse with either dizziness or discomfort without diagnosing', () => {
  for (const extra of ['dizziness', 'discomfort']) {
    const response = getAssistantResponse({ highPulse: true, [extra]: true });
    assert.equal(response.ruleId, 'HC-001');
    assert.match(response.disclaimer, /не диагноз.*не заменяет врача/);
    assert.match(response.urgent, /103 или 112/);
    assert.equal(response.action.href, 'tel:103');
    assert(!('diagnosis' in response));
    assert(!('treatment' in response));
    assert.doesNotMatch(JSON.stringify(response), /у вас тахикардия|примите|назначаю|диагноз:/i);
  }
});

test('HC-001 requires the symptom combination and explicit boolean values', () => {
  for (const symptoms of [
    undefined,
    null,
    {},
    { highPulse: true },
    { dizziness: true },
    { discomfort: true },
    { highPulse: 'false', dizziness: true },
  ]) {
    assert.equal(getAssistantResponse(symptoms), null);
  }
});
