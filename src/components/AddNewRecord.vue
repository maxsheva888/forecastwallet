<template>
    <a-flex justify="space-between" align="center">
        <a-segmented v-model:value="type" :options="types" >
            <template #label="{ payload }">
                <div style="padding: 4px 4px">
                    <a-avatar shape="square" :style="payload.style">
                        <template #icon><component :is="payload.icon" /></template>
                    </a-avatar>
                </div>
            </template>
        </a-segmented>
        <a-input-number ref="inputValue" v-model:value="amount" autofocus/>
        <a-input v-model:value="description" placeholder="Описание" style="max-width: 200px;"/>
        <a-date-picker v-model:value="date" :format="dateFormat" />
        <a-button type="primary">
            <template #icon>
                <EnterOutlined />
            </template>
            Добавить
        </a-button>
    </a-flex>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref, watch, useTemplateRef } from 'vue';
import { type RecordType } from '../api/types';
import { MinusOutlined, PlusOutlined, EnterOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['addRecord']);

const dateFormat = 'DD/MM/YYYY';
const inputRef = useTemplateRef<HTMLOrSVGElement>('inputValue');

const type = ref<RecordType>('expense');
const amount = ref<number | null>(null);
const date = ref<Dayjs>(dayjs());
const description = ref<string>('Расход');

watch(type, (value) => {
        description.value =
            value === 'expense' ? 'Расход' : 'Доход';
});

const types = ref([
    {
        value: 'expense',
        payload: {
            icon: MinusOutlined,
            style: {
                color: '#4d0101',
                backgroundColor: '#f56a00',
            },
        },
    },
    {
        value: 'income',
        payload: {
            icon: PlusOutlined,
            style: {
                color: '#1f5f03',
                backgroundColor: '#87d068',
            },
        },
    },
]);

const setInputFocused = (value: boolean = true) => {
    !value && inputRef.value?.blur() ||
        inputRef.value?.focus()

    return true;
};

const typeChange = (value: RecordType) => {
    setInputFocused();
};


document.addEventListener('keydown', (event) => {
    if (event.key === '+') {
        type.value = 'income';
        setInputFocused(false) && setInputFocused()
        return;
    }
    if (event.key === '-') {
        type.value = 'expense';
        setInputFocused(false) && setInputFocused()
        return;
    }
    if (event.key === 'Enter') {
        if (amount.value === null) {
            setInputFocused();
            return;
        }

        emit('addRecord', {
            type: type.value,
            amount: Math.abs(amount.value),
            currencu: 'PLN',
            category: 'other',
            date: date.value.format(dateFormat),
            description: description.value,
        });

        resetForm();
    }
});

const resetForm = () => {
    type.value = 'expense';
    amount.value = null;
    date.value = dayjs();
    setInputFocused();
};

</script>
