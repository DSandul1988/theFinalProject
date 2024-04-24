"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
export const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      alt="Logo"
      className="hidden md:block border-yellow-400 border-2 hover:bg-slate-400
     cursor-pointer rounded-full"
      height="100"
      width="100"
      src="/images/Logo.png"
    />
  );
};

export default Logo;
