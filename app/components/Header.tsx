'use client';
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    isScrollLink?: boolean;
}

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    // Define navigation items
    const navItems: NavItem[] = [
        { label: "Home", href: isHomePage ? "home" : "/#home", isScrollLink: isHomePage },
        { label: "About", href: isHomePage ? "about" : "/#about", isScrollLink: isHomePage },
        { label: "Skills", href: isHomePage ? "skills" : "/#skills", isScrollLink: isHomePage },
        { label: "Projects", href: isHomePage ? "projects" : "/#projects", isScrollLink: isHomePage },
        { label: "Contact", href: isHomePage ? "contact" : "/#contact", isScrollLink: isHomePage },
        { label: "Blog", href: "/blog", isScrollLink: false },
    ];

    // Close menu when route changes
    useEffect(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [pathname, isMenuOpen]);

    return (
        <nav className="bg-[#22292F]/80 backdrop-blur-md text-white sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 py-4">
                {/* Logo Section */}
                <div>
                    <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-brand-red cursor-pointer transition-all duration-300">
                        <span className="text-brand-red">&lt;</span>
                        Adams Mujahid
                        <span className="text-brand-red">/&gt;</span>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <ul className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            {item.isScrollLink ? (
                                <ScrollLink
                                    to={item.href}
                                    smooth={true}
                                    duration={500}
                                    offset={-70} // Adjust this value based on your header height
                                    spy={true} // Enables active state tracking
                                    activeClass="text-[#FFD700]" // Class applied to the active link
                                    className="text-base sm:text-lg hover:text-gray-300 cursor-pointer transition-colors duration-200"
                                >
                                    {item.label}
                                </ScrollLink>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-base sm:text-lg hover:text-gray-300 cursor-pointer transition-colors duration-200"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                    {status === 'authenticated' && session?.user.role === 'admin' && (
                        <>
                            <li>
                                <Link
                                    href="/blog/admin"
                                    className="text-base sm:text-lg text-brand-red hover:text-opacity-80 cursor-pointer transition-colors duration-200"
                                >
                                    Admin
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleSignOut}
                                    className="text-base sm:text-lg text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
                                >
                                    Sign Out
                                </button>
                            </li>
                        </>
                    )}
                    {status !== 'authenticated' && (
                        <li>
                            <Link
                                href="/login"
                                className="text-base sm:text-lg bg-brand-red px-4 py-2 rounded hover:bg-opacity-90 cursor-pointer transition-colors duration-200"
                            >
                                Login
                            </Link>
                        </li>
                    )}
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
                                    {item.isScrollLink ? (
                                        <ScrollLink
                                            to={item.href}
                                            smooth={true}
                                            duration={500}
                                            offset={-70}
                                            spy={true} // Enables active state tracking
                                            activeClass="text-[#FFD700]" // Class applied to the active link
                                            className="block hover:text-gray-300 py-2 cursor-pointer transition-colors duration-200"
                                            onClick={toggleMenu}
                                        >
                                            {item.label}
                                        </ScrollLink>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="block hover:text-gray-300 py-2 cursor-pointer transition-colors duration-200"
                                            onClick={toggleMenu}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                            {status === 'authenticated' && session?.user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link
                                            href="/blog/admin"
                                            className="block text-brand-red hover:text-opacity-80 py-2 cursor-pointer transition-colors duration-200"
                                            onClick={toggleMenu}
                                        >
                                            Admin
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="block text-gray-300 hover:text-white py-2 cursor-pointer transition-colors duration-200"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            )}
                            {status !== 'authenticated' && (
                                <li>
                                    <Link
                                        href="/login"
                                        className="block bg-brand-red px-4 py-2 rounded hover:bg-opacity-90 cursor-pointer transition-colors duration-200"
                                        onClick={toggleMenu}
                                    >
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;