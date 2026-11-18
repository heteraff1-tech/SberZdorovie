# SberZdorovie

Фронтенд по макетам Figma: онбординг, показатели здоровья, обзор пульса и статический экран помощника. Vue 3, Vite и SCSS. Структура основана на [Variant/app-new](https://github.com/heteraff1-tech/Variant/tree/main/app-new).

## Структура репозитория

```text
SberZdorovie/
├── README.md
└── app/                         # Весь фронтенд
    ├── package.json             # Зависимости и команды
    ├── vite.config.js           # Сборка и алиас @ → src
    ├── playwright.config.js     # Браузерные проверки
    ├── public/
    │   ├── fonts/               # Локальные шрифты
    │   ├── icons/               # Отдельные пиктограммы
    │   ├── images/              # Иллюстрации и фон
    │   └── svg/                 # Графика исходного онбординга
    ├── src/
    │   ├── App.vue              # Выбор начального экрана
    │   ├── main.js              # Запуск Vue и общих стилей
    │   ├── pages/               # Сборка экранов из features
    │   ├── components/
    │   │   └── PhonePreview.vue # Корпус телефона и масштабирование
    │   ├── features/
    │   │   ├── onboarding/      # Этапы онбординга и SVG-анимация
    │   │   ├── health/          # Показатели, графики, обзор пульса
    │   │   └── assistant/       # Статичная композиция помощника
    │   ├── shared/
    │   │   ├── ui/              # Общие кнопки, иконки, штора, навигация
    │   │   ├── composables/     # Общие жесты и подписки браузера
    │   │   ├── config/          # Именованные адреса ассетов
    │   │   └── lib/             # Небольшие общие функции
    │   └── assets/styles/
    │       ├── main.scss        # Единственная точка подключения основ
    │       ├── fonts.scss       # @font-face
    │       └── tokens/
    │           ├── color.scss
    │           ├── markup.scss
    │           └── text-style.scss
    ├── tests/
    │   ├── unit/                # Жесты, токены и геометрия графиков
    │   └── e2e/                 # Переходы и поведение в браузере
    └── docs/                    # Архитектура, функции и данные Figma
```

Серверная часть будет добавлена отдельно в корень репозитория. Сейчас запросов к API нет.

## Запуск

Нужен Node.js 22.12 или новее. Команды выполняются из `app/`. В PowerShell:

```powershell
cd app
npm.cmd ci
npm.cmd run dev -- --host 0.0.0.0
```

На macOS/Linux используется `npm` вместо `npm.cmd`. Для телефона в той же Wi-Fi сети открой адрес `Network`, который выведет Vite.

Адреса просмотра:

| Адрес         | Экран                               |
| ------------- | ----------------------------------- |
| `/`           | Онбординг с переходом к показателям |
| `/#home`      | Показатели здоровья                 |
| `/#pulse`     | Раскрытый обзор пульса              |
| `/#assistant` | Статический помощник                |

```powershell
npm.cmd run build
npm.cmd run preview -- --host 0.0.0.0
```

## Как устроен код

- **Страницы** размещают блоки и связывают события. `HomePage` управляет фокусом и нижней навигацией.
- **`features/*/model`** содержит состояние, сценарии и расчёт данных. Здесь нет разметки экранов.
- **`features/*/ui`** отображает данные через props и сообщает о действиях через events.
- **`features/*/config`** содержит демонстрационные измерения и статичные подписи.
- **`features/*/lib`** содержит специализированный SVG-рендерер онбординга.
- **`shared/ui`** содержит общие контролы. Медицинские карточки находятся в `features/health/ui`.
- **Стили компонента** находятся в его `<style scoped lang="scss">`. Общие токены подключаются один раз в `main.scss`.

Функции имеют короткие комментарии у объявления. Полный указатель с назначением и входными данными находится в [docs/functions.md](app/docs/functions.md).

## Основные функции

| Функция / класс                                                             | Назначение                                                            |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [useHealthScreen](app/src/features/health/model/useHealthScreen.js)         | Переключает показатели, пульс и помощника; запускает графики один раз |
| [usePulseHistory](app/src/features/health/model/usePulseHistory.js)         | Рассчитывает точки истории, интервалы активности и подписи периода    |
| [buildWeightChart](app/src/features/health/model/weightChart.js)            | Превращает измерения веса в точки и SVG-пути                          |
| [useGlucoseScale](app/src/features/health/model/useGlucoseScale.js)         | Форматирует значение глюкозы и считает заполнение шкалы               |
| [useOnboardingFlow](app/src/features/onboarding/model/useOnboardingFlow.js) | Связывает этапы онбординга с жестом и Vue                             |
| [OnboardingFlow](app/src/features/onboarding/model/OnboardingFlow.js)       | Выполняет переходы и пружинную анимацию                               |
| [PullGesture](app/src/features/onboarding/model/PullGesture.js)             | Вычисляет расстояние, скорость и результат свайпа                     |
| [PulseShape](app/src/features/onboarding/lib/PulseShape.js)                 | Изменяет геометрию существующего SVG                                  |
| [useSwipeDismiss](app/src/shared/composables/useSwipeDismiss.js)            | Обрабатывает сворачивание шторы                                       |
| [readMotionDuration](app/src/shared/lib/motion.js)                          | Читает длительность из локального CSS экрана                          |

## Текущее поведение

Карточка пульса раскрывает ту же штору на весь экран. Назад и Escape возвращают показатели и фокус. Графики сохраняют состояние. Свет в иллюстрации пульса проходит слева направо, сердце слегка сокращается у центра; цикл длится две секунды.

Внутренние элементы помощника статичны: поля ввода, отправки, выбора файлов, голосового ввода и истории сообщений нет. Значок вложения собран HTML/CSS. Композиция не следует за курсором. Переход к помощнику и возврат через нижнюю навигацию сохранены.

Демонстрационные данные находятся в `features/health/config`. При подключении API меняется источник данных в модели; компоненты получают значения через props. Apple Health, камера, добавление замера и PDF пока не подключены.

## Дизайн-система

[Актуальные макеты](https://www.figma.com/design/u0EdPHQOmvdQuc7158uN5C/Untitled?node-id=77-4755) и [переменные Figma](https://www.figma.com/design/u0EdPHQOmvdQuc7158uN5C/Untitled?node-id=250-2290) — источник цветов, скруглений и размеров текста.

В [color.scss](app/src/assets/styles/tokens/color.scss) записаны значения Light/Dark и имена из текущей Figma. [markup.scss](app/src/assets/styles/tokens/markup.scss) содержит общую шкалу и алиасы назначения по примеру `app-new`. [text-style.scss](app/src/assets/styles/tokens/text-style.scss) содержит размеры текста и готовые текстовые классы. Генераторов и Sass-карт токенов нет.

Параметры конкретных анимаций хранятся у их компонентов. Длительности онбординга определены в корне `OnboardingFlow.vue`; JavaScript читает их через `readMotionDuration`. При `prefers-reduced-motion: reduce` сложное движение отключается.

Подробнее: [архитектура](app/docs/architecture.md), [токены](app/docs/design-system.md), [снимок переменных](app/docs/figma-tokens.json).

## Проверки

Из `app/`:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run format:check
npm.cmd run test:e2e
```

Для браузерных тестов один раз установи Chromium: `npx.cmd playwright install chromium`. Если Chromium уже установлен, можно указать его путь переменной `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Форматирование всего фронтенда и корневого README: `npm.cmd run format`.
