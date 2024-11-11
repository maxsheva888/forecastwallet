<template>
    <a-tabs
        v-model:activeKey="activeTab"
        tab-position="left"
        @tabScroll="callback"
    >
        <a-tab-pane v-for="(category, i) in categories" :key="i">

            <template #tab>
                {{ category.name }}
            </template>
            <context-holder />
            <a-list
                :data-source="[category]"
            >
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #avatar>
                                <v-swatches
                                    :value="item.color"
                                    @close="categoryColorChanged"
                                    show-fallback
                                    fallback-input-type="color"
                                >
                                    <template #trigger>
                                        <a-button
                                            :style="{ backgroundColor: item.color }"
                                            readonly
                                        >
                                        </a-button>
                                    </template>
                                </v-swatches>
                            </template>
                            <template #title>
                                    <a-input
                                        v-model:value="item.name"
                                        :bordered="false"
                                        class="category-name"
                                        @input="categoryNameChanged(category, item)"
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
                            <a-popconfirm
                                title="Вы уверены, что хотите удалить подкатегорию?"
                                @confirm="removeSubCategory(category, item)"
                            >
                                <a-button danger>
                                    <template #icon><DeleteOutlined /></template>
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </a-list-item>
                </template>
                <template #footer>
                    <div style="padding: 12px 24px;">
                        <a-flex justify="space-between">
                            <a-input
                                v-model:value="newSubCategory"
                            />
                            <a-button
                                style="margin: 0 8px;"
                                type="primary"
                                @click="addSubCategory(category, newSubCategory)"
                            >
                                <template #icon><PlusOutlined /></template>
                            </a-button>
                        </a-flex>
                    </div>
                </template>
            </a-list>
        </a-tab-pane>
        <!-- <template #leftExtra>
            <a-button
                type="link"
            >
                <template #icon><PlusOutlined /></template>
                 Добавить
            </a-button>
            <a-divider />
        </template> -->
    </a-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type TabsProps } from 'ant-design-vue';
import type { Category } from '@/api/types';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from "dexie";
import { changeCategory, getCategories } from '@/api/db';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { generateUUID } from '@/helpers/helpers';

const callback: TabsProps['onTabScroll'] = val => {
  console.log(val);
};

const activeTab = ref<number>(1);
const newSubCategory = ref<string>('');
const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });

const categories = ref<Category[]>(useObservable(
    liveQuery(getCategories)
));

const categoryNameChanged = (category: Category, item: { name: string }) => {
    changeCategory(category).then(() => {
      messageApi.success('Имя категории изменено.')
    }).catch((e) => {
        console.error(e);
    });
};

const categoryColorChanged = (color: string) => {
    if (color === categories.value[activeTab.value].color) {
        return;
    }

    changeCategory({ ...categories.value[activeTab.value], color }).then((e) => {
        messageApi.success('Цвет категории изменен.');
    }).catch((e) => {
        console.error(e);
    });
};

const removeSubCategory = (category: Category, item: { name: string, key: string }) => {
    const index = category.children?.indexOf(item);
    if (index === -1) {
        console.error('Subcategory not found');
        return;
    }

    let payload: Array<{ name: string, key: string }> = JSON.parse(JSON.stringify(category.children || []));
    payload.splice(index!, 1);
    changeCategory({ ...category, children: payload}).then(() => {
        messageApi.success('Подкатегория удалена.');
    }).catch((e) => {
        console.error(e);
    });
};

const addSubCategory = (category: Category, name: string) => {

    if (!name) {
        messageApi.error('Введите имя подкатегории.');
        return;
    }

    let payload: Array<{ name: string, key: string }> = JSON.parse(JSON.stringify(category.children || []));
    payload.push({ name, key: generateUUID() });
    changeCategory({ ...category, children: payload }).then(() => {
        messageApi.success('Подкатегория добавлена.');
        newSubCategory.value = '';
    }).catch((e) => {
        console.error(e);
    });
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

    .ant-tabs-extra-content {
        padding: 8px;
        width: 100%;
    }

    .ant-tabs-left .ant-divider {
        margin: 8px 0;
    }
</style>