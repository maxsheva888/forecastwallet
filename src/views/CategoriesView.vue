<template>
    <a-tabs
        v-model:activeKey="activeTab"
        tab-position="left"
        @tabScroll="callback"
        :tabBarStyle.active="{ backgroundColor: '#f0f2f5' }"
    >
        <a-tab-pane v-for="(category, i) in categories" :key="i">

            <template #tab>
                {{ category.name }}
            </template>

            <a-list
                :data-source="[category]"
            >
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #avatar>
                                <VSwatches
                                    v-model="item.color"
                                >
                                    <template #trigger>
                                        <a-button
                                            :style="{ backgroundColor: item.color }"
                                            readonly
                                        >
                                        </a-button>
                                    </template>
                                </VSwatches>
                            </template>
                            <template #title>
                                    <a-input
                                        v-model:value="item.name"
                                        :bordered="false"
                                        class="category-name"
                                        @change="categoryNameChanged(category, item)"
                                    />
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-tag v-if="category.type === 'income'"  :bordered="false" color="success">Доход</a-tag>
                            <a-tag v-if="category.type === 'expense'" :bordered="false" color="error">Расход</a-tag>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
            <a-list
                :data-source="category.children"
            >
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-input v-model:value="item.name" :bordered="false" @change="categoryNameChanged(category, item)" />
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-button
                                danger
                            >
                                <template #icon><DeleteOutlined /></template>
                            </a-button>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type TabsProps } from 'ant-design-vue';
import type { Category } from '@/api/types';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from "dexie";
import { getCategories } from '@/api/db';
import { DeleteOutlined } from '@ant-design/icons-vue';

const callback: TabsProps['onTabScroll'] = val => {
  console.log(val);
};

const activeTab = ref<number>(1);

const categories = ref<Category[]>(useObservable(
    liveQuery(getCategories)
));

const categoryNameChanged = (category: Category, item: { name: string }) => {
    console.log(category, item);
};

</script>

<style scoped>
    input.category-name {
        font-size: 1.1em;
        font-weight: bold;
    }
    .ant-tabs-tab-active {
        border-radius: 12px 0 0 12px;
    }
</style>