import { useState, useEffect } from 'react'
import { useUsersSearch } from './useOrderFormData'

/**
 * Custom hook for debounced user search with initial users loading
 */
export function useDebouncedUserSearch(debounceMs: number = 300) {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    // Debounce the search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setIsSearching(false)
        }, debounceMs)

        if (searchTerm) {
            setIsSearching(true)
        }

        return () => clearTimeout(timer)
    }, [searchTerm, debounceMs])

    // Use the search hook with debounced term
    const { usersData, usersLoading, usersError } = useUsersSearch(debouncedSearchTerm)

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
    }

    const clearSearch = () => {
        setSearchTerm('')
        setDebouncedSearchTerm('')
        setIsSearching(false)
    }

    return {
        searchTerm,
        usersData,
        usersLoading: usersLoading || isSearching,
        usersError,
        handleSearchChange,
        clearSearch,
        isSearching,
    }
}
