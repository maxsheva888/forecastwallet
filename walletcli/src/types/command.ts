import { type CommandOption } from './command-option.ts';

export type Command = {
    name: string;
    namespace: string;
    description: string;
    options:  Record<string, string>;
    execute: (args: string[], options: Record<string, string>) => string[];
};
