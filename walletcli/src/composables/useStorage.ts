import { Transaction } from "../types/transaction";
import { IDatabase, useDatabase } from "./db/useDatabase";

export type StorageResponse = {
    success: boolean;
    message?: string;
};

interface IStorage {
    addTransaction: (transaction: Transaction) => StorageResponse;
    getTransactions: (filter: (item: Transaction) => boolean | null) => Transaction[];
    removeTransaction: (id: string) => Transaction;
}

const { db: storage, commit }: IDatabase = useDatabase();

export function useStorage(): IStorage {

    const addTransaction = (transaction: Transaction): StorageResponse => {
        storage.transactions.push(transaction);

        commit();

        return { success: true };
    };

    const getTransactions = (filter: (item: Transaction) => boolean | null): Transaction[] => {
        return storage.transactions.filter((t) => filter ? filter(t) : true);
    };

    const removeTransaction = (id: string): Transaction => {
        const index = storage.transactions.findIndex((t: Transaction) => t.id === id);
        if (index === -1) {
            throw new Error(`Transaction with id ${id} not found`);
        }

        const removedT: Transaction = storage.transactions.splice(index, 1).at(0)!;

        commit();

        return removedT;
    };

    return {
        addTransaction,
        getTransactions,
        removeTransaction,
    };
}