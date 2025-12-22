import { getSOILInfo, setSOILItem } from "@/SoilInfo";
import { Tokens } from "@shared/types";

export * from "./Item";
export * from "./User";

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
 * In development, uses Vite proxy (empty string for relative URLs)
 * In production, uses VITE_API_URL if set, otherwise falls back to relative URLs
 */
function getApiBaseUrl(): string {
    // In development, Vite proxy handles /api routes
    // In production, use VITE_API_URL if set
    if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
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
    try {
        // Prepend API base URL if needed
        const fullUrl = url.startsWith("http") ? url : `${getApiBaseUrl()}${url}`;
        
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
            console.log(`[API] Adding API key header: ${apiKeyHeaderName}`);
        } else {
            console.warn("[API] No API key configured. Set VITE_API_KEY in your environment variables if your API requires it.");
        }
        
        const options: RequestInit = {
            method,
            headers,
        };
        if (method === "POST") {
            options.body = JSON.stringify(body);
        }
        
        // Log request details for debugging
        console.log("[API] Request:", {
            url: fullUrl,
            method,
            headers: Object.keys(headers),
            hasApiKey: !!apiKey,
            apiKeyHeader: apiKey ? apiKeyHeaderName : "none",
        });
        
        const response = await fetch(fullUrl, options);

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

        // Log response details including any error messages about API key
        console.log("[API] Response:", {
            url: fullUrl,
            status: response.status,
            statusText: response.statusText,
            response: jsonResponse,
            parsedData: {
                hasData: !!responseData,
                dataLength: Array.isArray(responseData) ? responseData.length : responseData ? 1 : 0,
                msg: responseMsg,
                isError: isErrorResponse,
            },
            headersSent: {
                hasApiKey: !!apiKey,
                apiKeyHeader: apiKey ? apiKeyHeaderName : "none",
                hasAuth: needAuth,
            },
        });
        
        // Check if response indicates missing API key
        const errorMsg = responseMsg.toLowerCase();
        if (errorMsg.includes("api key") || errorMsg.includes("missing") && errorMsg.includes("key")) {
            console.warn("[API] ⚠️ API key issue detected in response:", responseMsg);
            console.warn("[API] Current API key configuration:", {
                hasApiKey: !!apiKey,
                apiKeyHeader: apiKeyHeaderName,
                apiKeyLength: apiKey ? apiKey.length : 0,
            });
        }

        return {
            data: responseData,
            msg: responseMsg,
            isError: isErrorResponse || !response.ok,
            status: response.status,
            networkError: false,
        };
    } catch (error) {
        console.error("API Error:", error); // Only for debugging purposes
        
        // Check if it's a network error
        const isNetworkError = error instanceof TypeError && 
            (error.message.includes("Failed to fetch") || 
             error.message.includes("NetworkError") ||
             error.message.includes("Network request failed"));
        
        return {
            msg: isNetworkError 
                ? "Unable to connect to the server. Please check your internet connection or API configuration."
                : "An unexpected error occurred.",
            isError: true,
            status: 500,
            networkError: isNetworkError,
            errorDetails: error instanceof Error ? error.message : String(error),
        };
    }
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
    console.log(res);
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
        console.log("getting new access token");
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
