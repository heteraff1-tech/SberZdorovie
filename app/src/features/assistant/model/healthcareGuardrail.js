const warning = Object.freeze({
  ruleId: 'HC-001',
  kind: 'medical-warning',
  title: 'Нужна оценка врача',
  disclaimer:
    'Это не диагноз. Ассистент не заменяет врача и не может определить причину симптомов.',
  message:
    'Высокий пульс вместе с головокружением или дискомфортом требует оценки врача. Не откладывайте обращение за медицинской помощью.',
  urgent:
    'Если есть боль в груди, одышка, обморок или состояние ухудшается, сразу звоните 103 или 112.',
  contact: 'Кнопка откроет звонок в скорую медицинскую помощь по номеру 103.',
  action: Object.freeze({ label: 'Обратиться к врачу', href: 'tel:103' }),
});

/** HC-001: возвращает предупреждение при сочетании симптомов, без диагноза и лечения. */
export function getAssistantResponse(symptoms) {
  return symptoms?.highPulse === true &&
    (symptoms.discomfort === true || symptoms.dizziness === true)
    ? warning
    : null;
}
