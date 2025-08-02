/**
 * Helper utilities for testing various TypeScript constructs
 */

/**
 * A simple interface for testing interface documentation
 */
export interface TestInterface {
    /** A required string property */
    name: string;
    /** An optional number property */
    count?: number;
    /** A method that returns a promise */
    process(): Promise<void>;
}

/**
 * A generic interface for container types
 * @template T The type of items stored in the container
 */
export interface Container<T> {
    /** The items in the container */
    items: T[];
    /** Add an item to the container */
    add(item: T): void;
    /** Get an item by index */
    get(index: number): T | undefined;
}

/**
 * A union type for different states
 */
export type Status = 'pending' | 'success' | 'error';

/**
 * A mapped type example
 * @template T The base type to make optional
 */
export type Optional<T> = {
    [K in keyof T]?: T[K];
};

/**
 * A conditional type example
 * @template T The type to check
 */
export type IsString<T> = T extends string ? true : false;

/**
 * A utility type for function parameters
 * @template F The function type
 */
export type Parameters<F> = F extends (...args: infer P) => any ? P : never;

/**
 * Some external API we're wrapping
 */
declare const externalAPI: {
    connect: (host: string, port: number) => Promise<void>;
    disconnect: () => void;
    send: (data: string) => Promise<string>;
};

/**
 * Wrapped connection function with better error handling
 * @param host The hostname to connect to
 * @param port The port number
 * @returns A promise that resolves when connected
 * @throws ConnectionError if the connection fails
 */
export const connect = externalAPI.connect as (
    host: string,
    port: number
) => Promise<void>;

/**
 * Wrapped disconnect function
 */
export const disconnect = externalAPI.disconnect as () => void;

/**
 * A re-exported constant from an external module
 */
export const DEFAULT_PORT = 8080;

/**
 * A basic constant for testing
 */
export const API_VERSION = '1.0.0';
