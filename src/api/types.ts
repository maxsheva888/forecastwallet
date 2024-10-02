
export type RecordType = 'income' | 'expense';


interface Record {
    id: number;
    currencu: string;
    amount: number;
    date: Date;
    type: RecordType;
    category: string;
    description?: string;

}

interface SettingTable {
  id: number;
  settingKey: string;
  settingValue: string | number | boolean;
}

interface Category {
    name: string;
    key: string;
    color: string;
    type: RecordType;
    icon?: string;
    children?: {
        name: string;
        key: string;
    }[];
}

export type {
    Record,
    Category,
    SettingTable,
};