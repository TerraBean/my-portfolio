'use client';
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "home" },
    { label: "About", href: "about" },
    { label: "Skills", href: "skills" },
    { label: "Projects", href: "projects" },
    { label: "Contact", href: "contact" },
];

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#22292F]/80 backdrop-blur-md text-white sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 py-4">
                {/* Logo Section */}
                <div>
                    <ScrollLink
                        to="home"
                        smooth={true}
                        duration={500}
                        className="text-xl sm:text-2xl font-bold hover:text-brand-red cursor-pointer transition-all duration-300"
                    >
                        <span className="text-brand-red">&lt;</span>
                        Adams Mujahid
                        <span className="text-brand-red">/&gt;</span>
                    </ScrollLink>
                </div>

                {/* Desktop Navigation Links */}
                <ul className="hidden md:flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.label}>
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