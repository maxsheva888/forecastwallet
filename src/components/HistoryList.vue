<template>
    <a-row>
        <a-col :span="24">
            <AddNewRecord @add-record="addNewRecordEvent" />
            <a-divider />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            total: {{ total }}
            <br />
            <a-list
                :data-source="records.records"
            >
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta
                            :title="item.description"
                            :description="item.date"
                        />
                        <a-statistic
                            :value="item.amount"
                            :prefix="item.type === 'expense' ? '-' : ''"
                            :value-style="{ color: item.type === 'expense' ? '#cf1322' : '#3f8600' }"
                            suffix="zl"
                        />
                        <template #actions>
                            <a-button
                                danger
                                @click="removeRecordEvent(item)"
                            >
                                <template #icon><DeleteOutlined /></template>
                            </a-button>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>
    import { ref, reactive, watch } from 'vue';
    import { liveQuery } from "dexie";
    import { useObservable } from '@vueuse/rxjs';
    import { Empty } from 'ant-design-vue';
    import { addRecord, getRecords, totalRecords, deleteRecord, Record, getCountInList } from '../api/db';
    import AddNewRecord from '../components/AddNewRecord.vue';
    import { DeleteOutlined } from '@ant-design/icons-vue';
    import { message } from 'ant-design-vue';

    const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

    const loading = ref<boolen>(false);
    const total = ref<number>(useObservable(
        liveQuery(totalRecords)
    ));

    const records = reactive<{ total: number, records: Record[] }>({
        records: useObservable(
            liveQuery(getRecords)
        )
    });

    const addNewRecordEvent = async (record: Record) => {
        console.log(record);
        addRecord(record).then(() => {
            showNotification('create', record)
        });
    };

    const removeRecordEvent = async (record: Record) => {
        await deleteRecord(record.id);
        showNotification('delete', record);
    }

    // @todo: move to helpers file
    const showNotification = (type: 'delete' | 'create' | 'error', record: Record) => {
        switch (type) {
            case 'delete':
                message.success(`${record.type == 'income' ? 'Доход ' : 'Расход -'}${record.amount} удален!`)
                break;
            case 'create':
                message.success(`${record.type == 'income' ? 'Доход ' : 'Расход -'}${record.amount} добавлен!`)
                break;

            default:
                break;
        }
    }

</script>