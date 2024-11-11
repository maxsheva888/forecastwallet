
import { computed, reactive, ref } from 'vue';
import { Transaction } from '../../types/transaction';
import { StorageResponse, useStorage } from '../useStorage';


export type Wallet = {
    balance: number;
    transactions: Transaction[];
};


const wallet = reactive<Wallet>({
    balance: 0,
    transactions: [],
});

export function useWallet() {

    const { addTransaction, getTransactions, removeTransaction } = useStorage();

    const initWallet = async () => {
        const data: Transaction[] = getTransactions(() => true);

        wallet.transactions = data;
    };

    const addTransactionToWallet = (transaction: Transaction): StorageResponse => {

        if (!addTransaction(transaction)) { 
            return {
                success: false,
                message: 'Transaction not added to storage',
            };
        }

        wallet.transactions.push(transaction);

        if (transaction.type === 'expense') {
            wallet.balance -= transaction.amount;
        } else {
            wallet.balance += transaction.amount;
        }

        return { success: true };
    }

    const currentWallet = computed(() => wallet);

    return {
        initWallet,
        wallet: currentWallet,
        addTransactionToWallet,
        getTransactions,
    };
}