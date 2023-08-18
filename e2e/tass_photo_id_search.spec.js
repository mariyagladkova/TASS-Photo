const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "Тест 290822";

test('search by id', async ({ page, context }) => {
    // Авторизация 
    const TassPhotoLP = new tassPhotoLoginPage(page);
    await TassPhotoLP.goto();
    await TassPhotoLP.login();

    // Выбор фотохостинга

    // Выбор третьего в списке фотохостинга
    await page.locator('tr:nth-child(4) td:nth-child(4) a').click();

    // // Фильтр по названию, ID
    // await page.locator('tr:nth-child(1) th:nth-child(4) div.list-white__cell-wrapper a:nth-child(1) span').click();
    // // Ввод названия в поисковое поле
    // await page.locator('div.input-wrapper input[type="search"]').type(siteName, { delay: 100 });
    // // Кнопка "Готово"
    // await page.getByRole('button').getByText('Готово').click();

    // // Выбор фотохостинга
    // await page.locator('td.events_auto:nth-child(4) a').click();

    // Выбор альбома (первый в списке)
    await page.locator('tr:nth-child(2) td:nth-child(4) a').click();

    // Выбор медиафайла
    let ID = await page.locator('tr:nth-child(2) td:nth-child(4) small').textContent();
    let newID = ID.replace(/\D/g, "");
    console.log(newID);

    // Поиск по ID
    await page.locator('a.header__search').click();
    await page.locator('input.page-search__input').type(newID, { delay: 100 });
    await page.keyboard.press('Enter');

    await page.waitForLoadState();

    // Проверка на то, что найден 1 медиафайл
    const filter = page.locator('li.filter__item div.filter__count');
    await expect(filter).toContainText("1");
});
