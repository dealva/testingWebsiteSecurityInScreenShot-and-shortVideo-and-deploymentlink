'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
export default function HomePage() {

  useEffect(() => {
    try {
      redirect("/home");  
    } catch (err) {
      throw err;
    }
  }, []);


  return <p>Redirecting to  homepage...</p>;
}

