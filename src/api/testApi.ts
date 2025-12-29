/**
 * Utility functions and examples for testing API connectivity
 * 
 * You can use these in:
 * 1. Browser console: import { testApiConnectivity, getApiInfo } from './api'
 * 2. React components: import { testApiConnectivity, getApiInfo } from '@/api'
 * 3. Debugging: Call these functions to check API status
 * 4. Node.js: Run with `tsx src/api/testApi.ts` or `npm run test:api`
 */

import { testApiConnectivity, getApiInfo } from "./index";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

/**
 * Node.js-compatible API test function
 * Uses process.env instead of import.meta.env (which is Vite-specific)
 */
async function testApiNodeJs(endpoint: string = "/health") {
    // Load environment variables
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = join(__dirname, "..", "..", ".env");
    dotenv.config({ path: envPath });
    
    const VITE_API_URL = process.env.VITE_API_URL;
    const VITE_API_KEY = process.env.VITE_API_KEY;
    const VITE_API_KEY_HEADER = process.env.VITE_API_KEY_HEADER || "X-API-Key";
    
    console.log("=".repeat(60));
    console.log("🔍 API Connectivity Test (Node.js)");
    console.log("=".repeat(60));
    
    console.log("\n📋 API Configuration:");
    console.log({
        baseUrl: VITE_API_URL || "Not set (will use relative URLs)",
        hasApiKey: !!VITE_API_KEY,
        apiKeyHeader: VITE_API_KEY_HEADER,
        apiKeyLength: VITE_API_KEY ? VITE_API_KEY.length : 0,
        endpoint: endpoint,
    });
    
    // Build full URL
    const baseUrl = VITE_API_URL ? VITE_API_URL.replace(/\/$/, "") : "";
    const fullUrl = baseUrl 
        ? `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
        : endpoint;
    
    console.log(`\n🌐 Testing: ${fullUrl}`);
    
    // Build headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    
    if (VITE_API_KEY) {
        headers[VITE_API_KEY_HEADER] = VITE_API_KEY;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const startTime = Date.now();
        const response = await fetch(fullUrl, {
            method: "GET",
            headers,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        let responseData: any;
        try {
            responseData = await response.json();
        } catch {
            const text = await response.text();
            responseData = text.substring(0, 200);
        }
        
        console.log("\n📥 Response:");
        console.log({
            status: `${response.status} ${response.statusText}`,
            responseTime: `${responseTime}ms`,
            data: responseData,
        });
        
        const isReachable = response.status !== 404;
        console.log(isReachable ? "\n✅ API is reachable!" : "\n⚠️ Endpoint not found (404)");
        
        return { isReachable, status: response.status, message: response.statusText };
    } catch (error: any) {
        const errorMsg = error.message || String(error);
        console.error("\n❌ Error:", errorMsg);
        
        if (errorMsg.includes("timeout") || errorMsg.includes("aborted")) {
            console.error("Request timed out after 30 seconds");
        } else if (errorMsg.includes("Failed to fetch")) {
            console.error("Network error: Cannot reach the API server");
            console.error("Check if VITE_API_URL is correct and the server is running");
        }
        
        return { isReachable: false, status: 0, message: errorMsg };
    }
}

/**
 * Test API connectivity and log results
 * Run this in browser console or call from a component
 * 
 * Usage in browser console:
 *   import { checkApiStatus } from '@/api/testApi'
 *   await checkApiStatus()
 */
export async function checkApiStatus(endpoint?: string) {
    console.log("=".repeat(60));
    console.log("🔍 API Connectivity Test");
    console.log("=".repeat(60));
    
    console.log("\n📋 API Configuration:");
    const apiInfo = getApiInfo();
    console.table(apiInfo);
    console.log("\nFull config:", JSON.stringify(apiInfo, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("🌐 Testing API Connectivity");
    console.log("=".repeat(60));
    
    // Test with provided endpoint or default
    const testEndpoint = endpoint || "/api/health";
    console.log(`\nTesting endpoint: ${testEndpoint}`);
    
    const healthCheck = await testApiConnectivity(testEndpoint);
    console.log("\n📥 Result:", healthCheck);
    
    if (!healthCheck.isReachable) {
        console.warn("\n⚠️ API is not reachable!");
        console.warn("Message:", healthCheck.message);
        if (healthCheck.details) {
            console.warn("Details:", healthCheck.details);
        }
        
        // Try alternative endpoint if health check failed
        if (testEndpoint === "/api/health") {
            console.log("\n" + "=".repeat(60));
            console.log("🔄 Trying alternative endpoint...");
            console.log("=".repeat(60));
            const altCheck = await testApiConnectivity("/api/allItems");
            console.log("\n📥 Alternative Result:", altCheck);
        }
    } else {
        console.log("\n✅ API is reachable!");
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

// Run if executed directly (e.g., `tsx src/api/testApi.ts` or `npm run test:api`)
// In Node.js environment, use the Node.js-compatible test function
if (typeof process !== 'undefined' && process.argv) {
    const endpoint = process.argv[2] || "/health";
    
    testApiNodeJs(endpoint)
        .then((result) => {
            if (result.isReachable) {
                process.exit(0);
            } else {
                console.error("\n❌ API connectivity test failed");
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error("\n❌ Error running API test:", error);
            process.exit(1);
        });
}
