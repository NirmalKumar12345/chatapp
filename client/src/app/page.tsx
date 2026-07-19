'use client';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex items-center h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <button className="bg-black text-white px-4 py-2 rounded hover:bg-blue-500 cursor-pointer" onClick={()=> router.push('/dashboard')}>click</button>
    </div>
  );
}
