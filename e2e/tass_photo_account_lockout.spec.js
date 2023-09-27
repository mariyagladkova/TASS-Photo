const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "280722";

let i = 0;

test('account lockout', async ({ page, context }) => {
    test.setTimeout(80000);

    // Авторизация 
    const TassPhotoLP = new tassPhotoLoginPage(page);
    await TassPhotoLP.goto();
    await TassPhotoLP.login();

    // Выбор фотохостинга
    // Фильтр по названию, ID
    await page.locator('tr:nth-child(1) th:nth-child(4) div.list-white__cell-wrapper a:nth-child(1) span').click();
    // Ввод названия в поисковое поле
    await page.locator('div.input-wrapper input[type="search"]').type(siteName, { delay: 100 });
    // Кнопка "Готово"
    await page.getByRole('button').getByText('Готово').click();

    // Открытие новой вкладки
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        // Переход по ссылке на сайт
        await page.locator('td.events_auto:nth-child(7) a').first().click(),
    ]);
    await newPage.waitForLoadState();

    // Выбор русского языка
    await newPage.locator('div.page div.header__burger-open use').click();
    await newPage.locator('a.burger__language-link').click();
    await newPage.locator('li.burger__item a[href="/"]').click();
    await newPage.waitForLoadState();

    // Принятие соглашения об обработке персональных данных
    await newPage.locator('button.cookie-modal__all-cookies-button').click();

    // Открытие бургер-меню
    await newPage.locator('div.page div.header__burger-open use').click();
    // Кнопка "Войти"
    await newPage.locator('a.burger__login-link').click();

    // Авторизация. Поле "Почта"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="email"]').type('mariya.gladkova@nutnet.ru', { delay: 100 });
    // Поле "Пароль" - ввод неверного пароля (первая попытка)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123456', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    // Уведомление об ошибке
    const error = newPage.locator('span.validate__input-error-text-line');
    await expect(error).toBeVisible();

    while (i < 6) {
    // Поле "Пароль" - ввод неверного пароля (ещё шесть раз)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').clear();
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123456', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();
    i++;
      };
    
    const error2 = newPage.locator('span.validate__input-error-text-line');
    await expect(error2).toContainText("Неверное имя пользователя или пароль. У вас осталось 3 попытки");

    // Поле "Пароль" - ввод неверного пароля (восьмая попытка)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').clear();
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123456', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    const error3 = newPage.locator('span.validate__input-error-text-line');
    await expect(error3).toContainText("Неверное имя пользователя или пароль. У вас осталось 2 попытки");

    // Поле "Пароль" - ввод неверного пароля (девятая попытка)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').clear();
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123456', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    const error4 = newPage.locator('span.validate__input-error-text-line');
    await expect(error4).toContainText("Неверное имя пользователя или пароль. У вас осталось 1 попытка");

    // Поле "Пароль" - ввод неверного пароля (десятая попытка)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').clear();
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123456', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    const error5 = newPage.locator('span.validate__input-error-text-line');
    await expect(error5).toContainText("Неверное имя пользователя или пароль. Ваша учетная запись заблокирована на 30 минут");

    // Поле "Пароль" - ввод верного пароля (десятая попытка)
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').clear();
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123Koo456!', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    const error6 = newPage.locator('span.validate__input-error-text-line');
    await expect(error6).toContainText("Лимит попыток входа превышен. Учетная запись была заблокирована на 30 минут");

});
