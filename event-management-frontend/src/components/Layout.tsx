import type { ReactNode } from 'react';
import { Navbar } from './Navbar.tsx';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-[#1E3A8A] text-white/50 text-sm text-center py-5 mt-auto border-t border-white/5">
                Made with ❤️ by the UniEvents Team · © {new Date().getFullYear()} University Event Management System
            </footer>
        </div>
    );
}
