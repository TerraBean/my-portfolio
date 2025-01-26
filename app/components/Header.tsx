// components/Navbar.tsx
'use client';   
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#22292F] text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-4 py-6">
                {/* Logo Section */}
                <div>
                    <Link href="/" className="text-lg font-bold hover:text-gray-300">
                        Adams Mujahid
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <ul className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className="hover:text-gray-300">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-2xl focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Links */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-[#22292F]"
                    >
                        <ul className="flex flex-col space-y-4 px-4 pb-6">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="block hover:text-gray-300 py-2"
                                        onClick={toggleMenu}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;