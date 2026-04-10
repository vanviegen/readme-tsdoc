#### dataProcessor.processData · abstract method

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
