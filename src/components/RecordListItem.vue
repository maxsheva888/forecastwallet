<template>
    <a-list-item>
        <a-list-item-meta
            :description="props.record.date"
        >
            <template #title>
                <a-spacer>
                    <a-cascader
                        :options="categoriesAsOptions"
                        @change="categoryChange"
                    >
                        <a-tag
                            :bordered="false"
                            :color="categoryColor"
                        >
                            {{ categoryName }}
                        </a-tag>
                    </a-cascader>
                    <a-input
                        :value="props.record.description"
                        :bordered="false"
                    />
                </a-spacer>
            </template>
        </a-list-item-meta>
        <a-statistic
            :value="props.record.amount"
            :prefix="props.record.type === 'expense' ? '-' : ''"
            :value-style="{ color: props.record.type === 'expense' ? '#cf1322' : '#3f8600' }"
            suffix="zl"
        />
        <template #actions>
            <a-button
                danger
                @click="removeRecordEvent(props.record)"
            >
                <template #icon><DeleteOutlined /></template>
            </a-button>
        </template>
    </a-list-item>
</template>

<script lang="ts" setup>
    import { getCategories, getCategoryByKey, type ObservableCategory } from '@/api/db';
    import { type Category, type Record, type RecordType } from '../api/types';
    import { DeleteOutlined } from '@ant-design/icons-vue';
    import { computed, ref, watch, type PropType, type Ref } from 'vue';
    import { useObservable } from '@vueuse/rxjs';
    import { liveQuery } from 'dexie';
    import type { CascaderProps } from 'ant-design-vue';

    const emit = defineEmits(['removeRecord', 'changeCategory']);

    const props = defineProps({
        record: {
            type: Object as PropType<Record>,
            required: true,
        }
    })

    const categoryKey = computed(() => props.record.category);

    const category = ref<Ref<ObservableCategory, ObservableCategory>>(useObservable<ObservableCategory>(
        liveQuery(() => getCategoryByKey(props.record.category))
    ))

    const categories = ref<Category[]>(useObservable(
        liveQuery(getCategories)
    ))

    watch(
        () => categoryKey.value,
        async () => {
            category.value = await getCategoryByKey(props.record.category)
        }
    )

    const categoriesAsOptions = computed<CascaderProps['options']>(() => {
        return categories.value?.map(item => ({
            value: item.key,
            label: item.name,
            children: item.children?.map(child => ({
                value: child.key,
                label: child.name,
            })) ?? []
        }))
    })

    const categoryName = computed(() => category.value?.name)

    const categoryColor = computed(() => category.value?.color)


    const categoryChange = ([, newSubCategory]: [never,  string]) => {
        emit('changeCategory', { record: props.record, category: newSubCategory })
    }
    const removeRecordEvent = async (record: Record) => {
        emit('removeRecord', record);
    };

</script>