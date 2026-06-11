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

### [StringDataProcessor](StringDataProcessor.md) · class

A concrete implementation of DataProcessor for string data

### [KITCHEN_SINK_CONFIG](KITCHEN_SINK_CONFIG.md) · constant

Configuration constants for the kitchen sink module

### ProcessingMode · constant

A simple enum-like constant object

**Value:** `{ readonly SYNC: "sync"; readonly ASYNC: "async"; readonly BATCH: "batch"; }`

### ProcessingModeType · type

Type for processing modes, derived from `ProcessingMode`.

**Type:** `typeof ProcessingMode[keyof typeof ProcessingMode]`

### [createFilterCounter](createFilterCounter.md) · function

A complex arrow function stored in a constant

### SUPPORTED_FORMATS · constant

A readonly array constant

**Value:** `readonly ["json", "xml", "csv", "yaml"]`

### SupportedFormat · type

A complex type derived from the constant

**Type:** `typeof SUPPORTED_FORMATS[number]`

### [Container](Container.md) · interface

A generic interface for container types

### [TestInterface](TestInterface.md) · interface

Helper utilities for testing various TypeScript constructs

### [deepCopy](deepCopy.md) · function

Deep copy the given object considering circular structure.
This function caches all nested objects and its copies.
If it detects circular structure, use cached copy to avoid infinite loop.

