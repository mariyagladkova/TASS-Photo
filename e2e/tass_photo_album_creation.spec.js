const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';
import { faker } from '@faker-js/faker/locale/ru';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "Автоматизация";

const albumName = faker.music.songName();

let src = '';

test('creation of an album', async ({ page}) => {
    test.setTimeout(150000);

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

    // Кнопка "Создать"
    await page.locator('div:nth-child(2) div:nth-child(1) div.title__icon-wrapper use').click();

    // Название альбома
    await page.locator('div.modal__form-step-container div:nth-child(5) textarea.input__field').type(albumName, { delay: 100 });

    // Добавление категории
    await page.getByRole('button', { name: 'Добавить...' }).click();
    await page.locator('div.multiselect').click();
    await page.locator('ul.select-popup__list li.select-popup__item').first().click();

    // Статус "Опубликован"
    await page.getByText('Опубликован', { exact: true }).click();

    // Доступ "Открытый"
    await page.locator('#modal_edit_albums').getByText('Открытый').click();

    // Загрузка файлов
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Загрузить…').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([ '../upload/video1.mp4', '../upload/video2.mp4', '../upload/cat.jpg', '../upload/flamingo.jpg', '../upload/panda.jpg', '../upload/parrot.jpg', '../upload/bird.jpg']);
    await page.waitForLoadState();

    // Установка обложки
    await page.locator('div.modal__content-row div.modal__content-cell:nth-child(1)').dblclick();
    await page.waitForLoadState();

    // Кнопка "Создать"
    await page.getByRole('link', { name: 'Создать' }).click();
    await page.waitForLoadState();
});

test('creation of an album - 2', async ({ page, context }) => {
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
    await page.locator('section.select-popup div input[type="search"]').type(albumName);
    await page.getByText('Готово');

    // Редактирование альбома
    await page.locator('td div.dropdown__wrapper').first().hover();
    await page.getByRole('link', { name: 'Редактировать...' }).click();

    // Копирование src-аттрибута для проверки обложки
    const inputElement = page.locator('div#modal_edit_albums div.cover-drag-zone img');
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
    await newPage.locator('form input[type="search"]').type(albumName, { delay: 100 });
    await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();
    await newPage.waitForLoadState();

    const inputElement2 = newPage.locator('div#js-search-container div:nth-child(1) div.events__event-bg img');
    const src2 = await inputElement2.getAttribute('src');
    console.log(src2);

    await expect(src).toEqual(src2);
});
