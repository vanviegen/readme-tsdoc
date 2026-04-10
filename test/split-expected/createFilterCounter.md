### createFilterCounter · function

A complex arrow function stored in a constant

**Signature:** `<T>(predicate: (item: T) => boolean) => (items: T[]) => { filtered: T[]; count: number; }`

**Parameters:**

- `predicate` - The filter predicate

**Returns:** A function that filters and counts items
