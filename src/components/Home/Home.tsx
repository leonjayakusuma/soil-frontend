import { About, Specials, Gardening } from "@/components/Home";
import Footer from "@/components/Footer";
import { useRef, useEffect } from "react";
import { testApiConnectivity, getApiInfo } from "@/api";

/**
 * The Home component is the main landing page of the application.
 *  It imports several sub-components like About, Specials, Gardening, and Footer.
 *  The component uses the useRef hook to create a reference to a scrollable div.
 *  Note: Cart fetching is handled in App.tsx to avoid duplicate API calls.
 *  The component also tests API connectivity on mount for debugging purposes.
 */
export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Test API connectivity when Home page loads
        const checkApi = async () => {
            console.log("=== Home Page: Testing API Connectivity ===");
            
            // Log API configuration
            const apiInfo = getApiInfo();
            console.log("API Configuration:", apiInfo);
            
            // Test connectivity with a common endpoint
            const result = await testApiConnectivity("/api/allItems");
            
            if (result.isReachable) {
                console.log("✅ API is reachable:", result.message);
                if (result.status) {
                    console.log(`   Status Code: ${result.status}`);
                }
            } else {
                console.warn("⚠️ API is not reachable:", result.message);
                if (result.details) {
                    console.warn("   Details:", result.details);
                }
            }
        };

        checkApi();
    }, []);

    return (
        <>
            <About specialsRef={scrollRef} />
            <Specials scrollRef={scrollRef} />
            {/* <Gardening /> */}
            <Footer />
        </>
    );
}
