# QA: временный мобильный просмотр

Дата: 18 ноября 2026 года. Ветка: `codex/app-structure`.

Режим `?mobile=1` включает изолированный временный адаптер без корпуса, искусственного статус-бара, выреза и HomeBar. Явное нажатие «На весь экран» вызывает Fullscreen API; при выходе кнопка возвращается. Обычный PhonePreview и код страниц не изменены.

## Результаты

| Проверка         | Результат    |
| ---------------- | ------------ |
| Unit             | 12 / 12 PASS |
| Production build | PASS         |
| Playwright       | 15 / 15 PASS |
| Форматирование   | PASS         |
| git diff --check | PASS         |

Полный npm run qa выполнен после последней правки кода с `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`, код завершения 0. Сохранены прежние проверки; добавлены четыре мобильных сценария с isMobile/hasTouch и сенсорными нажатиями: 393×873, 412×915, уменьшение высоты до 700, fullscreen и онбординг. Проверены шторa, навигация, прокрутка нижних карточек, ошибки JS/консоли и горизонтальное переполнение. Главная и помощник просмотрены без рамки во fullscreen Chromium.

Первый прогон обнаружил недоступную кнопку онбординга на низком viewport: базовые стили имели больший приоритет. Исправлена изоляция адаптера на поверхности превью. Сенсорная проверка прокрутки ожидает завершения открытия шторы и пересчёта ResizeObserver, без фиксированных задержек.

## Изменённые файлы

```text
README.md
app/docs/functions.md
app/docs/qa-report.md
app/docs/temporary-mobile.md
app/index.html
app/src/App.vue
app/src/components/temporary-mobile/TemporaryMobilePreview.vue
app/src/components/temporary-mobile/useMobilePreview.js
app/tests/e2e/mobilePreview.spec.js
```

Инструкция включения и удаления: [temporary-mobile.md](temporary-mobile.md). Проверка выполнена в Chromium, на физическом Xiaomi 14T не проводилась. Полноэкранный запрос зависит от поддержки и разрешений браузера; без него остаётся режим без рамки. Результат GitHub Actions отображается отдельно у коммита.
