<br /><br />

<p align="center">
<a href="https://katana-project-manager.vercel.app">
  <img src="https://i.ibb.co/Rp3wnC6k/Group-2.png" alt="Plane Logo" width="70">
</a>
</p>
<h1 align="center"><b>Katana</b></h1>
<p align="center"><b>Управление проектами с открытым исходным кодом, раскрывающее ценность для клиентов</b></p>

<p>
    <a href="https://katana-project-manager.vercel.app" target="_blank">
      <img
        src="https://github.com/sintepuh/katana/blob/master/public/img/hero-readme.png"
        alt="Katana Screens"
        width="100%"
      />
    </a>
</p>

Встречайте [Katana](https://katana-project-manager.vercel.app/), инструмент управления проектами без хаоса, связанного с управлением самим инструментом, а также с открытым исходным кодом.

> Katana развивается каждый день. Ваши предложения, идеи и сообщения об ошибках очень помогают нам. Не стесняйтесь поднять вопрос на GitHub. Я читаю все и отвечаю на большинство из них.

## 🌟 Возможности

- **Создание рабочих пространств и проектов**  
  Структурируйте задачи по рабочим пространствам и проектам. Это удобно для разделения работы между разными командами или направлениями.

- **Управление задачами и назначение ответственных**  
  Создавайте задачи, указывайте дедлайны, добавляйте подзадачи, вложения и назначайте исполнителей.

- **Роли участников: владелец, администратор, участник**  
  Ролевая модель управления правами внутри рабочего пространства:
  - **Владелец** — полный доступ  
  - **Администратор** — управление пользователями и проектами  
  - **Участник** — работа с задачами

- **Канбан-доска, календарь и таблица задач**  
  Три режима отображения задач:
  - **Канбан** — визуальное распределение по этапам  
  - **Календарь** — планирование по датам  
  - **Таблица** — компактный и наглядный вид

- **Приглашение участников по ссылке**  
  Упрощённый способ добавления пользователей в рабочие пространства и проекты.

- **Email-уведомления**  
  Оповещения о действиях приходят на почту: новые задачи, комментарии, обновления и приглашения.

- **Авторизация через Google, GitHub и Яндекс**  
  Быстрый вход без лишней регистрации — через привычные OAuth-сервисы.

- **Хостинг и база данных через Appwrite**  
  Приложение использует **Appwrite** как backend:  
  - Хранение данных и файлов  
  - Уведомления  
  - Авторизация и безопасность  
> Для полноценной работы необходимо **развернуть Appwrite на собственном сервере** или использовать его облачную версию.

## 📦 Установка проекта

```bash
git clone https://github.com/sintepuh/katana.git
cd katana
npm install
```

## 🛠 Установка Appwrite

Для работы проекта необходимо локально развернуть [Appwrite](https://appwrite.io/). Ниже приведены команды установки через Docker для разных операционных систем:

### 🐧 Unix / macOS

```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.7.3
```

### 🪟 Windows / CMD

```bash
docker run -it --rm ^
    --volume //var/run/docker.sock:/var/run/docker.sock ^
    --volume "%cd%"/appwrite:/usr/src/code/appwrite:rw ^
    --entrypoint="install" ^
    appwrite/appwrite:1.7.3
```


## ⚙️ Создано с помощью
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)

## 🛡️ Безопасность

Если вы обнаружили уязвимость безопасности в Plane, пожалуйста, сообщите об этом ответственно, а не открывайте публичную проблему. Я серьезно отношусь ко всем законным сообщениям и буду оперативно их расследовать.

## 📄 Лицензия
Этот проект распространяется под лицензией [GNU Affero General Public License v3.0]. Подробнее см. в файле (https://github.com/sintepuh/katana/blob/master/LICENSE).
