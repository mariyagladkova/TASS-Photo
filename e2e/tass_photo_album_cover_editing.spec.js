const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "Автоматизация";

let newID = '';

let src = '';

test('album cover editing', async ({ page, context }) => {
    test.setTimeout(100000);
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
    await page.getByRole('link').getByText(siteName).click();

    // Копирование ID альбома
    let ID = await page.locator('tr:nth-child(2) td:nth-child(4) small').textContent();
    newID = ID.replace(/\D/g, "");
    console.log(newID);

    // Редактирование альбома
    await page.locator('td div.dropdown__wrapper').first().hover();
    await page.getByRole('link', { name: 'Редактировать...' }).click();

    // Смена обложки
    await page.locator('div.modal__content-row div.modal__content-cell:nth-child(3)').dblclick();
    await page.waitForLoadState();

    // Кнопка "Сохранить и закрыть"
    await page.getByRole('link', { name: 'Сохранить и закрыть' }).click();
});

    test('album cover editing - 2', async ({ page, context }) => {
        test.setTimeout(100000);
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
        await page.getByRole('link').getByText(siteName).click();

        // Выбор альбома
        await page.getByRole('link', { name: 'Название, ID' }).click();
        await page.locator('section.select-popup div input[type="search"]').type(newID);
        await page.getByText('Готово');

        // Редактирование альбома
        await page.locator('td div.dropdown__wrapper').first().hover();
        await page.getByRole('link', { name: 'Редактировать...' }).click();

        const cover = page.locator('span.cover');
        await expect(cover).toContainText('Обложка');

        // Копирование src-аттрибута для проверки обложки
        const inputElement = page.locator('tr:nth-child(2) td.list-white__cell-group-image div.list-white__group-image-wrapper img');
        src = await inputElement.getAttribute('src');
        console.log(src);

        // Кнопка "Закрыть"
        await page.getByRole('link', { name: 'Закрыть' }).click();

        // Открытие новой вкладки
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            // Переход по ссылке на сайт
            await page.getByText(' На сайт ').click(),
        ]);
        await newPage.waitForLoadState();

        // Принятие соглашения об обработке персональных данных
        await newPage.locator('button.cookie-modal__all-cookies-button').click();
        await newPage.waitForLoadState();

        // Поиск альбома
        await newPage.locator('div.page header > div.header__search').click();
        await newPage.locator('form input[type="search"]').type(newID, { delay: 100 });
        await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();

        const inputElement2 = newPage.locator('div#js-search-container div.events__event div.events__event-bg img');
        const src2 = await inputElement2.getAttribute('src');
        console.log(src2);

        await expect(src).toEqual(src2);
    });
