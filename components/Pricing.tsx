"use client";

import { Check, Loader2, Building2, ArrowRight } from "lucide-react";
import { buyCredits } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import { useState, useRef } from "react";
import LoginModal from "./LoginModal";

export default function Pricing() {
    const { data: session } = authClient.useSession();
    const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const width = container.offsetWidth;
            const index = Math.round(scrollLeft / width);
            if (index !== activeTab && index >= 0 && index < packages.length) {
                setActiveTab(index);
            }
        }
    };

    const scrollToPackage = (index: number) => {
        setActiveTab(index);
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = container.children[index] as HTMLElement;
            if (element) {
                // Center the element
                const containerWidth = container.clientWidth;
                const elementWidth = element.clientWidth;
                const scrollLeft = element.offsetLeft - (containerWidth / 2) + (elementWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handleBuy = async (pkgId: string) => {
        if (!session) {
            setIsLoginOpen(true);
            return;
        }

        setLoadingPkg(pkgId);
        try {
            const result = await buyCredits(pkgId);
            if (result.success) {
                alert("Credits added successfully! (Simulated Payment)");
                window.location.reload(); // Refresh to update credits
            }
        } catch (e: any) {
            console.error(e);
            if (e.message && e.message.includes("User not found")) {
                alert("Session invalid. Logging out to refresh...");
                await authClient.signOut();
                window.location.reload();
            } else {
                alert(e.message || "Failed to buy credits. Please try again.");
            }
        } finally {
            setLoadingPkg(null);
        }
    };

    const packages = [
        {
            id: "entrepreneur",
            name: "Entrepreneur",
            price: "2€",
            credits: "200 Credits",
            bonus: null,
            features: ["~ 5 Photos", "Improvements included", "Access to all styles", "Ideal for 1 user"],
            popular: false,
            gradient: "from-blue-400 to-blue-600",
            tabColor: "bg-blue-100 text-blue-700 border-blue-200",
            activeBorder: "border-blue-500",
        },
        {
            id: "friends",
            name: "Friends",
            price: "6€",
            credits: "750 Credits",
            bonus: "+50 Credits Bonus",
            features: ["~ 25 Photos", "Improvements included", "Access to all styles", "Perfect for 2-3 users"],
            popular: true,
            gradient: "from-purple-500 to-indigo-600",
            tabColor: "bg-purple-100 text-purple-700 border-purple-200",
            activeBorder: "border-purple-500",
        },
        {
            id: "networking",
            name: "Networking",
            price: "15€",
            credits: "1600 Credits",
            bonus: "+100 Credits Bonus",
            features: ["~ 50 Photos", "Improvements included", "Access to all styles", "Perfect for 3-6 users"],
            popular: false,
            gradient: "from-orange-400 to-pink-600",
            tabColor: "bg-pink-100 text-pink-700 border-pink-200",
            activeBorder: "border-pink-500",
        },
    ];

    return (
        <>
            <section id="pricing" className="w-full py-12 bg-gray-50 relative overflow-hidden scroll-mt-24">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-center mb-4">
                            Low Investment, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">High Returns</span>
                        </h2>
                        <p className="text-center text-gray-500 mb-12">
                            Invest in your career for less than the price of lunch.
                        </p>
                    </div>

                    {/* Mobile Plan Tabs */}
                    <div className="md:hidden flex p-1 bg-white/80 backdrop-blur-md rounded-xl mb-6 mx-auto max-w-sm sticky top-20 z-30 shadow-sm border border-gray-100">
                        {packages.map((pkg, idx) => (
                            <button
                                key={pkg.id}
                                onClick={() => scrollToPackage(idx)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === idx
                                    ? `${(pkg as any).tabColor} shadow-sm transform scale-105`
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {pkg.name}
                            </button>
                        ))}
                    </div>

                    {/* Mobile View - Horizontal Scroll + Tabs */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 pt-4 -mx-6 px-6 hide-scrollbar"
                    >
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative p-1 rounded-3xl transition-all duration-300 min-w-[85vw] snap-center ${pkg.popular ? "shadow-2xl z-10" : "shadow-xl"}`}
                            >
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pkg.gradient} opacity-75 blur-sm`}></div>
                                <div className="relative bg-white rounded-[22px] p-8 h-full flex flex-col">
                                    {pkg.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2 text-gray-800">{pkg.name}</h3>
                                    <div className="text-4xl font-black mb-2 text-gray-900">{pkg.price}</div>
                                    {pkg.id === "entrepreneur" && (
                                        <div className="text-sm font-bold text-amber-800 mb-4 bg-amber-100 inline-block px-2 py-1 rounded-lg self-start">
                                            Valor de 2 cafés
                                        </div>
                                    )}
                                    {pkg.bonus && (
                                        <div className="text-sm font-bold text-green-600 mb-4 bg-green-50 inline-block px-2 py-1 rounded-lg self-start">
                                            {pkg.bonus}
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-4 mb-8 mt-4">
                                        <div className="flex items-center gap-2 font-semibold text-lg text-blue-700">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                ⚡
                                            </div>
                                            {pkg.credits}
                                        </div>
                                        {pkg.features.map((feat) => (
                                            <div key={feat} className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(pkg.id)}
                                        disabled={loadingPkg === pkg.id}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${pkg.popular
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
                                            : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]"
                                            }`}
                                    >
                                        {loadingPkg === pkg.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            `Choose ${pkg.name}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View - Grid */}
                    <div className="hidden md:grid grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative p-1 rounded-3xl transition-all duration-300 hover:-translate-y-2 ${pkg.popular ? "shadow-2xl scale-105 z-10" : "shadow-xl hover:shadow-2xl"}`}
                            >
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pkg.gradient} opacity-75 blur-sm`}></div>
                                <div className="relative bg-white rounded-[22px] p-8 h-full flex flex-col">
                                    {pkg.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2 text-gray-800">{pkg.name}</h3>
                                    <div className="text-4xl font-black mb-2 text-gray-900">{pkg.price}</div>
                                    {pkg.id === "entrepreneur" && (
                                        <div className="text-sm font-bold text-amber-800 mb-4 bg-amber-100 inline-block px-2 py-1 rounded-lg self-start">
                                            Valor de 2 cafés
                                        </div>
                                    )}
                                    {pkg.bonus && (
                                        <div className="text-sm font-bold text-green-600 mb-4 bg-green-50 inline-block px-2 py-1 rounded-lg self-start">
                                            {pkg.bonus}
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-4 mb-8 mt-4">
                                        <div className="flex items-center gap-2 font-semibold text-lg text-blue-700">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                ⚡
                                            </div>
                                            {pkg.credits}
                                        </div>
                                        {pkg.features.map((feat) => (
                                            <div key={feat} className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(pkg.id)}
                                        disabled={loadingPkg === pkg.id}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${pkg.popular
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
                                            : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]"
                                            }`}
                                    >
                                        {loadingPkg === pkg.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            `Choose ${pkg.name}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Corporate Pack */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-8 h-8 text-blue-400" />
                                        <h3 className="text-2xl font-bold">Corporate Pack</h3>
                                    </div>
                                    <p className="text-gray-300 text-lg mb-2">
                                        Quer um pack para a sua empresa?
                                    </p>
                                    <p className="text-gray-400">
                                        Contacte-nos para um pacote com um preço e volume de fotos ajustado às suas necessidades.
                                    </p>
                                </div>
                                <a
                                    href="/contact"
                                    className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    Contact Us
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
