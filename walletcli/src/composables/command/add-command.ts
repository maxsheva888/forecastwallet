/**
    Add command

    Basic Commands:

        add [параметры]
            Добавляет запись в кошелек.

            Параметры:
                -e, --expense
                    Расход.

                -i, --income
                    Доход.

                -c, --category <string>
                    Категория.

                -d, --date <string>
                    Дата.

                -t, --tags <string[]>
                    Теги.

                -m, --message <string>
                    Сообщение.

            Примеры использования:
                $ wallet add -e 200 -c food -d 08-11-2024 -t lunch fastfood

                    new expense added
                    83hks83h [08-11-2024] 200 | food [lunch, fastfood]

                $ wallet add -i 100 -c salary -m "text description" -d 07-11-2024 -t work

                    new income added
                    o9aei86j [07-11-2024] 100 | text description | salary [work]

        remove [параметры]
            Удаляет запись из кошелька.

            Параметры:
                -i, --id <string>
                    Идентификатор записи.

                -l, --last
                    Последняя запись.

            Примеры использования:
                $ wallet remove -i 83hks83h

                    expense removed
                    83hks83h [08-11-2024] 200 | food [lunch, fastfood]

                $ wallet remove -l

                    income removed
                    o9aei86j [07-11-2024] 100 | text description | salary [work]

        list [параметры]
            Выводит список записей.

            Параметры:
                -l, --limit <number>
                    Количество записей.

                -c, --category <string>
                    Категория.

                -p, --period <string>
                    Период.

                    -c, --current
                        Текущий день.

                    -y, --yesterday
                        Вчерашний день.

                    -d, --day <string>
                        День в формате "DD-MM-YYYY".

                    -w, --week
                        Текущая неделя. Если после флага указать число, то это будет
                        отступ от текущей недели.

                    -m, --month
                        Текущий месяц. Если после флага указать число, то это будет
                        отступ от текущего месяца.

            Примеры использования:
                $ wallet list -l 10

                    1. 83hks83h [08-11-2024] 200 | food [lunch, fastfood]
                    2. o9aei86j [07-11-2024] 100 | text description | salary [work]

                $ wallet list -c food -pc

                    1. 83hks83h [07-11-2024] 200 | food [lunch, fastfood]
*/