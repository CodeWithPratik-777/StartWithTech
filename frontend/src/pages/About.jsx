import React, { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

function About() {
  const { setIsAppLoading } = useLoading();

  useEffect(() => {
    setIsAppLoading(true);

    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [setIsAppLoading]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl font-poppins">
      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
          About Us
        </span>
      </h2>

      <h1 className="text-xl font-semibold my-4">Welcome to StartWithTech</h1>

      <p className="text-lg leading-relaxed mb-6">
        At <span className="font-semibold">StartWithTech</span>, we deliver cutting-edge insights on emerging technologies, AI advancements, web development trends, and groundbreaking innovations. Our mission is to equip our audience with in-depth resources, practical tutorials, and timely updates to navigate the fast-changing digital landscape with confidence.
      </p>

      <h2 className="text-xl font-semibold mb-3">Who We Serve</h2>
      <p className="text-lg leading-relaxed mb-6">
        From coding beginners to tech industry veterans, our content is designed to support every knowledge level. We take pride in crafting high-quality, accessible articles that educate, inspire, and spark meaningful conversations.
      </p>

      <h2 className="text-xl font-semibold mb-3">Our Team</h2>
      <p className="text-lg leading-relaxed mb-6">
        Our team consists of passionate technology experts, seasoned developers, and creative content producers dedicated to fostering an engaged community of curious minds and lifelong learners.
      </p>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose StartWithTech?</h2>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li>✅ Trusted source for vetted technology news</li>
          <li>✅ Actionable development tutorials and pro tips</li>
          <li>✅ Expert breakdowns of AI, web technologies, and digital transformation</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
