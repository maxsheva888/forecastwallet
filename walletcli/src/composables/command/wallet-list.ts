import moment from "moment";
import { Command } from "../../types/command";
import { useWallet } from "../wallet/useWallet";


const description = `list [параметры]
            Выводит список записей.
            Параметры:
                -l, --limit <number>
                    Количество записей.
                -c, --category <string>
                    Категория.
                -p, --period <string>
                    Период.
                    -t, --today
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
                    1. 83hks83h [07-11-2024] 200 | food [lunch, fastfood]`;


export const walletList: Command = {
    name: 'list',
    namespace: 'wallet',
    description,
    options: {
        '-e': 'Expense',
        '-i': 'Income',
    },
    execute: (args, options) => {
        const { getTransactions, wallet } = useWallet();

        const limit = Number(options['-l'] ?? 2);

        let transactions = getTransactions((t) => options['-c'] ? t.category == options['-c'] : true);

        if (options['-p'] !== undefined) {
            if (options['-t'] !== undefined) {
                transactions = transactions.filter(t => t.date == moment().format('DD-MM-YYYY'));
            }
        }

        // Limit transactions
        transactions = transactions.slice(0, limit);


        const grey = '<span style="color: var(--comment)">';
        const output = transactions.map(t =>
            '{1} {grey}{2}{endspan}    {color}{3}{endspan} {color}{4}{endspan} {cyan}{5}{endspan}'.format({
                color: '<span style="color: var({color})">'.format({color: t.type === 'expense' ? '--red' : '--green'}),
                grey,
                cyan: '<span style="color: var(--cyan)">',
                endspan: '</span>',
                1: t.date,
                2: t.id.substring(0, 8),
                3: t.type === 'expense' ? '▼' : '▲',
                4: '{1}{2}'.format({ 1: t.amount, 2: '&nbsp;'.repeat(10 - t.amount.toString().length) }),
                5: [t.category, ...t.tags].join(' #')
            })
        );

        output.unshift('{grey}{d}</span>'.format({ grey, d: '-'.repeat(50) }));
        output.push('{grey}{d}</span>'.format({ grey, d: '-'.repeat(50) }));
        output.push(`{grey}balance: {balance} | total: ▲{i} ▼{e}<span> `.format({
            grey,
            balance: wallet.value.balance,
            i: transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
            e: transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
        }));

        return output;
    }
};
