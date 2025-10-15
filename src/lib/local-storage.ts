/**
 * localStorage utility functions with SSR safety
 * Replaces cookie-based storage for authentication data
 */

/**
 * Get an item from localStorage and parse it as JSON
 */
export function getItem(key: string): string | null {
    if (typeof window === 'undefined') return null

    try {
        return localStorage.getItem(key)
    } catch (error) {
        console.error(`Error getting localStorage item "${key}":`, error)
        return null
    }
}

/**
 * Set an item in localStorage with JSON stringification
 */
export function setItem(key: string, value: any): void {
    if (typeof window === 'undefined') return

    try {
        const stringValue =
            typeof value === 'string' ? value : JSON.stringify(value)
        localStorage.setItem(key, stringValue)
    } catch (error) {
        console.error(`Error setting localStorage item "${key}":`, error)
    }
}

/**
 * Remove an item from localStorage
 */
export function removeItem(key: string): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error(`Error removing localStorage item "${key}":`, error)
    }
}
