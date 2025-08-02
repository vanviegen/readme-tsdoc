
The following is auto-generated from test/trivial.ts:

### answer · [constant](https://github.com/me/example/blob/main/test/trivial.ts#L2)

The universe and everything...

**Value:** `42`

# Trivial

The following is auto-generated from test/trivial.ts:

### answer · [constant](https://github.com/me/example/blob/main/test/trivial.ts#L2)

The universe and everything...

**Value:** `42`

## This section..

should be replaced.

# Trivial again

## But at a

### Deeper indent level

And with a preceding comment.

The following is auto-generated from test/trivial.ts:

### answer · [constant](https://github.com/me/example/blob/main/test/trivial.ts#L2)

The universe and everything...

**Value:** `42`

# Kitchen sink

The following is auto-generated from test/kitchensink.ts

### processValue · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L212)

A utility function with multiple overloads

**Signature:** `{ (value: string): number; (value: any[]): number; }`

**Parameters:**

- `value: string` - A string value

**Returns:** The length of the string

### mapAndFilter · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L248)

A generic utility function for mapping arrays

**Signature:** `<T, U>(items: T[], mapper: (item: T, index: number) => U, filter?: (item: U, index: number) => boolean) => U[]`

**Type Parameters:**

- `T` - The input type
- `U` - The output type

**Parameters:**

- `items: T[]` - The array to map
- `mapper: (item: T, index: number) => U` - The mapping function
- `filter?: (item: U, index: number) => boolean` - Optional filter function

**Returns:** The mapped and optionally filtered results

**Examples:**

```typescript
const numbers = [1, 2, 3, 4, 5];
const doubled = mapAndFilter(numbers, x => x * 2, x => x > 5);
console.log(doubled); // [6, 8, 10]
```

### transformObject · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L267)

A function with complex parameter types

**Signature:** `<K extends string | number | symbol, V, NK extends string | number | symbol, NV>(data: Record<K, V>, keyMapper: (key: K) => NK, valueMapper: (value: V, key: K) => NV, options?: { ...; }) => Record<...>`

**Type Parameters:**

- `K extends string | number | symbol` - The key type
- `V` - The value type
- `NK extends string | number | symbol`
- `NV`

**Parameters:**

- `data: Record<K, V>` - The input data object
- `keyMapper: (key: K) => NK` - Function to transform keys
- `valueMapper: (value: V, key: K) => NV` - Function to transform values
- `options: {
        /** Whether to include undefined values */
        includeUndefined?: boolean;
        /** Maximum number of properties to process */
        maxProperties?: number;
    }` (optional) - Configuration options

**Returns:** A new transformed object

### fetchWithRetry · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L312)

An async function with error handling

**Signature:** `(url: string, options?: { retries?: number; timeout?: number; headers?: Record<string, string>; }) => Promise<any>`

**Parameters:**

- `url: string` - The URL to fetch
- `options: {
        /** Number of retry attempts */
        retries?: number;
        /** Timeout in milliseconds */
        timeout?: number;
        /** HTTP headers */
        headers?: Record<string, string>;
    }` (optional) - Fetch options

**Returns:** The response data

**Throws:**

- FetchError if the request fails
- TimeoutError if the request times out

**Examples:**

```typescript
try {
  const data = await fetchWithRetry('https://api.example.com/data');
  console.log(data);
} catch (error) {
  console.error('Failed to fetch:', error.message);
}
```

### DataProcessor · [abstract class](https://github.com/me/example/blob/main/test/kitchensink.ts#L17)

A comprehensive test class that demonstrates all supported TypeScript constructs
This class serves as a kitchen sink for testing documentation generation.

**Type Parameters:**

- `T` - The type of data this processor handles
- `R = T[]` - The type of results it produces

**Examples:**

```typescript
const processor = new DataProcessor('test-config');
await processor.initialize();
const result = processor.processData(['item1', 'item2']);
```

**Constructor Parameters:**

- `name`: A unique name for this processor
- `batchSize`: The number of items to process in each batch (default: 10)
- `timeout`: The timeout in milliseconds (default: 5000)

#### DataProcessor.config · [static property](https://github.com/me/example/blob/main/test/kitchensink.ts#L25)

The global configuration object

**Type:** `{ readonly version: "1.0.0"; readonly debug: false; readonly maxRetries: 3; }`

**Examples:**

```typescript
console.log(DataProcessor.config.version); // "1.0.0"
```

#### DataProcessor.activeCount · [static property](https://github.com/me/example/blob/main/test/kitchensink.ts#L34)

The number of active processors

**Type:** `number`

#### DataProcessor.createDefault · [static method](https://github.com/me/example/blob/main/test/kitchensink.ts#L44)

Create a new processor instance with default configuration

**Signature:** `() => DataProcessor<string, string[]>`

**Parameters:**


**Returns:** A new DataProcessor instance

**Examples:**

```typescript
const processor = DataProcessor.createDefault();
```

#### DataProcessor.reset · [static method](https://github.com/me/example/blob/main/test/kitchensink.ts#L51)

Reset all static counters and configuration

**Signature:** `() => void`

**Parameters:**


#### dataProcessor.name · [property](https://github.com/me/example/blob/main/test/kitchensink.ts#L58)

The name of this processor instance

**Type:** `string`

#### dataProcessor.status · [property](https://github.com/me/example/blob/main/test/kitchensink.ts#L63)

The current processing status

**Type:** `Status`

#### dataProcessor.config · [property](https://github.com/me/example/blob/main/test/kitchensink.ts#L73)

Configuration options for this processor

**Type:** `{ batchSize: number; timeout: number; }`

#### dataProcessor.initialize · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L95)

Initialize the processor

**Signature:** `() => Promise<void>`

**Parameters:**


**Returns:** A promise that resolves when initialization is complete

**Throws:**

- ProcessorError if initialization fails

#### dataProcessor.processData · [abstract method](https://github.com/me/example/blob/main/test/kitchensink.ts#L113)

Process a batch of data items

**Signature:** `(items: T[]) => R`

**Parameters:**

- `items: T[]` - The items to process

**Returns:** The processed results

**Throws:**

- ProcessorError if processing fails

**Examples:**

```typescript
const results = processor.processData(['a', 'b', 'c']);
console.log(results.length); // 3
```

#### dataProcessor.batchSize · [getter](https://github.com/me/example/blob/main/test/kitchensink.ts#L118)

Get the current batch size setting

**Type:** `number`

#### dataProcessor.batchSize · [setter](https://github.com/me/example/blob/main/test/kitchensink.ts#L125)

Set a new batch size

**Type:** `number`

#### dataProcessor.count · [getter](https://github.com/me/example/blob/main/test/kitchensink.ts#L135)

Get the number of items currently stored

**Type:** `number`

#### dataProcessor.addItems · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L143)

Add items to the internal storage

**Signature:** `(items: T[]) => void`

**Parameters:**

- `items: T[]` - The items to add

#### dataProcessor.clearItems · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L150)

Clear all stored items

**Signature:** `() => void`

**Parameters:**


#### dataProcessor.process · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L158)

Process method required by TestInterface

**Signature:** `() => Promise<void>`

**Parameters:**


**Returns:** A promise that resolves when processing is complete

#### dataProcessor.cleanup · [abstract method](https://github.com/me/example/blob/main/test/kitchensink.ts#L167)

Abstract method for cleanup

**Signature:** `() => Promise<void>`

**Parameters:**


### StringDataProcessor · [class](https://github.com/me/example/blob/main/test/kitchensink.ts#L173)

A concrete implementation of DataProcessor for string data

**Constructor Parameters:**

- `name`: The processor name
- `transformer`: Optional transform function (default: uppercase)

#### stringDataProcessor.transformer · [property](https://github.com/me/example/blob/main/test/kitchensink.ts#L177)

Transform function applied to each string

**Type:** `(s: string) => string`

#### stringDataProcessor.processData · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L194)

Process string data by applying the transformer

**Signature:** `(items: string[]) => string[]`

**Parameters:**

- `items: string[]` - The strings to process

**Returns:** The transformed strings

#### stringDataProcessor.cleanup · [method](https://github.com/me/example/blob/main/test/kitchensink.ts#L201)

Clean up resources

**Signature:** `() => Promise<void>`

**Parameters:**


### KITCHEN_SINK_CONFIG · [constant](https://github.com/me/example/blob/main/test/kitchensink.ts#L341)

Configuration constants for the kitchen sink module

**Value:** `{ readonly DEFAULT_TIMEOUT: 30000; readonly MAX_ITEMS: 1000; readonly API_VERSION: "2.0.0"; readonly FEATURES: { readonly enableLogging: true; readonly enableMetrics: false; readonly enableCaching: true; }; }`

### ProcessingMode · [constant](https://github.com/me/example/blob/main/test/kitchensink.ts#L359)

A simple enum-like constant object

**Value:** `{ readonly SYNC: "sync"; readonly ASYNC: "async"; readonly BATCH: "batch"; }`

### ProcessingModeType · [type](https://github.com/me/example/blob/main/test/kitchensink.ts#L368)

Type for processing modes

**Type:** `typeof ProcessingMode[keyof typeof ProcessingMode]`

### createFilterCounter · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L375)

A complex arrow function stored in a constant

**Signature:** `<T>(predicate: (item: T) => boolean) => (items: T[]) => { filtered: T[]; count: number; }`

**Parameters:**

- `predicate` - The filter predicate

**Returns:** A function that filters and counts items

### SUPPORTED_FORMATS · [constant](https://github.com/me/example/blob/main/test/kitchensink.ts#L385)

A readonly array constant

**Value:** `readonly ["json", "xml", "csv", "yaml"]`

### SupportedFormat · [type](https://github.com/me/example/blob/main/test/kitchensink.ts#L390)

A complex type derived from the constant

**Type:** `typeof SUPPORTED_FORMATS[number]`

### deepCopy · [function](https://github.com/me/example/blob/main/test/kitchensink.ts#L9)

Deep copy the given object considering circular structure.
This function caches all nested objects and its copies.
If it detects circular structure, use cached copy to avoid infinite loop.

**Signature:** `<T>(obj: T, cache?: any[]) => T`

**Type Parameters:**

- `T`

**Parameters:**

- `obj: T`
- `cache?: any[]`

