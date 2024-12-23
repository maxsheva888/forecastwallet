// db.ts
import Dexie, { type EntityTable } from 'dexie';
import { type Category, type Record, type RecordType, type SettingTable } from './types';
import categories from '../assets/categories.json';
import { Item } from 'ant-design-vue/es/menu';

const db = new Dexie('MoneyDatabase') as Dexie & {
  records: EntityTable<Record, 'id'>;
  settings: EntityTable<SettingTable, 'id'>;
  categories: EntityTable<Category>;
};

// Schema declaration
db.version(1).stores({
    records: '++id, currencu, amount, date, type, category, description',
    settings: '++id, settingKey, settingValue',
    categories: 'name, type, key',
});

db.on("populate", function() {
    // Init your DB with some default statuses:
    db.settings.add({ id: 1, settingKey: 'initialBalance', settingValue: 100 });
    db.settings.add({ id: 2, settingKey: 'countInList', settingValue: 5 });

    categories.forEach((category) => {
        db.categories.add(category as Category);
    });
});


// Add a record to the database
export async function addRecord(record: Record) {
    return db.records.add(record);
}

// Get last records from the database
export async function getRecords() {
    return db.records.orderBy('date').reverse().toArray();
}

export async function deleteRecord(key: number) {
  return db.records.delete(key);
}

export async function changeRecordCategory(key: number, category: string) {
    return db.records.update(key, { category });
}

export async function totalRecords() {
    return db.records.count();
}

export async function getInitialBalance() {
    return db.settings.filter((setting) =>setting.settingKey == 'initialBalance' ).first()
}

export async function getCountInList() {
    return (await db.settings.filter((setting) =>setting.settingKey == 'countInList' ).first())?.settingValue as number || 3
}

export async function getCurrentBalance(): Promise<number> {
    let initBalance: number = (await getInitialBalance())?.settingValue as number || 0;

    const incomes = await db.records.where('type').equals('income').toArray();
    incomes.forEach((item: Record) => { initBalance += item.amount; });

    const expense = await db.records.where('type').equals('expense').toArray();
    expense.forEach((item: Record) => { initBalance -= item.amount; });

    return initBalance;
}


// CATEGORY

export async function getCategories() {
    return db.categories.toArray();
}

export type ObservableCategory = Category | { name: string | undefined; key: string; color: string; type: RecordType; } | undefined;

export async function getCategoryByKey(key: string): Promise<ObservableCategory> {
    let category = await db.categories.filter(
        (category) => category.key == key || (category.children?.some(item => item.key == key) || false)
    ).first();

    if (!category) {
        return undefined;
    }

    if (category?.key == key) {
        return category;
    }

    return {
        name: category.children?.find(item => item.key == key)?.name,
        key: key,
        color: category.color,
        type: category.type,
    }
}

export async function changeCategory(category: Category) {
    return await db.transaction("rw", 'categories', async () => {
        let item = db.categories.where('key').equals(category.key);

        item.modify({ 'name': category.name });
        item.modify({ 'color': category.color });
        item.modify({ 'children': category.children || [] });
    });
}

export type { Record };
export { db };