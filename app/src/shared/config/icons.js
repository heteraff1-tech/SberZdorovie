import { assets } from './assets';

// SVG root dimensions are preserved; monochrome glyphs inherit the control's color.
export const icons = {
  camera: { src: assets.camera, width: 18, height: 18 },
  plus: { src: assets.plus, width: 18, height: 18 },
  chevron: { src: assets.chevron, width: 18, height: 18 },
  file: { src: assets.file, width: 22, height: 22 },
  heart: { src: assets.heart, width: 76, height: 28 },
  sparkles: { src: assets.sparkles, width: 76, height: 28 },
  'at-sign': { src: assets.atSign, width: 16, height: 16 },
  document: { src: assets.document, width: 16, height: 16 },
  quote: { src: assets.quote, width: 16, height: 16 },
  more: { src: assets.more, width: 16, height: 16 },
  close: { src: assets.close, width: 24, height: 24 },
  assistant: { src: assets.assistant, width: 14, height: 14, multicolor: true },
  chat: { src: assets.chat, width: 19, height: 18 },
  cellular: { src: assets.cellular, width: 20, height: 13 },
  wifi: { src: assets.wifi, width: 18, height: 13 },
  battery: { src: assets.battery, width: 28, height: 13 },
  microphone: { src: assets.microphone, width: 12, height: 18 },
};
