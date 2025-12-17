
export default function BackgroundGrid() {
    return (
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

            {/* Background Grid Pattern - Full Width & Subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a08_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-blue-50 rounded-lg transform rotate-12 opacity-20"></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-30"></div>
            <svg className="absolute top-20 right-20 w-32 h-32 text-gray-100 opacity-50" viewBox="0 0 100 100" fill="none">
                <path d="M0 0L100 100M100 0L0 100" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>
    );
}
