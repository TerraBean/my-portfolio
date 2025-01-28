'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonial" className="w-full bg-[#01182B] text-white py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="w-[250px] h-[250px] rounded-full overflow-hidden">
              <Image
                src={testimonialData[currentIndex].image}
                alt={`${testimonialData[currentIndex].name}'s image`}
                width={250}
                height={250}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-4xl mt-5 text-[#ffc248]">
              {testimonialData[currentIndex].name}
            </h3>
            {testimonialData[currentIndex].role && (
              <p className="mt-2 text-gray-300">
                {testimonialData[currentIndex].role}
              </p>
            )}
            {testimonialData[currentIndex].quote && (
              <p className="mt-4 text-center text-2xl max-w-2xl">
                {testimonialData[currentIndex].quote}
              </p>
            )}
          </div>
          
          {/* Dots Navigation */}
          <div className="flex gap-2 mt-8">
            {testimonialData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-brand-red scale-125' : 'bg-gray-400'
                }`}
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