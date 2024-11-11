import moment from "moment";
import { Command } from "../../types/command";
import { Transaction } from "../../types/transaction";
import { useHash } from "../utils/useHash";
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
        const { getTransactions } = useWallet();

        const limit = Number(options['-l'] ?? 2);

        let transactions = getTransactions((t) => options['-c'] ? t.category == options['-c'] : true);

        if (options['-p'] !== undefined) {
            if (options['-t'] !== undefined) {
                transactions = transactions.filter(t => t.date == moment().format('DD-MM-YYYY'));
            }
        }

        const getAmountColor = (t: string) => t === 'expense' ? '--red' : '--green';

        const output = transactions.slice(0, limit).map((t, index) => 
            `${index + 1}. ${t.id.substring(0, 8)} [${t.date}] <span style="color: var(${getAmountColor(t.type)})">${t.amount}</span> | ${t.category ?? '-' } [${t.tags.join(', ')}]`
        );

        return output;
    }
};
