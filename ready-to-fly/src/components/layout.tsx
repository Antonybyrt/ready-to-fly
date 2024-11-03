// components/Layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-lg font-bold">Nom du Site</h2>
                <ul className="mt-4">
                    <li className="my-2">
                        <Link href="/">
                            <a className="text-gray-300 hover:text-white">Home</a>
                        </Link>
                    </li>
                    <li className="my-2">
                        <Link href="/newFlight">
                            <a className="text-gray-300 hover:text-white">New Flight</a>
                        </Link>
                    </li>
                    {/* Add more links here */}
                </ul>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                <header className="bg-blue-600 text-white p-4">
                    <h1 className="text-2xl">Nom du Site</h1>
                </header>
                <main className="mt-4">
                    {children} {/* Render the children here */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
