import { assets } from './assets';

// SVG root dimensions are preserved; monochrome glyphs inherit the control's color.
export const icons = {
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
  attachment: { src: assets.attachment, width: 54, height: 54, multicolor: true },
  microphone: { src: assets.microphone, width: 12, height: 18 },
};
