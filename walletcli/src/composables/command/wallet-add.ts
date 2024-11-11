import moment from "moment";
import { Command } from "../../types/command";
import { Transaction } from "../../types/transaction";
import { useHash } from "../utils/useHash";
import { useWallet } from "../wallet/useWallet";


const validateTransaction = (transaction: Transaction): string | boolean => {
    if (isNaN(transaction.amount) || transaction.amount <= 0) {
        return 'Amount must be greater than 0';
    }

    /* if (transaction.category.length === 0) {
        return 'Category is required';
    } */

    if (transaction.date.toString() === 'Invalid Date') {
        return 'Invalid date';
    }

    return true;
}
const description = `wallet add [параметры]
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
            o9aei86j [07-11-2024] 100 | text description | salary [work]`;


export const walletAdd: Command = {
    name: 'add',
    namespace: 'wallet',
    description,
    options: {
        '-e': 'Expense',
        '-i': 'Income',
    },
    execute: (args, options) => {

        const { addTransactionToWallet, wallet } = useWallet();
        const { hash } = useHash();

        const type = options['-e'] ? 'expense' : 'income';
        const amount = Number(options['-e'] ?? options['-i']);
        const balanceBefore = wallet.value.balance;
        const balanceAfter = type === 'expense' ? balanceBefore - amount : balanceBefore + amount;
        const date = options['-d'] ? moment(options['-d'], 'DD-MM-YYYY') : moment();
        const getAmountColor = () => type === 'expense' ? '--red' : '--green';

        const nt: Transaction = {
            id: hash(),
            type,
            amount,
            category: options['-c'],
            date: date.format('DD-MM-YYYY'),
            tags: options['-t'] ? options['-t'].split(' ') : [],
            description: options['-m'] ?? '',
        };
        console.log('newTransaction', nt);
        const validates = validateTransaction(nt);
        if (validates !== true) {
            return [
                `<span class="error">${validates}</span>`,
                `Type 'help wallet add' to see the additional information about the command`
            ];

        }

        const response = addTransactionToWallet(nt);

        if (!response) {
            return [
                `<span class="error">error adding ${type}.</span>`,
                `Type 'help wallet add' to see the additional information about the command`
            ];
        }

        return [
            `<span style="color: var(--green)">new ${type} added.</span>`,
            `${nt.id.substring(0, 8)} [${nt.date}] <span style="color: var(${getAmountColor()})">${amount}</span> | ${nt.category ?? 'no category'} [${nt.tags.join(', ')}]`,
            '<span style="color: var(--comment)">--------------------</span>',
            `<span style="color: var(--comment)">balance: ${balanceAfter}</span`,
        ];
    }
};
