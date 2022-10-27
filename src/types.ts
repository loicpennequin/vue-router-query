export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export type AnyRecord = Record<string, any>;

export type AnyFunction = (...args: any[]) => any;
