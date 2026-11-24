# DARSYNT Website

Статический сайт-портфолио бренда DARSYNT (Software • Games • Apps).
Чистые HTML / CSS / JavaScript, без сборки, без зависимостей, без серверной части. Совместим с GitHub Pages.

## Запуск локально

Нужен Python 3 (или любой статический сервер):

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Откройте http://localhost:8080/

## Структура

| Путь | Назначение |
|---|---|
| `index.html` | Разметка, SEO, Open Graph, JSON-LD |
| `css/styles.css` | Стили, палитра бренда, адаптив, reduced-motion |
| `js/i18n.js` | Словари RU/EN, переключатель, сохранение языка (`localStorage`) |
| `js/main.js` | Меню, подсветка разделов, анимации появления, фон hero (canvas) |
| `assets/` | `favicon.svg`, `og-image.png` |
| `robots.txt`, `sitemap.xml` | SEO |
| `.nojekyll` | Отключает Jekyll на GitHub Pages |

## Как менять

- Тексты: добавляйте ключи в оба словаря в `js/i18n.js` и атрибут `data-i18n` в HTML.
- Проекты: блоки `.card` в секции `#projects`.
- Шрифт Sora не поставляется в брендките. Сейчас используется системный запасной шрифт.
  Чтобы подключить Sora локально: положите `Sora-Variable.woff2` в `assets/fonts/` и добавьте `@font-face` в начало `css/styles.css`.

## Публикация

Не выполнена. Выполняется отдельно, только по разрешению владельца (GitHub Pages + домен darsynt.com).
