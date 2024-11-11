import { ParsedCommand } from "./parsed-command";

export type CommandHistory = {
    hash: string;
    command: string | null;
    parseCommand: ParsedCommand;
    output?: string[];
    hide?: boolean;
}[];
