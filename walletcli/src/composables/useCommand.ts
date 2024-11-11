import { computed, reactive } from "vue";
import { CommandOutput, type ParsedCommand } from "../types/parsed-command";
import { Command } from "../types/command";

const registeredCommands = reactive<Command[]>([]);

export function useCommand() {

    const _registeredCommands = computed<Command[]>(() => registeredCommands);

    // wallet add -e 200 -c food -d 08-11-2024 -t lunch fastfood -m "test description of expense"
    // help wallet add
    const parse = (command: string): ParsedCommand => {
        const [...args] = command.split(' ');
        const _arguments: string[] = [];
        const options: Record<string, string> = {};

        let currentOption = '';
        for (const arg of args) {
            if (arg.startsWith('-')) {
                currentOption = arg;
                options[currentOption] = '';
            } else if (currentOption) {
                options[currentOption] = options[currentOption]
                    ? `${options[currentOption]} ${arg}`
                    : arg;
            } else {
                _arguments.push(arg);
            }
        }

        return {
            arguments: _arguments,
            options
        };
    }

    const register = (command: Command) => {
        registeredCommands.push(command);
    }

    const findCommand = (command: ParsedCommand): Command | null => {
        const findsList: Command[] = [];
        const arg = command.arguments;

        const findCommandByNamespaseAndName = (c: Command) => (c. namespace === arg[0] && c.name === arg[1]) && findsList.push(c);
        const findCommandByNamespaseOrName = (c: Command) => (c.namespace === arg[0] || c.name === arg[0]) && findsList.push(c);

        _registeredCommands.value.forEach(findCommandByNamespaseAndName);

        if (!findsList.length) {
            _registeredCommands.value.forEach(findCommandByNamespaseOrName);
        }

        console.log('find commansd:', findsList)

        return findsList?.at(0) ?? null;
    };

    const execute = (command: Command | null, parsedCommand: ParsedCommand): CommandOutput => {
        if (!command) {
            return [
                `${parsedCommand.arguments.join(' ')}: command not found`,
                'Type "help" to see the list of available commands'
            ];
        }

        return command.execute(parsedCommand.arguments, parsedCommand.options);
    };


    return {
        parse,
        execute,
        findCommand,
        register,
        registeredCommands: _registeredCommands
    };
}