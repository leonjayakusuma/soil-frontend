/**
 * Utility functions and examples for testing API connectivity
 * 
 * You can use these in:
 * 1. Browser console: import { testApiConnectivity, getApiInfo } from './api'
 * 2. React components: import { testApiConnectivity, getApiInfo } from '@/api'
 * 3. Debugging: Call these functions to check API status
 */

import { testApiConnectivity, getApiInfo } from "./index";

/**
 * Example: Test API connectivity and log results
 * Run this in browser console or call from a component
 */
export async function checkApiStatus() {
    console.log("=== API Configuration ===");
    const apiInfo = getApiInfo();
    console.table(apiInfo);

    console.log("\n=== Testing API Connectivity ===");
    
    // Test with a common endpoint (adjust based on your API)
    const healthCheck = await testApiConnectivity("/api/health");
    console.log("Health check:", healthCheck);

    // If health endpoint doesn't exist, try a simple endpoint
    if (!healthCheck.isReachable) {
        console.log("\nTrying alternative endpoint...");
        const altCheck = await testApiConnectivity("/api/allItems");
        console.log("Alternative check:", altCheck);
    }

    return {
        config: apiInfo,
        connectivity: healthCheck,
    };
}

/**
 * Example: Use in a React component
 * 
 * useEffect(() => {
 *   checkApiStatus().then(result => {
 *     if (!result.connectivity.isReachable) {
 *       console.error("API is not reachable:", result.connectivity.message);
 *       // Show error to user or handle offline mode
 *     }
 *   });
 * }, []);
 */

