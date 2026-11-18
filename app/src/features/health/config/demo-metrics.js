// Presentation data from Figma. Replace this module with API data at integration.
export const healthData = Object.freeze({
  pressure: {
    systolic: 115,
    diastolic: 68,
    days: [
      { day: 'Пн', upper: null, lower: null },
      { day: 'Вт', upper: 54.545, lower: 42.545 },
      { day: 'Ср', upper: 45.818, lower: 27.273 },
      { day: 'Чт', upper: 55.636, lower: 33.818 },
      { day: 'Пт', upper: 40.364, lower: 28.364 },
      { day: 'Сб', upper: 55.636, lower: 30.545 },
      { day: 'Вс', upper: 40.364, lower: 30.545 },
    ],
  },
  glucose: { value: 8.1, scaleMax: 14.4, target: '5,5' },
  weight: {
    value: 76,
    days: [
      { day: 'Пн', value: '77,1', x: 7.5, y: 18 },
      { day: 'Вт', value: '76,6', x: 60.667, y: 25.914 },
      { day: 'Ср', value: '76,9', x: 113.834, y: 20.698 },
      { day: 'Чт', value: '75,6', x: 166.5, y: 42.102 },
      { day: 'Пт', value: '76,3', x: 219.667, y: 29.871 },
      { day: 'Сб', value: '76,1', x: 272.333, y: 32.929 },
      { day: 'Вс', value: '76,0', x: 325.5, y: 35.267 },
    ],
  },
});
