import assets from '@/shared/config/design-assets.json'

export function designAsset(name) {
  return `${import.meta.env.BASE_URL}${assets[name]}`
}
