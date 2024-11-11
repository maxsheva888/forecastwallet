<template>
    <span class="user">{{ user }}</span>
    <span class="at">@</span>
    <span class="host">{{ host }}</span>
    <span class="symbol">:</span>
    <span class="path">{{ path }}</span>
    <span class="symbol">$</span>
</template>

<script setup lang="ts">
import { useTerminal } from '../composables/useTerminal';

const { user, host, path } = useTerminal()

</script>

<style scoped>
.prompt span.user { color: var(--green); }
.prompt span.at { color: var(--foreground); }
.prompt span.host { color: var(--green); }
.prompt span.path { color: var(--purple); }
.prompt span.symbol { color: var(--pink); margin: 0 5px; }
</style>