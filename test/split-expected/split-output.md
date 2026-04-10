# Kitchen sink (split)

The following is auto-generated from test/kitchensink.ts

### [processValue](processValue.md) · function

A utility function with multiple overloads

### [mapAndFilter](mapAndFilter.md) · function

A generic utility function for mapping arrays

### [transformObject](transformObject.md) · function

A function with complex parameter types

### [fetchWithRetry](fetchWithRetry.md) · function

An async function with error handling

### [DataProcessor](DataProcessor.md) · abstract class

A comprehensive test class that demonstrates all supported TypeScript constructs
This class serves as a kitchen sink for testing documentation generation.

#### [DataProcessor.config](DataProcessor_config.md) · static property

The global configuration object

#### DataProcessor.activeCount · static property

The number of active processors

**Type:** `number`

#### [DataProcessor.createDefault](DataProcessor_createDefault.md) · static method

Create a new processor instance with default configuration

#### DataProcessor.reset · static method

Reset all static counters and configuration

**Signature:** `() => void`

#### dataProcessor.name · property

The name of this processor instance

**Type:** `string`

#### dataProcessor.status · property

The current processing status

**Type:** `Status`

#### dataProcessor.config · property

Configuration options for this processor

**Type:** `{ batchSize: number; timeout: number; }`

#### [dataProcessor.initialize](DataProcessor_initialize.md) · method

Initialize the processor

#### [dataProcessor.processData](DataProcessor_processData.md) · abstract method

Process a batch of data items

#### dataProcessor.batchSize · getter

Get the current batch size setting

**Type:** `number`

#### dataProcessor.batchSize · setter

Set a new batch size

**Type:** `number`

#### dataProcessor.count · getter

Get the number of items currently stored

**Type:** `number`

#### dataProcessor.addItems · method

Add items to the internal storage

**Signature:** `(items: T[]) => void`

**Parameters:**

- `items: T[]` - The items to add

#### dataProcessor.clearItems · method

Clear all stored items

**Signature:** `() => void`

#### [dataProcessor.process](DataProcessor_process.md) · method

Process method required by TestInterface

#### dataProcessor.cleanup · abstract method

Abstract method for cleanup

**Signature:** `() => Promise<void>`

### [StringDataProcessor](StringDataProcessor.md) · class

A concrete implementation of DataProcessor for string data

#### stringDataProcessor.transformer · property

Transform function applied to each string

**Type:** `(s: string) => string`

#### [stringDataProcessor.processData](StringDataProcessor_processData.md) · method

Process string data by applying the transformer

#### stringDataProcessor.cleanup · method

Clean up resources

**Signature:** `() => Promise<void>`

### [KITCHEN_SINK_CONFIG](KITCHEN_SINK_CONFIG.md) · constant

Configuration constants for the kitchen sink module

### ProcessingMode · constant

A simple enum-like constant object

**Value:** `{ readonly SYNC: "sync"; readonly ASYNC: "async"; readonly BATCH: "batch"; }`

### ProcessingModeType · type

Type for processing modes

**Type:** `typeof ProcessingMode[keyof typeof ProcessingMode]`

### [createFilterCounter](createFilterCounter.md) · function

A complex arrow function stored in a constant

### SUPPORTED_FORMATS · constant

A readonly array constant

**Value:** `readonly ["json", "xml", "csv", "yaml"]`

### SupportedFormat · type

A complex type derived from the constant

**Type:** `typeof SUPPORTED_FORMATS[number]`

### Container · interface

A generic interface for container types

**Type Parameters:**

- `T` - The type of items stored in the container

#### container.items · member

The items in the container

**Type:** `T[]`

#### container.add · member

Add an item to the container

**Type:** `(item: T) => void`

#### container.get · member

Get an item by index

**Type:** `(index: number) => T`

### TestInterface · interface

Helper utilities for testing various TypeScript constructs

#### testInterface.name · member

A required string property

**Type:** `string`

#### testInterface.count · member

An optional number property

**Type:** `number`

#### testInterface.process · member

A method that returns a promise

**Type:** `() => Promise<void>`

### [deepCopy](deepCopy.md) · function

Deep copy the given object considering circular structure.
This function caches all nested objects and its copies.
If it detects circular structure, use cached copy to avoid infinite loop.

