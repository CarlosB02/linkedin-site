"use client";

import { useEffect } from "react";

export default function OverscrollFix() {
    useEffect(() => {
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY; // positive = pulling down, negative = pulling up

            // Only care about pulling up (scrolling down)
            if (deltaY < 0) {
                const el = document.scrollingElement || document.documentElement;

                // Check if we are at the bottom of the page
                // Use a small buffer (1px) to account for sub-pixel rendering
                const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

                if (isAtBottom) {
                    // We are at the bottom and trying to scroll further down -> prevent bounce
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }
        };

        // Add non-passive event listeners to allow preventDefault
        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return null;
}
