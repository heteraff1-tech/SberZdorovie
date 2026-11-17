# Health · SCSS-дизайн-система

Источники: [макеты](https://www.figma.com/design/u0EdPHQOmvdQuc7158uN5C/Untitled?node-id=77-4755), [Health · Design System](https://www.figma.com/design/u0EdPHQOmvdQuc7158uN5C/Untitled?node-id=237-1893), [Health · Colors](https://www.figma.com/design/u0EdPHQOmvdQuc7158uN5C/Untitled?node-id=250-2290). В приложении: `/#design-system`.

## Токены

| Файл                      | Содержимое                                                                   |
| ------------------------- | ---------------------------------------------------------------------------- |
| `tokens/_palette.scss`    | Коллекция Health · Palette: исходные цвета и прозрачности                    |
| `tokens/_color.scss`      | Коллекция Health · Colors: базовые роли, контексты и состояния в Light/Dark  |
| `tokens/_markup.scss`     | Space, radius, size из Health · Dimensions; семантические padding/gap/radius |
| `tokens/_text-style.scss` | Именованные стили Health/*: семейство, размер, строка, вес и трекинг         |
| `tokens/_motion.scss`     | Длительности и easing сценариев                                              |
| `tokens/_effects.scss`    | Тени, размытия и толщины обводок                                             |
| `tokens/_preview.scss`    | Корпус превью, исходный тёмный онбординг и градиентная иллюстрация           |

Все файлы — SCSS. Sass maps читаются как обычные именованные значения, `@each` выпускает CSS custom properties. Компоненты используют переменные времени выполнения, поэтому темы работают без пересборки. В `_color.scss` сохранены ссылки на палитру из Figma; роли не подменены независимыми HEX-копиями.

Имена передают соглашения Variant и соответствие с Figma:

| Figma                      | SCSS / CSS                   |
| -------------------------- | ---------------------------- |
| `neutral/100`              | `--palette-neutral-100`      |
| `fg/default`               | `--foreground-default`       |
| `bg/surface2`              | `--background-surface2`      |
| `accent/default`           | `--accent-default`           |
| `control/primary/bg/hover` | `--control-primary-bg-hover` |
| `input/border/error`       | `--input-border-error`       |
| `chart/weight`             | `--chart-weight`             |
| `space/24`                 | `--space-24` = 24 px         |

Число в `space-24` означает значение в пикселях, как в Figma. Ролевые токены вроде `--padding-l` и `--border-radius-card` ссылаются на эту базу. Значения конкретных координат иллюстрации не превращены в общую шкалу отступов.

## Темы

Light — тема по умолчанию. `data-theme="light"` и `data-theme="dark"` задают полный набор семантических переменных на любом контейнере:

```vue
<section data-theme="dark">
  <UiButton>Сохранить</UiButton>
  <UiInput v-model="message" label="Сообщение" />
</section>
```

Страница дизайн-системы показывает оба контейнера одновременно. Она проверяет общие компоненты отдельно от `HomePage`; продуктовый переключатель темы в сценарий не добавлен.

## Типографика

В Figma есть расхождения между числовыми переменными `font/*` и именованными стилями `Health/*`: например, Caption 10/11 px, Small 510/400, семейство SF Pro/SB Sans. В коде используются именованные текстовые стили: именно они описывают применяемую типографику. Числовой дубликат со вторым значением не создаётся.

SB Sans Text и SB Sans Display находятся в `public/fonts`, а `@font-face` — в `base/_fonts.scss`. Для SF Pro используется системный стек платформы; отдельный файл Apple SF Pro в проект не добавлен.

Компонент применяет типографику через чистый mixin:

```scss
@use '../mixins/text';

.label {
  @include text.style('text-label');
  color: var(--foreground-default);
}
```

Mixin не выпускает глобальные объявления `:root` при каждом импорте. Для разметки также доступны классы `.heading-h1`, `.text-body`, `.text-caption`, `.display-metric` из `base/_typography.scss`.

Исходная композиция онбординга и большой заголовок помощника используют дополнительные display-размеры. Они названы явно и не меняют определения Health/Heading/H1–H4.

## Общие компоненты

- `UiButton`: primary / secondary / quiet / destructive, размеры, disabled, loading, hover, pressed, focus и selected. Цвета состояний читаются из `control/*`.
- `UiInput`: `v-model`, label, placeholder, disabled, readonly, error/warning/success. Цвета читаются из `input/*`.
- `UiIcon` и `UiIconButton`: именованные локальные пиктограммы и кнопки с доступной подписью. Монохромные SVG используются как маска с `currentColor`, поэтому наследуют цвет состояния контрола в обеих темах. Многоцветные ассеты сохраняют исходную графику. Размеры берутся из корня SVG.
- `UiMetricCard` и `UiMetricValue`: каркас показателя и собственная типографика числа, статуса, единицы.
- `UiDotScale`: параметризованная шкала с цветами `chart/glucose` и `chart/inactive`.
- `UiGlassCard`: общая стеклянная кнопка с эффектом и слотом.
- `UiBottomSheet`: панель, жест и события без продуктовых зависимостей.
- `UiPhoneFrame`: оболочка превью и масштабирование; её оформление изолировано от Health-палитры.

Новые варианты добавляются в соответствующий компонент и используют ролевые токены. Для нового экрана не нужно копировать HEX или переопределять внутренние селекторы контрола.

## Анимации

Длительности определены только в `_motion.scss`. CSS использует `var(--motion-…)`, а `readMotionDuration()` читает то же значение для JavaScript-таймеров. Изменение SCSS-токена синхронно меняет оба слоя. Пружинные коэффициенты остаются параметрами алгоритма в модели; они не являются длительностями или дизайн-токенами.

`prefers-reduced-motion` меняет длительности в одном месте. Правила, которые отключают сам эффект, остаются у владельца эффекта: например, параллакс и вращение SVG.
