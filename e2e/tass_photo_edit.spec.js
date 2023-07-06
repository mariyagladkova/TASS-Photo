const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';
const Fakerator = require("fakerator");
import { faker } from '@faker-js/faker/locale/ru';
import generatePassword from "omgopass";

const fakerator = Fakerator("ru-RU");

const shortPassword = fakerator.internet.password(5);
console.log(shortPassword);

const simplePassword = generatePassword({
    syllablesCount: 4,
    minSyllableLength: 3,
    titlecased: false,
    hasNumbers: false
});
console.log(simplePassword);

const idealPassword = generatePassword({
    syllablesCount: 4,
    minSyllableLength: 3
});
console.log(idealPassword);

const siteAccess = 'Тест 290822';

test('profile edit and sign-in', async ({ page, context }) => {
    test.setTimeout(100000);

    // Авторизация 
    const TassPhotoLP = new tassPhotoLoginPage(page);
    await TassPhotoLP.goto();
    await TassPhotoLP.login();

    // Выбор раздела "Пользователи"
    await page.getByRole('link').getByText('Пользователи').click();

    // Сортировка по активности
    await page.locator('a.list-white__sorting_bottom').click();

    // Копирование адреса электронной почты пользователя
    const email = await page.locator('table tr:nth-child(2) td:nth-child(4)').textContent();
    console.log(email);

    // Выбор пользователя
    await page.locator('table tr:nth-child(2) td:nth-child(3) a:nth-child(1)').click();

    // Копирование названия сайта, к которому предоставлен доступ
    const siteName = await page.locator('li.modal__sites-item span:nth-child(1)').textContent();
    const siteName2 = siteName.replace(/\n/g, ' ');
    console.log(siteName2);

    // Пароль меньше 10 символов
    await page.locator('div.modal_active input#password_').type(shortPassword, {delay: 100});
    // Кнопка "Создать"
    await page.locator('a.modal__header-action').click();
    // Проверка появления ошибки
    const firstError = page.locator('div.site__notify-message span');
    await expect(firstError).toHaveText('Пароль слишком короткий. Используйте хотя бы 10 символов');

    // Пароль слишком простой
    await page.locator('div.modal_active input#password_').clear();
    await page.locator('div.modal_active input#password_').type(simplePassword, {delay: 100});
    // Кнопка "Создать"
    await page.locator('a.modal__header-action').click();
    // Проверка появления ошибки
    const secondError = page.locator('div.site__notify-message span');
    await expect(secondError).toHaveText('Пароль слишком простой. Используйте большие и маленькие латинский буквы, добавьте цифры');

    // Пароль идеален
    await page.locator('div.modal_active input#password_').clear();
    await page.locator('div.modal_active input#password_').type(idealPassword, {delay: 100});
    await page.locator('a.modal__header-action').click();
    await page.locator('div.modal_active a.modal__header-cancel').click();

    // Выбор раздела "Сайты"
    await page.locator('ul li.header__menu-item:nth-child(1)').click();

    // Выбор сайта, к которому открыт доступ
    // Фильтр по названию, ID
    await page.locator('tr:nth-child(1) th:nth-child(4) div.list-white__cell-wrapper a:nth-child(1) span').click();
    // Ввод названия в поисковое поле
    await page.locator('div.input-wrapper input[type="search"]').type(siteName2, {delay: 100});
    // Кнопка "Готово"
    await page.getByRole('button').getByText('Готово').click();

    // Открытие новой вкладки
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        // Переход по ссылке на сайт
        await page.locator('td.events_auto:nth-child(7) a').click(),
    ]);
    await newPage.waitForLoadState();
    // Принятие соглашения об обработке персональных данных
    await newPage.locator('button.cookie-modal__all-cookies-button').click();

    // Выбор русского языка
    await newPage.locator('div.page div.header__burger-open use').click();
    await newPage.locator('a.burger__language-link').click();
    await newPage.locator('li.burger__item a[href="/"]').click();
    await newPage.waitForLoadState();

    // Открытие бургер-меню
    await newPage.locator('div.page div.header__burger-open use').click();
    // Кнопка "Войти"
    await newPage.locator('a.burger__login-link').click();
    // Поле "Почта"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="email"]').type(email, {delay: 100});
    // Поле "Пароль"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type(idealPassword, {delay: 100});
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    await newPage.waitForURL('**/?lk=open');

    const profile = newPage.locator('div.burger_active div.burger__head a div.burger__account-email');
    await expect(profile).toHaveText(email);
});
