<template>
    <a-row>
        <a-col :span="24">
            <AddNewRecord @add-record="addNewRecordEvent" />
            <a-divider />
        </a-col>
        <context-holder />
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-list
                :data-source="records"
            >
                <template #renderItem="{item, index}">
                    <RecordListItem
                        :record="records[index]"
                        @remove-record="removeRecordEvent"
                        @change-category="changeRecordCategoryEvent"
                    />
                </template>
            </a-list>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { liveQuery } from "dexie";
    import { useObservable } from '@vueuse/rxjs';
    import { addRecord, getRecords, deleteRecord, changeRecordCategory, type Record } from '../api/db';
    import AddNewRecord from './AddNewRecord.vue';
    import { message } from 'ant-design-vue';
    import RecordListItem from './RecordListItem.vue';

    const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });

    const records = ref<Record[]>(useObservable(
        liveQuery(getRecords)
    ));


    const addNewRecordEvent = (record: Record) => {
        addRecord(record).then(() => {
            messageApi.success(`${record.type == 'income' ? 'Доход ' : 'Расход -'}${record.amount} добавлен!`)
        });
    };

    const removeRecordEvent = (record: Record) => {
        deleteRecord(record.id).then(() => {
            messageApi.success(`${record.type == 'income' ? 'Доход ' : 'Расход -'}${record.amount} удален!`);
        });
    }

    const changeRecordCategoryEvent = ({record, category}: {record: Record, category: string}) => {
        changeRecordCategory(record.id, category).then(() => {
            messageApi.success('Категория изменена');
        })
    }
</script>