import { About, Specials, Gardening } from "@/components/Home";
import Footer from "@/components/Footer";
import { useRef } from "react";

/**
 * The Home component is the main landing page of the application.
 *  It imports several sub-components like About, Specials, Gardening, and Footer.
 *  The component uses the useRef hook to create a reference to a scrollable div.
 *  Note: Cart fetching is handled in App.tsx to avoid duplicate API calls.
 */
export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <About specialsRef={scrollRef} />
            <Specials scrollRef={scrollRef} />
            {/* <Gardening /> */}
            <Footer />
        </>
    );
}
