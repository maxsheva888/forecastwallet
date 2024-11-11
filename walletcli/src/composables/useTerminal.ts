import { computed, onMounted, reactive, ref } from 'vue';
import { ParsedCommand } from '../types/parsed-command';
import { type CommandHistory } from '../types/command-history';
import { useHash } from './utils/useHash';
import { useCommand } from './useCommand';
import { type Command } from '../types/command';

const history = reactive<CommandHistory>([]);

const user = ref('user');
const host = ref('ubuntu');
const path = ref('~');

const waiting = ref(false);

const UIHookAfterCommandExecuted = () => {
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 30);
};

export function useTerminal() {

    const { hash } = useHash();
    const { parse, findCommand, register, execute } = useCommand();

    const filteredHistory = computed<CommandHistory>(() => {
        return history.filter((h) => !h.hide);
    });

    const pushCommand = (command: string) => {
        waiting.value = true;

        const _hash: string = hash();
        const parseCommand: ParsedCommand = parse(command);

        const _command = findCommand(parseCommand);

        if (command === '') {
            history.push({
                hash: _hash,
                command,
                parseCommand,
                output: []
            });
        } else {
            history.push({
                hash: _hash,
                command,
                parseCommand,
                output: execute(_command, parseCommand)
            });
        }

        waiting.value = false;

        console.log('history', history);

        UIHookAfterCommandExecuted();
    };

    const registerCommand = (command: Command) => {
        register(command);
    };


    return {
        history: filteredHistory,
        fullHistory: history,
        pushCommand,
        registerCommand,
        user,
        host,
        path,
        waiting
    };
}
