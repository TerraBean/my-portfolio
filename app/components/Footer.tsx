'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#22292F] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left section - Copyright */}
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Adams Mujahid. All rights reserved.</p>
          </div>

          {/* Middle section - Contact */}
          <div className="mb-4 md:mb-0">
            <p>mujahidadams10@gmail.com</p>
          </div>

          {/* Right section - Social Links */}
          <div className="flex space-x-4">
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-red transition-colors"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-red transition-colors"
            >
              <FaLinkedin size={24} />
            </Link>
            <Link
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-red transition-colors"
            >
              <FaTwitter size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;