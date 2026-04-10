### fetchWithRetry · function

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
