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

const lastName = fakerator.names.lastNameM();
const firstName = fakerator.names.firstNameM();
const name = lastName + " " + firstName;
console.log(name);

const email = faker.internet.email();
console.log(email);

const userName = faker.internet.userName();
console.log(userName);

const siteAccess = 'Тест 290822';

test('sign-up and sign-in', async ({ page, context }) => {
  test.setTimeout(100000);

  // Авторизация 
  const TassPhotoLP = new tassPhotoLoginPage(page);
  await TassPhotoLP.goto();
  await TassPhotoLP.login();

  // Выбор раздела "Пользователи"
  await page.getByRole('link').getByText('Пользователи').click();
  // Создание нового пользователя
  await page.locator('div.title  div:nth-child(1) div.title__icon-wrapper svg use').click();

  // Поле "ФИО"
  await page.locator('div.modal_active textarea#name').first().type(name, {delay: 100});
  // Поле "Электронная почта"
  await page.locator('div.modal_active input#eemail').type(email), {delay: 100};
  // Поле "Логин"
  await page.locator('div.modal_active textarea#login_').type(userName, {delay: 100});

  // Статус "Активен"
  await page.locator('div.modal_active label.radio-group__label:nth-child(1) div.radio-group__button').click();

  // Роль
  await page.locator('div.multiselect__select').click();
  // Выбор роли - "Пользователь"
  await page.locator('ul.multiselect__content li.multiselect__element:nth-child(6)').click();

  // Кнопка "Добавить" (доступные сайты)
  await page.locator('a.link_add').click();
  // Выбор сайта по поисковому значению
  await page.locator('form:nth-child(2) div section.select-popup input[type="search"]').type(siteAccess, {delay: 100});
  await page.locator('form:nth-child(2) div section.select-popup div.checkbox__view').click();
  // Выбор сайта из списка (1 можно поменять на другое число)
  //await page.locator('section.select-popup li.select-popup__item:nth-child(1) div.checkbox__view').click();
  // Кнопка "Добавить" сайт
  await page.locator('button:text("Добавить")').click();

  // Копирование названия сайта
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
  await page.pause();
  await page.locator('a.modal__header-action').click();

  // Ожидание загрузки страницы 
  await page.waitForURL('**/users');

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
