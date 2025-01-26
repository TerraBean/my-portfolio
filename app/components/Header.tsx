// components/Navbar.tsx
import React from "react";
import Link from "next/link";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/skills" },
    { label: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
    return (
        
        <nav className="bg-[#22292F] text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-4 py-6">
                {/* Logo Section */}
                <div>
                    <Link href="/" className="text-lg font-bold hover:text-gray-300">
                        Adams Mujahid
                    </Link>
                </div>


                {/* Navigation Links */}
                <ul className="flex space-x-4">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className="hover:text-gray-300">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
