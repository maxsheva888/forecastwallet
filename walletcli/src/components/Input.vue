<template>
    <input
        v-model="value"
        ref="input"
        type="text"
        class="command-input"
        id="command-input"
        autocomplete="off"
        spellcheck="false"
        @keydown="handleInput"
    >
</template>

<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue';
import { useTerminal } from '../composables/useTerminal';

const value = ref('');
const input = useTemplateRef('input');

const { pushCommand, fullHistory } = useTerminal();
const lastComandIndex = ref<number>(fullHistory.length - 1);

const handleInput = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        await pushCommand(value.value)
        value.value = '';
        setTimeout(() => {
            lastComandIndex.value = fullHistory.length - 1;
        }, 100)
    }

    if (event.key === 'ArrowUp') {
        lastComandIndex.value = lastComandIndex.value === 0
            ? fullHistory.length - 1
            : lastComandIndex.value - 1;
 
        value.value = fullHistory[lastComandIndex.value]?.command ?? '';
    }

    //console.log(event.key);
};


onMounted(() => {
    input.value?.focus();
});

</script>

<style scoped>
    .command-input {
        background: transparent;
        border: none;
        color: var(--foreground);
        font-family: 'Ubuntu Mono', monospace;
        font-size: 1rem;
        width: 100%;
        outline: none;
    }

    #cursor {
        display: inline-block;
        width: 8px;
        height: 15px;
        background: var(--foreground);
        animation: blink 1s infinite;
        margin-left: 1px;
    }

    @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
    }
</style>
