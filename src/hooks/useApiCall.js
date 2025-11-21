import { useState } from "react";

/**
 * Custom hook for handling API calls with consistent error handling
 * Reduces duplicate try-catch-alert code across components
 * 
 * @returns {Object} { callApi, loading, error }
 */
export function useApiCall() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Execute an API call with automatic error handling
     * @param {Function} apiFunc - Async function that makes the API call
     * @param {Object} options - Configuration options
     * @param {boolean} options.silent - If true, don't show alert on error
     * @param {string} options.successMessage - Optional success message to show
     * @param {Function} options.onSuccess - Optional callback on success
     * @param {Function} options.onError - Optional callback on error
     * @returns {Promise} Result of the API call
     */
    const callApi = async (apiFunc, options = {}) => {
        const {
            silent = false,
            successMessage = null,
            onSuccess = null,
            onError = null,
        } = options;

        setLoading(true);
        setError(null);

        try {
            const result = await apiFunc();

            if (successMessage) {
                alert(successMessage);
            }

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (err) {
            const errorMessage = err?.message || "An error occurred";
            setError(errorMessage);

            if (!silent) {
                alert(errorMessage);
            }

            if (onError) {
                onError(err);
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { callApi, loading, error };
}
