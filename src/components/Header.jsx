import React from 'react';

export default function Header({ title, subtitle }) {
  return (
    <header className="text-center py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-widest text-[#ffd54f]">
        {title}
      </h1>
      {subtitle && (
        <p className="opacity-80 mt-3 text-sm md:text-base font-sans tracking-widest uppercase">
          {subtitle}
        </p>
      )}
    </header>
  );
}
