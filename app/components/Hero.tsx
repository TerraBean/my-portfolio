import React from 'react'
import Image from 'next/image'
import {  FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

export default function Hero() {
    return (
        <div className='bg-[#01182B] text-white'>
            <div className='container mx-auto py-20 px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-10 justify-center items-start'>
                        <h1 className='text-4xl md:text-6xl font-bold'>Hello, I&apos;m Mujahid. A Full Stack <span className='text-[#FFAB48]'>Developer</span></h1>
                        <h2 className='text-xl md:text-2xl font-semibold'>Looking for a full stack developer for your web and mobile app, shouldn&apos;t be a struggle.</h2>

                        <div className='flex gap-4'>
                            <a
                                href="https://linkedin.com/in/adams-mujahid-699aa8270

"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://github.com/TerraBean"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl"
                            >
                                <FaGithub />
                            </a>
                            <a
                                href="https://x.com/Thunderstone5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-red text-3xl"
                            >
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                    <div>
                        <Image src='/images/mujahid.png' alt='Hero Image' width={500} height={500} />
                    </div>
                </div>
            </div>
        </div>
    )
}
