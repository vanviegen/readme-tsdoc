import { TestInterface, Container, Status } from './helper.js';

/**
 * A comprehensive test class that demonstrates all supported TypeScript constructs
 * This class serves as a kitchen sink for testing documentation generation.
 * 
 * @example
 * ```typescript
 * const processor = new DataProcessor('test-config');
 * await processor.initialize();
 * const result = processor.processData(['item1', 'item2']);
 * ```
 * 
 * @template T The type of data this processor handles
 * @template R The type of results it produces
 */
export abstract class DataProcessor<T, R = T[]> implements TestInterface {
    /**
     * The global configuration object
     * @example
     * ```typescript
     * console.log(DataProcessor.config.version); // "1.0.0"
     * ```
     */
    static readonly config = {
        version: '1.0.0',
        debug: false,
        maxRetries: 3
    } as const;

    /**
     * The number of active processors
     */
    static activeCount: number = 0;

    /**
     * Create a new processor instance with default configuration
     * @returns A new DataProcessor instance
     * @example
     * ```typescript
     * const processor = DataProcessor.createDefault();
     * ```
     */
    static createDefault(): DataProcessor<string> {
        return new StringDataProcessor('default');
    }

    /**
     * Reset all static counters and configuration
     */
    static reset(): void {
        this.activeCount = 0;
    }

    /**
     * The name of this processor instance
     */
    public readonly name: string;

    /**
     * The current processing status
     */
    public status: Status = 'pending';

    /**
     * Internal data storage
     */
    private _data: T[] = [];

    /**
     * Configuration options for this processor
     */
    protected config: {
        batchSize: number;
        timeout: number;
    };

    /**
     * Create a new DataProcessor
     * @param name A unique name for this processor
     * @param batchSize The number of items to process in each batch (default: 10)
     * @param timeout The timeout in milliseconds (default: 5000)
     */
    constructor(name: string, batchSize: number = 10, timeout: number = 5000) {
        this.name = name;
        this.config = { batchSize, timeout };
        DataProcessor.activeCount++;
    }

    /**
     * Initialize the processor
     * @returns A promise that resolves when initialization is complete
     * @throws ProcessorError if initialization fails
     */
    async initialize(): Promise<void> {
        this.status = 'pending';
        // Simulate async initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        this.status = 'success';
    }

    /**
     * Process a batch of data items
     * @param items The items to process
     * @returns The processed results
     * @throws ProcessorError if processing fails
     * @example
     * ```typescript
     * const results = processor.processData(['a', 'b', 'c']);
     * console.log(results.length); // 3
     * ```
     */
    abstract processData(items: T[]): R;

    /**
     * Get the current batch size setting
     */
    get batchSize(): number {
        return this.config.batchSize;
    }

    /**
     * Set a new batch size
     */
    set batchSize(value: number) {
        if (value <= 0) {
            throw new Error('Batch size must be positive');
        }
        this.config.batchSize = value;
    }

    /**
     * Get the number of items currently stored
     */
    get count(): number {
        return this._data.length;
    }

    /**
     * Add items to the internal storage
     * @param items The items to add
     */
    addItems(items: T[]): void {
        this._data.push(...items);
    }

    /**
     * Clear all stored items
     */
    clearItems(): void {
        this._data.length = 0;
    }

    /**
     * Process method required by TestInterface
     * @returns A promise that resolves when processing is complete
     */
    async process(): Promise<void> {
        if (this._data.length > 0) {
            this.processData(this._data);
        }
    }

    /**
     * Abstract method for cleanup
     */
    abstract cleanup(): Promise<void>;
}

/**
 * A concrete implementation of DataProcessor for string data
 */
export class StringDataProcessor extends DataProcessor<string, string[]> {
    /**
     * Transform function applied to each string
     */
    private transformer: (s: string) => string;

    /**
     * Create a new StringDataProcessor
     * @param name The processor name
     * @param transformer Optional transform function (default: uppercase)
     */
    constructor(name: string, transformer?: (s: string) => string) {
        super(name);
        this.transformer = transformer || ((s) => s.toUpperCase());
    }

    /**
     * Process string data by applying the transformer
     * @param items The strings to process
     * @returns The transformed strings
     */
    processData(items: string[]): string[] {
        return items.map(this.transformer);
    }

    /**
     * Clean up resources
     */
    async cleanup(): Promise<void> {
        this.clearItems();
        this.status = 'pending';
    }
}

/**
 * A utility function with multiple overloads
 * @param value A string value
 * @returns The length of the string
 */
export function processValue(value: string): number;
/**
 * A utility function with multiple overloads
 * @param value An array value
 * @returns The length of the array
 */
export function processValue(value: any[]): number;
/**
 * A utility function with multiple overloads
 * @param value A string or array value
 * @returns The length of the value
 * @example
 * ```typescript
 * const strLen = processValue("hello"); // 5
 * const arrLen = processValue([1, 2, 3]); // 3
 * ```
 */
export function processValue(value: string | any[]): number {
    return value.length;
}

/**
 * A generic utility function for mapping arrays
 * @template T The input type
 * @template U The output type
 * @param items The array to map
 * @param mapper The mapping function
 * @param filter Optional filter function
 * @returns The mapped and optionally filtered results
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const doubled = mapAndFilter(numbers, x => x * 2, x => x > 5);
 * console.log(doubled); // [6, 8, 10]
 * ```
 */
export function mapAndFilter<T, U>(
    items: T[],
    mapper: (item: T, index: number) => U,
    filter?: (item: U, index: number) => boolean
): U[] {
    const mapped = items.map(mapper);
    return filter ? mapped.filter(filter) : mapped;
}

/**
 * A function with complex parameter types
 * @template K The key type
 * @template V The value type
 * @param data The input data object
 * @param keyMapper Function to transform keys
 * @param valueMapper Function to transform values
 * @param options Configuration options
 * @returns A new transformed object
 */
export function transformObject<K extends string | number | symbol, V, NK extends string | number | symbol, NV>(
    data: Record<K, V>,
    keyMapper: (key: K) => NK,
    valueMapper: (value: V, key: K) => NV,
    options: {
        /** Whether to include undefined values */
        includeUndefined?: boolean;
        /** Maximum number of properties to process */
        maxProperties?: number;
    } = {}
): Record<NK, NV> {
    const result = {} as Record<NK, NV>;
    const entries = Object.entries(data) as [K, V][];
    const maxProps = options.maxProperties ?? entries.length;

    for (let i = 0; i < Math.min(entries.length, maxProps); i++) {
        const [key, value] = entries[i];
        const newKey = keyMapper(key);
        const newValue = valueMapper(value, key);
        
        if (options.includeUndefined || newValue !== undefined) {
            result[newKey] = newValue;
        }
    }

    return result;
}

/**
 * An async function with error handling
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The response data
 * @throws FetchError if the request fails
 * @throws TimeoutError if the request times out
 * @example
 * ```typescript
 * try {
 *   const data = await fetchWithRetry('https://api.example.com/data');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Failed to fetch:', error.message);
 * }
 * ```
 */
export async function fetchWithRetry(
    url: string,
    options: {
        /** Number of retry attempts */
        retries?: number;
        /** Timeout in milliseconds */
        timeout?: number;
        /** HTTP headers */
        headers?: Record<string, string>;
    } = {}
): Promise<any> {
    const { retries = 3, timeout = 5000, headers = {} } = options;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            // Simulated fetch logic
            await new Promise(resolve => setTimeout(resolve, 100));
            return { status: 'success', url, attempt };
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
        }
    }
}

/**
 * Configuration constants for the kitchen sink module
 */
export const KITCHEN_SINK_CONFIG = {
    /** Default timeout for operations */
    DEFAULT_TIMEOUT: 30000,
    /** Maximum number of items to process */
    MAX_ITEMS: 1000,
    /** API version */
    API_VERSION: '2.0.0',
    /** Feature flags */
    FEATURES: {
        enableLogging: true,
        enableMetrics: false,
        enableCaching: true
    }
} as const;

/**
 * A simple enum-like constant object
 */
export const ProcessingMode = {
    SYNC: 'sync',
    ASYNC: 'async',
    BATCH: 'batch'
} as const;

/**
 * Type for processing modes
 */
export type ProcessingModeType = typeof ProcessingMode[keyof typeof ProcessingMode];

/**
 * A complex arrow function stored in a constant
 * @param predicate The filter predicate
 * @returns A function that filters and counts items
 */
export const createFilterCounter = <T>(predicate: (item: T) => boolean) => {
    return (items: T[]): { filtered: T[]; count: number } => {
        const filtered = items.filter(predicate);
        return { filtered, count: filtered.length };
    };
};

/**
 * A readonly array constant
 */
export const SUPPORTED_FORMATS = ['json', 'xml', 'csv', 'yaml'] as const;

/**
 * A complex type derived from the constant
 */
export type SupportedFormat = typeof SUPPORTED_FORMATS[number];

// Test re-export from npm package
export { deepCopy } from "fast-deep-copy";
