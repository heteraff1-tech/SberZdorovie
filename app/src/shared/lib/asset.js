// Формирует локальный адрес SVG с учётом базового пути сборки.
export function getSvg(name) {
  return `${import.meta.env.BASE_URL}svg/${name}.svg`;
}
