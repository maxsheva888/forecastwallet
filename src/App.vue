<template>
        <a-row>
            <a-col :span="12" :offset="6">
                <a-flex justify="space-between" align="center">
                        <h1>Forecast Wallet</h1>
                        <a-auto-complete
                            v-model:value="searchValue"
                            :bordered="false"
                            :style="{ width: '50%' }"
                            suffix="SearchOutlined"
                            placeholder="Search"
                        />
                        <a-statistic title="Balance" prefix="zł" :value="balance" />
                </a-flex>
            </a-col>
        </a-row>
        <a-col :span="12" :offset="6">
            <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />

            <br />

            <RouterView />

        </a-col>
</template>


<script lang="ts" setup>
    import { h, ref, watch } from 'vue';
    import { RouterView, useRoute } from 'vue-router'
    import { type MenuProps } from 'ant-design-vue';
    import { FormOutlined, LineChartOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue';
    import { getCurrentBalance } from './api/db';
    import { useObservable } from '@vueuse/rxjs';
    import { liveQuery } from "dexie";
import router from './router';

    const balance = ref<number>(useObservable<number>(
        liveQuery(getCurrentBalance)
    ));
    const route = useRoute();

    watch(
        () => route.name,
        value => { current.value = [value as string]; }
    );

    const searchValue = ref<string>('');
    const current = ref<string[]>([route.name as string]);
    const items = ref<MenuProps['items']>([
        {
            key: 'home',
            icon: () => h(FormOutlined),
            label: 'Записи',
            title: 'Записи',
            onClick: () => {
                router.push({ name: 'home' });
            }
        },
        {
            key: 'forecast',
            icon: () => h(LineChartOutlined),
            disabled: true,
            label: 'Прогноз',
            title: 'Прогноз',
        },
        {
            key: 'categories',
            icon: () => h(AppstoreAddOutlined),
            label: 'Категории',
            title: 'Категории',
            onClick: () => {
                router.push({ name: 'categories' });
            }
        }
    ]);

</script>

<style scoped></style>
