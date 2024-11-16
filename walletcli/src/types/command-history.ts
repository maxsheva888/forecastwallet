import { ParsedCommand } from "./parsed-command";

export type CommandHistory = {
    hash: string;
    command: string;
    parseCommand: ParsedCommand;
    output?: string[];
    hide?: boolean;
}[];
