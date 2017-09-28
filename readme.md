## Старт проекта

Запуск установки пакетов

```
npm i
```

Запуск шаблона для разработки

```
gulp
```

## Структура проекта


```

├── dev
│   ├── blocks
│	│	└── blocks-name					# Название блока
│	│		├── name.pug				# Страница
│	│		├── name.less				# Стили для блока
│	│		├── tablet-name.less 
│	│		└── mobile-name.less
│	│
│	│
│	├── pages
│	│	└── name.pug  					# Разметка страницы
│	│
│	│
│	└── styles
│		├── variables.less				# LESS переменные для общего файла со стилями
│		├── style.less					# Служит для импорта стилей блоков
│		├── default.less				# Общие стили для проекта
│		├── tablet-default.less
│		└── mobile-default.less

```