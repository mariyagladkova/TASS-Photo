const { test, expect } = require('@playwright/test');
import { tassPhotoLoginPage } from '../pages/tassPhotoLogin.page.js';

// Название фотохостинга, на котором осуществляется проверка
const siteName = "Тест 290822";

test('downloading of partially enabled authorization access images', async ({ page, context }) => {
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
    await page.getByRole('button').getByText('Готово').click();

    // Редактирование фотохостинга
    await page.locator('td:nth-child(9) div.dropdown__wrapper').hover();
    await page.getByRole('link', { name: 'Редактировать...' }).click();

    await page.waitForLoadState();

    // Выбор Частично закрытого доступа
    await page.locator('form:nth-child(1) div.margin-top-15 label.radio:nth-child(2) div.radio__view').click();

    // Подтверждение, что чекбокс "Использовать авторизацию на проекте" активен
    if (await page.locator('label:nth-child(16) input').isChecked()) {
    }
    else {
        await page.locator('label:nth-child(16) div.checkbox__view').click();
    }

    await page.pause();

    // Сохранить и закрыть
    if (await page.getByRole('link').getByText('Сохранить').isVisible()) {
        await page.getByRole('link').getByText('Сохранить').click();
        await page.getByRole('link').getByText('Закрыть').click();
    }
    else {
        await page.getByRole('link').getByText('Закрыть').click();
    }

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

    await newPage.waitForLoadState();

    // Скачивание альбома с главной в альбомном виде
    await newPage.locator('div.row div:nth-child(4) div.events__event').hover();
    await newPage.locator('div.row div:nth-child(4) div.events__event use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Скачивание со страницы альбома (второй по счёту)
    await newPage.locator('div.row div:nth-child(2) div.events__event').click();

    // Копирование названия альбома
    const albumName = await newPage.locator('div.albums__header-title').textContent();
    const albumName2 = albumName.replace(/\n/g, ' ');
    console.log(albumName2);

    await newPage.locator('div#js-control-albums a.control__download').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Скачивание альбома из поиска
    await newPage.locator('header.header_albums div.header__search').click();
    await newPage.locator('form input[type="search"]').type(albumName2, { delay: 100 });
    await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();

    await newPage.locator('div.row div:nth-child(1) div.events__event').hover();
    await newPage.locator('div.row div:nth-child(1) div.events__event use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Переход на главную
    await newPage.locator('a[title="Home"]').click();

    // Попытка скачать альбом с главной в альбомном виде
    await newPage.locator('div.row div:nth-child(4) div.events__event').hover();
    await newPage.locator('div.row div:nth-child(4) div.events__event use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Проверка появления бургер-меню для авторизации
    const burgerMenu = newPage.locator('div.burger_active');
    await expect(burgerMenu).toBeVisible();

    const button = newPage.getByRole('button').getByText('Войти');
    await expect(button).toBeVisible();

    // Закрытие меню
    await newPage.locator('div.burger__close').click();

    // Переключение на режим фотопотока
    await newPage.locator('div.events__title-wrapper div.events__type-buttons a.events__type-2').click();

    // Скачивание медиафайла из фотопотока
    await newPage.locator('div.events__stream-event:nth-child(2) div.events__stream-event-wrapper').hover();
    await newPage.locator('div.events__stream-event:nth-child(2) div.events__stream-event-wrapper use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Переключение на режим альбома
    await newPage.locator('div.events__title-wrapper div.events__type-buttons a.events__type-1').click();

    // Скачивание медиафайла со страницы просмотра альбома
    await newPage.locator('div.row div:nth-child(1) div.events__event').click();
    await newPage.locator('div.events__stream-event:nth-child(1)').hover();
    await newPage.locator('div.events__stream-event:nth-child(1) use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Скачивание медиафайла со страницы его просмотра
    await newPage.locator('div.events__stream-event:nth-child(1)').click();
    await newPage.locator('div.modal-black__controls a.control__download').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Копирование ID медиафайла
    let ID = await newPage.locator('div.modal-black__id').textContent();
    let newID = ID.replace(/\D/g, "");
    console.log(newID);

    // Скачивание медиафайла из поиска
    await newPage.locator('a.modal-black__close').click();
    await newPage.locator('header.header_albums div.header__search').click();
    await newPage.locator('form input[type="search"]').type(newID, { delay: 100 });
    await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();
    await newPage.locator('div.modal-search__container-events div.events__stream-event-wrapper').hover();
    await newPage.locator('div.modal-search__container-events div.events__stream-event-wrapper a.events__stream-event-download use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оптимальное качество' }).click();

    // Попытка скачать медиафайл из поиска
    await newPage.locator('div.modal-search__container-events div.events__stream-event-wrapper a.events__stream-event-download use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Проверка появления бургер-меню для авторизации
    await expect(burgerMenu).toBeVisible();

    await expect(button).toBeVisible();

    // Авторизация. Поле "Почта"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="email"]').type('mariya.gladkova@nutnet.ru', { delay: 100 });
    // Поле "Пароль" - ввод неверного пароля
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization input[name="password"]').type('123Koo456!', { delay: 100 });
    // Кнопка "Войти"
    await newPage.locator('div.form__authorization:nth-child(1) form.f-authorization button[name="submit"]').click();

    // Скачивание альбома с главной в альбомном виде
    await newPage.locator('div.row div:nth-child(4) div.events__event').hover();
    await newPage.locator('div.row div:nth-child(4) div.events__event use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Скачивание со страницы альбома (второй по счёту)
    await newPage.locator('div.row div:nth-child(2) div.events__event').click();

    await newPage.locator('div#js-control-albums a.control__download').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Скачивание альбома из поиска
    await newPage.locator('header.header_albums div.header__search').click();
    await newPage.locator('form input[type="search"]').type(albumName2, { delay: 100 });
    await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();

    await newPage.locator('div.row div:nth-child(1) div.events__event').hover();
    await newPage.locator('div.row div:nth-child(1) div.events__event use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Переход на главную
    await newPage.locator('a[title="Home"]').click();

    // Переключение на режим фотопотока
    await newPage.locator('div.events__title-wrapper div.events__type-buttons a.events__type-2').click();

    // Скачивание медиафайла из фотопотока
    await newPage.locator('div.events__stream-event:nth-child(2) div.events__stream-event-wrapper').hover();
    await newPage.locator('div.events__stream-event:nth-child(2) div.events__stream-event-wrapper use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Переключение на режим альбома
    await newPage.locator('div.events__title-wrapper div.events__type-buttons a.events__type-1').click();

    // Скачивание медиафайла со страницы просмотра альбома
    await newPage.locator('div.row div:nth-child(1) div.events__event').click();
    await newPage.locator('div.events__stream-event:nth-child(1)').hover();
    await newPage.locator('div.events__stream-event:nth-child(1) use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Скачивание медиафайла со страницы его просмотра
    await newPage.locator('div.events__stream-event:nth-child(1)').click();
    await newPage.locator('div.modal-black__controls a.control__download').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();

    // Скачивание медиафайла из поиска
    await newPage.locator('a.modal-black__close').click();
    await newPage.locator('header.header_albums div.header__search').click();
    await newPage.locator('form input[type="search"]').type(newID, { delay: 100 });
    await newPage.locator('div.modal-search__header-form form button[type="submit"]').click();
    await newPage.locator('div.modal-search__container-events div.events__stream-event-wrapper').hover();
    await newPage.locator('div.modal-search__container-events div.events__stream-event-wrapper a.events__stream-event-download use').click();
    await newPage.getByRole('listitem').filter({ hasText: 'Оригинал' }).click();
});
