'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialItem {
  name: string;
  image: string;
  role?: string;
  quote?: string;
}
export const testimonialData: TestimonialItem[] = [
    {
      name: "Kwame Kyerema Darkwah",
      image: "/images/Darkwa Kwame Kyerema(Chairman).jpg",
      role: "Founder Of Elirod Academy, CEO Of GH Purpose TV",
      quote: "Adams delivered an exceptional website for our academy. His attention to detail and understanding of our needs was remarkable. The platform has significantly improved our online presence."
    },
    {
      name: "Georgina Dickson",
      image: "/images/Georgina Dickson(founder_President).jpg",
      role: "Founder Of Awurade Ne Yenhwfo",
      quote: "Working with Adams was a pleasure. His technical expertise combined with great communication skills made our project successful. He went above and beyond to ensure everything was perfect."
    },
    {
        name: "Priscilla",
        image: "/images/pricilla.jpg",
        role: "Owner of Pringin Prints",
        quote: "Adams has been my go-to developer for all my client referrals. His consistent delivery of high-quality work has made it easy to recommend him. Every client I've connected him with has been thoroughly impressed with his professionalism and technical expertise."
    }
  ];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => 
        prev === testimonialData.length - 1 ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="testimonial" className="w-full bg-[#01182B] text-white py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="flex flex-col items-center"
            >
              <motion.div 
                className="w-[250px] h-[250px] rounded-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src={testimonialData[currentIndex].image}
                  alt={`${testimonialData[currentIndex].name}'s image`}
                  width={250}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.h3 
                className="text-2xl sm:text-3xl lg:text-4xl mt-5 text-[#ffc248]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {testimonialData[currentIndex].name}
              </motion.h3>
              {testimonialData[currentIndex].role && (
                <motion.p 
                  className="mt-2 text-base sm:text-lg lg:text-xl text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {testimonialData[currentIndex].role}
                </motion.p>
              )}
              {testimonialData[currentIndex].quote && (
                <motion.p 
                  className="mt-4 text-center text-lg sm:text-xl lg:text-2xl max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  &ldquo;{testimonialData[currentIndex].quote}&rdquo;
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex gap-2 mt-8">
            {testimonialData.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-brand-red scale-125' : 'bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;