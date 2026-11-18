// Статичные подписи карточек помощника, без действий и запросов.
export const assistantSuggestions = [
  {
    id: 'analyze-results',
    label: 'Помоги\nрасшифровать\nанализы',
    icons: ['at-sign', 'document', 'quote', 'more'],
  },
  {
    id: 'book-appointment',
    label: 'Записаться\nк врачу',
    centered: true,
  },
];

// Только эти явные варианты запускают локальное медицинское предупреждение.
export const healthcareSuggestions = [
  {
    id: 'pulse-dizziness',
    label: 'Высокий пульс и головокружение',
    symptoms: { highPulse: true, dizziness: true },
  },
  {
    id: 'pulse-discomfort',
    label: 'Высокий пульс и дискомфорт',
    symptoms: { highPulse: true, discomfort: true },
  },
];
