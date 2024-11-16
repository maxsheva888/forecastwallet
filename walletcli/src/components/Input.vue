<template>
    <span class="input-container" ref="containerRef">
        <span
            v-for="char in value"
            ref="spanRefs"
            class="command-input"
        >
            {{ char }}
        </span>
        <div ref="cursorRef" id="cursor"></div>
    </span>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef, computed } from 'vue';
import { useTerminal } from '../composables/useTerminal';
import { CommandHistory } from '../types/command-history';

const value = ref('');
const cursorPosition = ref<number>(0);
const previousComandIndex = ref<number>(0);

const { pushCommand, fullHistory } = useTerminal();
const filteredHistory = computed<CommandHistory>(() => fullHistory.filter((item) => 
    item.command.trim().length
));

const setPreviousCommand = () => {
    if (!filteredHistory.value.length) {
        return;
    }

    previousComandIndex.value = previousComandIndex.value === 0
        ? filteredHistory.value.length - 1
        : previousComandIndex.value - 1;

    value.value = filteredHistory.value[previousComandIndex.value]?.command ?? '';
};

const pushCommandValue = async () => {
    await pushCommand(value.value);
    value.value = '';
};


const containerRef = useTemplateRef<HTMLElement | null>('contaonerRef');
const cursorRef = useTemplateRef<HTMLElement | null>('cursorRef');
const spanRefs = useTemplateRef<HTMLElement[] | null>('spanRefs');

const moveCursor = (direction: 'left' | 'right' | 'start' | 'end' | 'to', to?: number) => {
    const directions = {
        left: () => cursorPosition.value = cursorPosition.value === 0 ? value.value.length : cursorPosition.value - 1,
        right: () => cursorPosition.value = cursorPosition.value === value.value.length ? 0 : cursorPosition.value + 1,
        start: () => cursorPosition.value = 0,
        end: () => cursorPosition.value = value.value.length,
        to: (newPosition: number) => cursorPosition.value = newPosition > value.value.length ? value.value.length : newPosition,
    };

    directions[direction]?.(to!);

    if (cursorRef.value) {
        cursorRef.value.style.left = `${cursorPosition.value * 8.1}px`;
    }
};
const moveToPreviousWord = () => {
    const before = value.value.slice(0, cursorPosition.value).split(' ');

    if (before.length === 1) {
        moveCursor('start');
        return;
    }

    const lastWord = before[before.length - 1];
    moveCursor('to', cursorPosition.value - lastWord.length - 1);
};
const moveToNextWord = () => {
    const after = value.value.slice(cursorPosition.value).split(' ');
    const firstWord = after[0];
    moveCursor('to', cursorPosition.value + firstWord.length + 1);
};

const addChar = (char: string) => {
    value.value = value.value.slice(0, cursorPosition.value) + char + value.value.slice(cursorPosition.value);
};
const removeChar = (direction: 'before' | 'after') => {
    if (direction === 'before' && cursorPosition.value > 0) {
        value.value = value.value.slice(0, cursorPosition.value - 1) + value.value.slice(cursorPosition.value);
        moveCursor('left');
    } else if (direction === 'after' && cursorPosition.value < value.value.length) {
        value.value = value.value.slice(0, cursorPosition.value) + value.value.slice(cursorPosition.value + 1);
    }
};
const removeWord = (direction: 'before' | 'after') => {
    if (direction === 'before') {
        const before = value.value.slice(0, cursorPosition.value).split(' ');

        if (before.length === 1) {
            value.value = value.value.slice(cursorPosition.value);
            moveCursor('start');
            return;
        }

        const lastWord = before[before.length - 1];
        value.value = value.value.slice(0, cursorPosition.value - lastWord.length - 1) + value.value.slice(cursorPosition.value);
        moveCursor('to', cursorPosition.value - lastWord.length - 1);
    } else if (direction === 'after') {
        const after = value.value.slice(cursorPosition.value).split(' ');
        const firstWord = after[0];
        value.value = value.value.slice(0, cursorPosition.value) + value.value.slice(cursorPosition.value + firstWord.length);
        moveCursor('to', cursorPosition.value);
    }
};

const handleInput = async (event: KeyboardEvent) => {
    const skipKeys = [
        'Shift', 'ShiftLeft', 'ShiftRight', 'Control', 'ControlLeft', 'ControlRight', 'Alt', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
        'ContextMenu', 'CapsLock', 'NumLock', 'ScrollLock', 'Pause', 'Insert', 'Home', 'PageUp', 'PageDown', 'Delete', 'End',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrintScreen', 'ScrollLock', 'Pause', 'Escape',
    ];

    const prevent = () => {
        event.preventDefault();
        event.stopPropagation();
        return true;
    };

    if (event.key === 'Enter' && prevent()) {
        pushCommandValue();
        moveCursor('start');
    } else
    if (event.key === 'ArrowUp' && prevent()) {
        setPreviousCommand();
    } else
    if (event.key === 'ArrowLeft' && prevent()) {
        moveCursor('left');
    } else
    if (event.key === 'ArrowRight' && prevent()) {
        moveCursor('right');
    } else
    if (event.key === 'ArrowDown' && prevent()) {
        if (event.ctrlKey) {
            moveToNextWord();
        } else {
            moveToPreviousWord();
        }
    } else
    if (event.key === 'Home' && prevent()) {
        moveCursor('start');
    } else
    if (event.key === 'End' && prevent()) {
        moveCursor('end');
    } else
    if (event.key === 'Tab') {
        // tab
    } else
    if (event.key === 'Backspace' && prevent()) {
        removeChar('before');
    } else
    if (event.key === 'Delete' && prevent()) {
        removeChar('after');
    } else
    if (event.ctrlKey && event.key === 'd' && prevent()) {
        location.reload();
    } else
    if (event.ctrlKey && event.key === 'x' && prevent()) {
        removeWord('before');
    } else
    if (event.key === 'F12') {
        // open dev tools
    } else
    if (!skipKeys.includes(event.code) && prevent()) {
        addChar(event.key);
        moveCursor('right');
    }

    console.log(event);
};

onMounted(() => {
    document.addEventListener('keydown', handleInput);
});

</script>

<style scoped>
    .input-container {
        position: relative;
        height: 16px;
    }
    .command-input {
        background: transparent;
        border: none;
        color: var(--foreground);
        font-family: 'Ubuntu Mono', monospace;
        font-size: 1rem;
        outline: none;
    }

    #cursor {
        position: absolute;
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
