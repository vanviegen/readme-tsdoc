### StringDataProcessor · class

A concrete implementation of DataProcessor for string data

**Constructor Parameters:**

- `name`: The processor name
- `transformer`: Optional transform function (default: uppercase)

#### stringDataProcessor.processData · method

Process string data by applying the transformer

**Signature:** `(items: string[]) => string[]`

**Parameters:**

- `items: string[]` - The strings to process

**Returns:** The transformed strings

#### stringDataProcessor.cleanup · method

Clean up resources

**Signature:** `() => Promise<void>`
