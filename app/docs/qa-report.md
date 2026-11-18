# Итоговый отчёт QA: помощник и переходы

Проверка: 18 ноября 2026 года, ветка `codex/app-structure`.

## Изменения

- По запросу пользователя удалены кнопки выбора симптомов, медицинский ответ в UI, AssistantContent и неиспользуемый useAssistantSafety. Изолированное правило HC-001 и его unit-тесты сохранены для будущей интеграции; команды в интерфейсе отсутствуют.
- Крестик использует UiIconButton и событие close. HomePage возвращает показатели и фокус.
- Заголовок постоянно находится в DOM: положение, размер, межстрочный и межбуквенный интервал плавно меняются в обе стороны. Метка помощника также меняет положение плавно.
- Браузерные проверки удалённого UI заменены регрессией для текущего поведения: отсутствие команд, крестик, промежуточные значения анимации, сохранение DOM-узла и фокус. Датчики ошибок и reduced motion сохранены.

## Результаты

| Проверка         | Результат    |
| ---------------- | ------------ |
| Unit             | 12 / 12 PASS |
| Production build | PASS         |
| Playwright       | 11 / 11 PASS |
| Форматирование   | PASS         |
| git diff --check | PASS         |
| AGENTS.md        | 89 строк     |

Полный `npm run qa` выполнен после последней правки кода с `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`, код завершения 0. Отдельно пройден `npm run format:check`. Проверены 375×812, 360×740, console.error/pageerror, отсутствие горизонтального переполнения, переключение reduced motion, анимации онбординга и пульса, сохранение состояния графиков. Открытый и закрытый экраны просмотрены в Chromium.

## Изменённые файлы

```text
AGENTS.md
README.md
app/docs/architecture.md
app/docs/functions.md
app/docs/qa-report.md
app/src/features/assistant/config/suggestions.js
app/src/features/assistant/index.js
app/src/features/assistant/model/useAssistantSafety.js
app/src/features/assistant/ui/AssistantContent.vue
app/src/features/assistant/ui/AssistantHeader.vue
app/src/pages/home/HomePage.vue
app/tests/e2e/experience.spec.js
```

Этот отчёт относится к локальному прогону в Chromium; результат GitHub Actions отображается отдельно у коммита. Ввод, файлы, голос и история помощника остаются статичными.
