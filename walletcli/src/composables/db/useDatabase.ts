import { onMounted, reactive } from "vue";
import { Storage } from "../../types/storage";
import { type Transaction } from "../../types/transaction";




export function useDatabase() {
    const db = reactive<Storage>({
        transactions: [],
    });

    const loadDatabase = async () => {
        const data: Transaction[] = []; //await fetchDatabase();
        db.transactions = data;
    };

    onMounted(() => {
        loadDatabase();
    });

    return { db };
}