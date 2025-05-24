'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function SearchBar() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed) {
        // This will update the URL like /?q=rahma
        router.push(`/home?q=${encodeURIComponent(trimmed)}`);
      }
    }
  };
  useEffect(() => {
    if (input === '') {
      router.push('/home');
    }
  }, [input]);

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      className="w-full max-w-md px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
      aria-label="Search videos or users"
    />
  );
}
