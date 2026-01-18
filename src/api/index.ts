import { getSOILInfo, setSOILItem } from "@/SoilInfo";
import { Tokens } from "@/types";

export * from "./Item";
export * from "./User";

// Request deduplication: prevent multiple simultaneous requests to the same URL
const pendingRequests = new Map<string, Promise<Res<any>>>();

export type Res<T> = {
    data?: T;
    msg: string;
    isError: boolean;
    status: number;
    networkError?: boolean; // true if it's a network/connectivity error
    errorDetails?: string; // Additional error information
};

/**
 * Get the API base URL from environment variables
 * Uses VITE_API_URL if set (in both dev and prod)
 * Otherwise, in development uses Vite proxy (empty string for relative URLs)
 * In production without VITE_API_URL, falls back to relative URLs
 */
function getApiBaseUrl(): string {
    // Use VITE_API_URL if set (works in both dev and prod)
    if (import.meta.env.VITE_API_URL) {
        // Remove trailing slash to avoid double slashes when combining with endpoint
        return import.meta.env.VITE_API_URL.replace(/\/$/, "");
    }
    // Return empty string for relative URLs (works with Vite proxy in dev)
    return "";
}

/**
 * Get API key from environment variables
 * Returns the API key if VITE_API_KEY is set, otherwise returns empty string
 */
function getApiKey(): string {
    return import.meta.env.VITE_API_KEY || "";
}

/**
 * Get API key header name from environment variables
 * Defaults to "X-API-Key" if VITE_API_KEY_HEADER is not set
 */
function getApiKeyHeaderName(): string {
    return import.meta.env.VITE_API_KEY_HEADER || "X-API-Key";
}

/* Higher order function to fetch data from the server */
export async function tryCatchHandler<BodyType, ResponseDataType>(
    url: string,
    body: BodyType = {} as BodyType,
    method: "GET" | "POST" = "POST",
    needAuth: boolean = false,
): Promise<Res<ResponseDataType>> {
    // Prepend API base URL if needed (declare outside try for error handling)
    const baseUrl = getApiBaseUrl();
    let fullUrl: string;
    
    if (url.startsWith("http")) {
        fullUrl = url;
    } else {
        // Ensure proper URL construction (avoid double slashes)
        const base = baseUrl || "";
        const endpoint = url.startsWith("/") ? url : `/${url}`;
        fullUrl = base + endpoint;
    }
    
    // Create a unique request key for deduplication (only for GET requests)
    const requestKey = method === "GET" 
        ? `${method}:${fullUrl}`
        : `${method}:${fullUrl}:${JSON.stringify(body)}`;
    
    // Check if there's already a pending request for this URL
    if (pendingRequests.has(requestKey)) {
        return pendingRequests.get(requestKey)! as Promise<Res<ResponseDataType>>;
    }
    
    // Create the request promise
    const requestPromise = (async () => {
        try {
            // Build headers object
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // Add Authorization header if needed
        if (needAuth) {
            headers.Authorization = `Bearer ${getSOILInfo().userInfo?.accessToken}`;
        }

        // Add API key header if configured
        const apiKey = getApiKey();
        const apiKeyHeaderName = getApiKeyHeaderName();
        if (apiKey) {
            headers[apiKeyHeaderName] = apiKey;
        }
        
        const options: RequestInit = {
            method,
            headers,
        };
        if (method === "POST") {
            options.body = JSON.stringify(body);
        }
        
        // Add timeout to fetch request (30 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        let response: Response;
        try {
            response = await fetch(fullUrl, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            // Check if it's an abort (timeout) or network error
            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                throw new Error("Request timeout: The server did not respond within 30 seconds");
            }
            
            // Re-throw to be caught by outer catch block
            throw fetchError;
        }

        // Check if response is JSON
        let jsonResponse: any;
        try {
            jsonResponse = await response.json();
        } catch (parseError) {
            // If response is not JSON, it might be an HTML error page (404, 500, etc.)
            return {
                msg: `Server returned ${response.status} ${response.statusText}. The API endpoint may not exist or the server is not responding correctly.`,
                isError: true,
                status: response.status,
                networkError: false,
                errorDetails: `Expected JSON but received ${response.headers.get("content-type") || "unknown content type"}`,
            };
        }

        // Handle different API response formats
        // Format 1: {success: boolean, data?: T, error?: string}
        // Format 2: {msg: string, data?: T}
        let responseData: ResponseDataType | undefined;
        let responseMsg: string;
        let isErrorResponse: boolean;

        if (jsonResponse.success !== undefined) {
            // Format 1: {success: boolean, data?: T, error?: string}
            isErrorResponse = !jsonResponse.success;
            responseData = jsonResponse.data;
            responseMsg = jsonResponse.error || jsonResponse.msg || (isErrorResponse ? "API request failed" : "Success");
        } else {
            // Format 2: {msg: string, data?: T} (original format)
            responseData = jsonResponse.data;
            responseMsg = jsonResponse.msg || "No message";
            isErrorResponse = !response.ok;
        }

        // Check if response indicates missing API key
        const errorMsg = responseMsg.toLowerCase();
        if (errorMsg.includes("api key") || errorMsg.includes("missing") && errorMsg.includes("key")) {
            console.warn("[API] API key issue:", responseMsg);
        }

            return {
                data: responseData,
                msg: responseMsg,
                isError: isErrorResponse || !response.ok,
                status: response.status,
                networkError: false,
            };
        } catch (error) {
            // Check if it's a network error
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isNetworkError = error instanceof TypeError && 
                (errorMessage.includes("Failed to fetch") || 
                 errorMessage.includes("NetworkError") ||
                 errorMessage.includes("Network request failed") ||
                 errorMessage.includes("Load failed"));
            
            // Check for CORS errors
            const isCorsError = errorMessage.includes("CORS") || 
                (error instanceof TypeError && errorMessage.includes("Failed to fetch") && 
                 import.meta.env.VITE_API_URL); // Likely CORS if using external URL
            
            // Check for timeout
            const isTimeout = errorMessage.includes("timeout") || 
                errorMessage.includes("aborted");
            
            let userMessage: string;
            if (isTimeout) {
                userMessage = "Request timed out. The server took too long to respond. Please check if the API is accessible.";
            } else if (isCorsError) {
                userMessage = "CORS error: The API server is not allowing requests from this origin. The server needs to allow cross-origin requests from your development URL.";
            } else if (isNetworkError) {
                userMessage = "Unable to connect to the server. Please check:\n- Your internet connection\n- The VITE_API_URL is correct\n- The API server is running and accessible";
            } else {
                userMessage = `An unexpected error occurred: ${errorMessage}`;
            }
            
            // Log error details only for non-network errors (network errors are expected in some cases)
            if (!isNetworkError && !isTimeout) {
                console.error("[API] Error:", errorMessage);
            }
            
            return {
                msg: userMessage,
                isError: true,
                status: 500,
                networkError: isNetworkError || isCorsError || isTimeout,
                errorDetails: errorMessage,
            };
        } finally {
            // Clean up the pending request
            pendingRequests.delete(requestKey);
        }
    })();
    
    // Store the promise for deduplication
    pendingRequests.set(requestKey, requestPromise);
    
    return requestPromise as Promise<Res<ResponseDataType>>;
}

/* Higher order function to fetch data from the server with authorization */
export async function tryCatchHandlerAuth<BodyType, ResponseDataType>(
    url: string,
    body: BodyType = {} as BodyType,
    method: "GET" | "POST" = "POST",
): Promise<Res<ResponseDataType>> {
    const res = await tryCatchHandler<BodyType, ResponseDataType>(
        url,
        body,
        method,
        true,
    );
    if (res.status === 401) {
        // Access token expired
        // So request a new one
        const currAccessToken = getSOILInfo().userInfo?.accessToken ?? "";
        const currRefreshToken = getSOILInfo().userInfo?.refreshToken ?? "";

        const newAccessTokenRes = await tryCatchHandler<Tokens, string>(
            "/api/getNewAccessToken",
            {
                accessToken: currAccessToken,
                refreshToken: currRefreshToken,
            },
        );
        if (!newAccessTokenRes.data || newAccessTokenRes.isError) {
            return {
                msg: "Session expired. Please login again",
                isError: true,
                status: newAccessTokenRes.status,
            };
        }

        // Update the access token
        const userInfo = getSOILInfo().userInfo;
        if (userInfo) {
            setSOILItem("userInfo", {
                ...userInfo,
                accessToken: newAccessTokenRes.data,
            });
        } else {
            console.error("Unexpected error occurred when updating tokens");
        }

        return tryCatchHandler(url, body, method, true);
    }
    return res;
}

/**
 * Test API connectivity by making a simple request
 * Useful for checking if the API is reachable before making actual requests
 * 
 * @param endpoint - Optional endpoint to test (defaults to a simple GET request)
 * @returns Promise that resolves to true if API is reachable, false otherwise
 */
export async function testApiConnectivity(endpoint: string = "/api/health"): Promise<{
    isReachable: boolean;
    message: string;
    status?: number;
    details?: string;
}> {
    try {
        const result = await tryCatchHandler<unknown, unknown>(
            endpoint,
            {},
            "GET",
            false,
        );

        if (result.networkError) {
            return {
                isReachable: false,
                message: "Network error: Cannot reach the API server",
                details: result.errorDetails,
            };
        }

        if (result.status === 404) {
            return {
                isReachable: false,
                message: `API endpoint not found (404). The endpoint "${endpoint}" does not exist.`,
                status: 404,
            };
        }

        if (result.status >= 500) {
            return {
                isReachable: true, // Server is reachable but has errors
                message: `Server error (${result.status}). API is reachable but returned an error.`,
                status: result.status,
            };
        }

        // If we get any response (even errors), the API is reachable
        return {
            isReachable: true,
            message: `API is reachable (Status: ${result.status})`,
            status: result.status,
        };
    } catch (error) {
        return {
            isReachable: false,
            message: "Failed to test API connectivity",
            details: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * Get current API configuration information
 * Useful for debugging API connection issues
 */
export function getApiInfo(): {
    baseUrl: string;
    hasApiKey: boolean;
    apiKeyHeader: string;
    apiKeyLength: number;
    apiKeyPreview: string;
    isProduction: boolean;
    envVars: {
        VITE_API_URL?: string;
        VITE_API_KEY?: string;
        VITE_API_KEY_HEADER?: string;
    };
} {
    const apiKey = getApiKey();
    return {
        baseUrl: getApiBaseUrl() || "Using Vite proxy (development)",
        hasApiKey: !!apiKey,
        apiKeyHeader: getApiKeyHeaderName(),
        apiKeyLength: apiKey ? apiKey.length : 0,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "none",
        isProduction: import.meta.env.PROD,
        envVars: {
            VITE_API_URL: import.meta.env.VITE_API_URL,
            VITE_API_KEY: import.meta.env.VITE_API_KEY ? "***configured***" : undefined,
            VITE_API_KEY_HEADER: import.meta.env.VITE_API_KEY_HEADER,
        },
    };
}
