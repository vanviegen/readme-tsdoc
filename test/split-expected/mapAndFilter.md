### mapAndFilter · function

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
