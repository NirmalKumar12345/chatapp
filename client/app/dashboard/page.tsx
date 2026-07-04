'use client';
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter()
    return (
        <div className="flex bg-white h-screen justify-center items-center">
            <button className="text-black text-center cursor-pointer" onClick={()=>router.push("/")}>Back</button>
        </div>
    )
}