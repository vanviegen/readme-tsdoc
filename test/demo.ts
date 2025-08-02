/**
 * A utility class for mathematical operations and calculations
 */
export class MathUtils {
    /**
     * The mathematical constant PI
     * @example
     * ```typescript
     * console.log(MathUtils.PI); // 3.141592653589793
     * ```
     */
    static readonly PI = Math.PI;

    /**
     * Calculate the area of a circle
     * @param radius The radius of the circle
     * @returns The area of the circle
     * @throws Error when radius is negative
     * @example
     * ```typescript
     * const area = MathUtils.circleArea(5);
     * console.log(area); // 78.53981633974483
     * ```
     */
    static circleArea(radius: number): number {
        if (radius < 0) {
            throw new Error('Radius cannot be negative');
        }
        return this.PI * radius * radius;
    }

    /**
     * Current calculation precision for rounding operations
     */
    public precision: number = 2;

    /**
     * Create a new MathUtils instance
     * @param precision Number of decimal places for rounding (default: 2)
     */
    constructor(precision: number = 2) {
        this.precision = precision;
    }

    /**
     * Round a number to the specified precision
     * @param value The number to round
     * @returns The rounded number
     * @example
     * ```typescript
     * const math = new MathUtils(3);
     * const rounded = math.round(3.14159);
     * console.log(rounded); // 3.142
     * ```
     */
    round(value: number): number {
        const multiplier = Math.pow(10, this.precision);
        return Math.round(value * multiplier) / multiplier;
    }

    /**
     * Get the current precision setting
     */
    get currentPrecision(): number {
        return this.precision;
    }

    /**
     * Set a new precision value
     */
    set currentPrecision(value: number) {
        this.precision = Math.max(0, Math.floor(value));
    }
}

/**
 * Convert temperature between Celsius and Fahrenheit
 * @param celsius Temperature in Celsius
 * @returns Temperature in Fahrenheit
 * @example
 * ```typescript
 * const fahrenheit = celsiusToFahrenheit(25);
 * console.log(fahrenheit); // 77
 * ```
 */
export function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
}

/**
 * A constant representing the speed of light in vacuum (m/s)
 */
export const SPEED_OF_LIGHT = 299792458;

/**
 * Configuration object for mathematical operations
 */
export const CONFIG = {
    /** Default precision for calculations */
    defaultPrecision: 2,
    /** Whether to use strict mode for error checking */
    strictMode: true,
    /** Maximum number of iterations for iterative calculations */
    maxIterations: 1000
} as const;

/**
 * Generic function to find the maximum value in an array
 * @template T The type of elements in the array
 * @param items Array of items to search
 * @param compareFn Comparison function to determine order
 * @returns The maximum item, or undefined if array is empty
 * @example
 * ```typescript
 * const numbers = [1, 5, 3, 9, 2];
 * const max = findMax(numbers, (a, b) => a - b);
 * console.log(max); // 9
 * ```
 */
export function findMax<T>(items: T[], compareFn: (a: T, b: T) => number): T | undefined {
    if (items.length === 0) return undefined;
    
    return items.reduce((max, current) => 
        compareFn(current, max) > 0 ? current : max
    );
}
