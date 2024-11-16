



export function useHash () {
    const hash = (): string  => {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    return { hash };
  }

declare global {
    interface String {
        format: (...args: any[]) => string;
    }
}

String.prototype.format = function (args: { [key: string]: any }): string {
    return this.replace(/{(\w+)}/g, (match, key) => {
        return typeof args[key] != 'undefined' ? args[key] : match;
    });
};