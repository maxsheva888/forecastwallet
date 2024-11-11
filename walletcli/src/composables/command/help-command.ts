import { Command } from "../../types/command";
import { useCommand } from "../useCommand";



export const helpCommand: Command = {
    name: "help",
    namespace: "help",
    description: "Show help",
    options: {
        "--command": "Show help for a specific command",
    },
    execute: (args: string[], options: Record<string, string>): string[] => {
        const { registeredCommands, } = useCommand();

        const [, ..._args] = args;
    
        let list = [];
        if(_args.length === 0) {
            list = registeredCommands.value
        } else {
            list = registeredCommands.value.filter(c => {
                if (_args.length > 1)
                    return c.namespace === _args[0] && c.name === _args[1];
    
                return c.name === _args[0];
            })
        }

        const output = list.map((c) => {
            let name = !c.namespace || c.name === c.namespace ? c.name : `${c.namespace} ${c.name}`;

            return [
                `<span>${name}<span>:`,
                `&nbsp;&nbsp;<span style="color: var(--comment)">${c.description}</span>`,
            ]
        });
        return output.length ? output.flat() : [
            `command '${_args.join(' ')}' not found.`
        ];
    },
}
