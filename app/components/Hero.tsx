'use client';
import React from 'react'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { motion } from 'framer-motion';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className='bg-[#01182B] text-white min-h-screen flex items-center'>
            <div className='container mx-auto py-20 px-8'>
                <motion.div 
                    className='grid grid-cols-1 md:grid-cols-2 gap-6'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className='flex flex-col gap-10 justify-center items-start'>
                        <motion.h1 
                            variants={itemVariants}
                            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6'
                        >
                            <span className='text-brand-red'>Hello</span>, I&apos;m Mujahid.<br/>
                            A Full Stack <motion.span 
                                className='text-[#FFAB48]'
                                animate={{ 
                                    color: ['#FFAB48', '#4CAF50', '#2196F3', '#FFAB48'],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                Developer
                            </motion.span>
                        </motion.h1>

                        <motion.h2 
                            variants={itemVariants}
                            className='text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl'
                        >
                            Looking for a full stack developer to bring your web and mobile app vision to life? 
                            It shouldn&apos;t be a struggle; it should be an exciting journey! 
                            With the right expertise, transforming your ideas into a seamless digital experience 
                            can be both effortless and enjoyable. Let&apos;s make your project stand out and shine on the web!
                        </motion.h2>

                        <motion.div 
                            variants={itemVariants}
                            className='flex gap-4'
                        >
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://linkedin.com/in/adams-mujahid-699aa8270"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl transition-colors duration-300"
                            >
                                <FaLinkedin />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://github.com/TerraBean"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl transition-colors duration-300"
                            >
                                <FaGithub />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://x.com/Thunderstone5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl transition-colors duration-300"
                            >
                                <FaTwitter />
                            </motion.a>
                        </motion.div>
                    </div>
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image src='/images/mujahid.png' alt='Hero Image' width={500} height={500} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
