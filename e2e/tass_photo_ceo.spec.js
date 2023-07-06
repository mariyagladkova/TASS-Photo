const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';
const Fakerator = require("fakerator");
import { faker } from '@faker-js/faker/locale/ru';
import generatePassword from "omgopass";

const fakerator = Fakerator("ru-RU");

const idealPassword = generatePassword({
    syllablesCount: 4,
    minSyllableLength: 3
});
console.log(idealPassword);

const lastName = fakerator.names.lastNameM();
const firstName = fakerator.names.firstNameM();
const name = lastName + " " + firstName;
console.log(name);

const email = faker.internet.email();
console.log(email);

const userName = faker.internet.userName();
console.log(userName);

const siteAccess = 'Тест 290822';

test('ceo editor - sign-up and sign-in', async ({ page, context }) => {
    test.setTimeout(80000);

    // Авторизация 
    const TassPhotoLP = new tassPhotoLoginPage(page);
    await TassPhotoLP.goto();
    await TassPhotoLP.login();

    // Выбор раздела "Пользователи"
    await page.getByRole('link').getByText('Пользователи').click();
    // Создание нового пользователя
    await page.locator('div.title  div:nth-child(1) div.title__icon-wrapper svg use').click();
    await page.waitForLoadState();

    // Поле "ФИО"
    await page.locator('div.modal_active textarea#name').first().type(name, {delay: 100});
    // Поле "Электронная почта"
    await page.locator('div.modal_active input#eemail').type(email, {delay: 100});
    // Поле "Логин"
    await page.locator('div.modal_active textarea#login_').type(userName, {delay: 100});

    // Статус "Активен"
    await page.locator('div.modal_active label.radio-group__label:nth-child(1) div.radio-group__button').click();

    // Роль
    await page.locator('div.multiselect__select').click();
    // Выбор роли - "CEO-редактор"
    await page.locator('ul.multiselect__content li.multiselect__element:nth-child(8)').click();

    // Кнопка "Добавить" (доступные сайты)
    await page.locator('a.link_add').click();
    // Выбор сайта из списка (1 можно поменять на другое число)
    await page.locator('section.select-popup li.select-popup__item:nth-child(1) div.checkbox__view').click();
    // Кнопка "Добавить" сайт
    await page.locator('button:text("Добавить")').click();

    // Пароль 
    await page.locator('div.modal_active input#password_').type(idealPassword, {delay: 100});

    //await page.pause();

    await page.locator('a.modal__header-action').click();

    // Ожидание загрузки страницы 
    await page.waitForURL('**/users');

    await page.getByRole('link').getByText('Выйти').click();
    // await page.locator('div.header__block a.header__account:nth-child(2)').click();
    await page.waitForLoadState();

    // Поле "Имя пользователя"
    await page.locator('input#email').type(userName, {delay: 100});
    // Поле "Пароль"
    await page.locator('input[name="password"]').type(idealPassword, {delay: 100});
    // Кнопка "Войти"
    await page.locator('button[type="submit"]').click();

    await page.waitForLoadState();

    // Проверка на то, что сайт отображается у редактора
    //const number = page.locator('li.filter__item:nth-child(1) div.filter__count');
    //await expect(number).toHaveValue(/1/);
    const number = await page.locator('li.filter__item:nth-child(1) div.filter__count').textContent();
    console.log(number);

    await page.locator('tr.list-white__published:nth-child(2) td.events_auto:nth-child(4) a').click();
    const siteName = await page.locator('a.header__name_dropdown').textContent();
    const siteName2 = siteName.replace(/\n/g, ' ');
    console.log(siteName2);
});
