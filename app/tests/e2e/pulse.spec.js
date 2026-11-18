import { test, expect, expectNoHorizontalOverflow } from './fixtures';

test('pulse widget expands the same sheet, synchronizes its two-second loop and restores focus', async ({
  page,
}) => {
  await page.goto('/#home');
  await page.waitForTimeout(2300);
  const sheet = page.locator('.ui-bottom-sheet');
  const initial = await sheet.boundingBox();
  const pressure = page.locator('.pressure-bars i').first();
  const chartStart = await pressure.evaluate((el) => el.getAnimations()[0].startTime);
  const trigger = page.getByRole('button', { name: 'Открыть пульс', exact: true });
  await trigger.click();
  const overview = page.getByRole('region', { name: 'Пульс — обзор' });
  await expect(overview).toBeVisible();
  await expect(sheet).toHaveCSS('height', '874px');
  await expect(page.locator('.pulse-history__plot')).toHaveCSS('height', '66px');
  await expect(page.locator('.pulse-history__selection')).toHaveCSS('height', '34px');
  const screen = await page.locator('.screen').boundingBox();
  const expanded = await sheet.boundingBox();
  expect(expanded.y).toBeCloseTo(screen.y, 1);
  expect(expanded.height).toBeCloseTo(screen.height, 1);
  expect(initial.y - expanded.y).toBeGreaterThan(200);
  await expect(page.locator('.home-page__dashboard')).toHaveAttribute('inert', '');
  await expect(
    page.getByRole('button', { name: 'Вернуться к показателям здоровья', exact: true }),
  ).toBeFocused();

  const clock = await page.locator('.pulse-heart').evaluate((el) =>
    el.getAnimations({ subtree: true }).map((animation) => ({
      duration: animation.effect.getTiming().duration,
      iterations: animation.effect.getTiming().iterations === Infinity,
      startTime: animation.startTime,
    })),
  );
  expect(clock).toHaveLength(2);
  expect(clock.every((animation) => animation.duration === 2000 && animation.iterations)).toBe(
    true,
  );
  expect(clock[0].startTime).toBe(clock[1].startTime);
  const phase = async (time) =>
    page.locator('.pulse-heart').evaluate((el, currentTime) => {
      el.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = currentTime;
      });
      const heart = getComputedStyle(el.querySelector('.pulse-heart__heart'));
      const light = getComputedStyle(el.querySelector('.pulse-heart__light'));
      return {
        scale: new DOMMatrix(heart.transform).a,
        lightX: parseFloat(light.backgroundPositionX),
      };
    }, time);
  const left = await phase(200);
  const impact = await phase(920);
  const right = await phase(1600);
  const repeated = await phase(2920);
  expect(left.lightX).toBeLessThan(impact.lightX);
  expect(impact.lightX).toBeLessThan(right.lightX);
  expect(impact.scale).toBeGreaterThan(1.03);
  expect(left.scale).toBeCloseTo(1);
  expect(right.scale).toBeCloseTo(1);
  expect(repeated).toEqual(impact);

  await page.getByRole('button', { name: '16:40 — 67 уд/мин' }).click();
  await expect(page.locator('.pulse-history__selection')).toContainText('16:40 · 67 уд/мин');
  await page.getByRole('button', { name: 'Неделя', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Неделя', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCSS('height', '642px');
  await expect(trigger).toBeFocused();
  expect(await pressure.evaluate((el) => el.getAnimations()[0].startTime)).toBe(chartStart);

  await trigger.click();
  await page.getByRole('button', { name: 'Обсудить с терапевтом онлайн' }).click();
  await expect(overview).toHaveCount(0);
  await expect(page.locator('.assistant-composer')).toContainText('Введите сообщение');
  await expect(page.locator('.assistant-composer input')).toHaveCount(0);
});

for (const viewport of [
  { width: 360, height: 740 },
  { width: 375, height: 812 },
]) {
  test(`pulse overview ${viewport.width}×${viewport.height}: fits, scrolls and honors live reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const failures = [];
    page.on('requestfailed', (request) => failures.push(request.url()));
    await page.route('**/*', (route) =>
      route.request().url().startsWith('http://localhost:4173') ? route.continue() : route.abort(),
    );
    await page.goto('/#pulse');
    await expectNoHorizontalOverflow(page);
    await expect(page.locator('.pulse-heart')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.locator('.ui-bottom-sheet')).toHaveCSS('height', '874px');
    await expect(page.locator('.pulse-heart__heart')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.pulse-heart__light')).toHaveCSS('display', 'none');
    expect(
      await page.locator('.pulse-overview').evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.locator('.pulse-overview').evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const report = await page.locator('.pulse-overview__report').boundingBox();
    const nav = await page.getByRole('navigation', { name: 'Основная навигация' }).boundingBox();
    expect(report.y + report.height).toBeLessThanOrEqual(nav.y);
    expect(
      await page
        .locator('.pulse-heart img')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
    ).toBe(true);
    expect(failures).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('.pulse-heart')).toHaveAttribute('data-reduced-motion', 'false');
    await expect(page.locator('.pulse-heart__heart')).toHaveCSS('animation-name', /heartbeat/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.pulse-heart__heart')).toHaveCSS('animation-name', 'none');
  });
}
