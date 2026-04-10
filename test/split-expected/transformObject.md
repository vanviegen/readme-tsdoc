### transformObject · function

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
