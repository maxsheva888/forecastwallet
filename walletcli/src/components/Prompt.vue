<template>
    <template
        v-for="(item, index) in history"
        :key="index"
    >
        <div class="prompt">
            <PromptPrefix /><span class="command-output">{{ item.command }}</span>
        </div>
        <div v-for="(row, index) in item.output" class="output" v-html="row" />
    </template>
    <div v-if="!waiting" class="prompt" id="current-prompt">
        <PromptPrefix /><Input />
    </div>
</template>

<script lang="ts" setup>
import { useTerminal } from "../composables/useTerminal";
import Input from './Input.vue';
import PromptPrefix from './PromptPrefix.vue';

const { history, waiting } = useTerminal()

</script>

<style>


.prompt {
    color: var(--green);
    display: flex;
    align-items: center;
}

.output {
    line-height: 1.3;
    white-space: pre-wrap;
}

.output .error {
    color: var(--red);
}

.command-output {
    color: #fff;
}


</style>
