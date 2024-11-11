import { Command } from "../../types/command";
import { useTerminal } from "../useTerminal";


export const clearCommand: Command = {
    name: 'clear',
    description: 'Clears the console',
    options: {},
    execute: () => {
        const { history } = useTerminal();

        history.value.forEach((h) => {
            h.hide = true;
        });

        return [];
    }
};