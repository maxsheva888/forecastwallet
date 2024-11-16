import { reactive } from "vue";
import { Storage } from "../../types/storage";
import { type Transaction } from "../../types/transaction";


export interface IDatabase {
    db: Storage;
    commit: () => void;
}


export function useDatabase() {
    const db = reactive<Storage>({
        transactions: [],
    });

    const loadDatabase = async () => {
        const data: Transaction[] = JSON.parse(localStorage.getItem('transactions') ?? '') ?? [];
        db.transactions = data;
    };

    const commit = () => {
        localStorage.setItem('transactions', JSON.stringify(db.transactions));
    }

    console.log('Database loaded');
    loadDatabase();

    return { db, commit };
}
