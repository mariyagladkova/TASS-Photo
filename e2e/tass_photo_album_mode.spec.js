const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "Тест 080223";

test('downloading of archive image hosting files', async ({ page, context }) => {
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

    // Просмотр сообщения про архивный режим
    await newPage.locator('div.modal-archive-label').click();
    const firstMessage = newPage.locator('div.modal-archive');
    await expect(firstMessage).toBeVisible;
    // Закрытие сообщения
    await newPage.locator('div.modal-archive__btn-close').click();
    
    // Попытка скачать альбом главных мероприятий (выбор первого альбома)
    await newPage.locator('a.slider-events__slide-link').first().hover();
    await newPage.locator('a.slider-events__slide-download use').first().click();
    // Просмотр сообщения про архивный режим
    const secondMessage = newPage.locator('div.modal-archive-content');
    await expect(secondMessage).toBeVisible;
    // Закрытие сообщения
    await newPage.locator('button.modal-archive__btn').click();

    // Попытка скачать произвольный альбом (выбор третьего альбома)
    await newPage.locator('div.row div:nth-child(3) div.events__event a.events__event-link').click();
    await newPage.locator('div.albums__header-data_btn a.control__download').click();
    // Просмотр сообщения про архивный режим
    const thirdMessage = newPage.locator('div.modal-archive-content');
    await expect(thirdMessage).toBeVisible;
    // Закрытие сообщения
    await newPage.locator('button.modal-archive__btn').click();

     // Попытка скачать произвольное изображение (выбор второго изображения)
    await newPage.locator('div.events__stream-event:nth-child(2) a.events__stream-event-link').hover();
    await newPage.locator('div.events__stream-event:nth-child(2) a.events__stream-event-download').click();
    // Просмотр сообщения про архивный режим
    const fourthMessage = newPage.locator('div.modal-archive-content');
    await expect(fourthMessage).toBeVisible;
    // Закрытие сообщения
    await newPage.locator('button.modal-archive__btn').click();

    // Принятие соглашения об обработке персональных данных
    //await newPage.locator('button.cookie-modal__all-cookies-button').click();
});
