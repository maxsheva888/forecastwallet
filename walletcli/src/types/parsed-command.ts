
export type CommandOutput = string[];

export type ParsedCommand = {
    arguments: string[],
    options:  Record<string, string>,
};
