import Link from "next/link";
import React from "react";
import LogoIcon from "@/assets/logo.svg";

type LogoProps = {
  className?: string;
};

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`flex gap-2 items-center ${className}`}>
      <LogoIcon 
        className="logo size-5 md:size-10" 
        alt="Logo"
      />
      <span className="text-lg md:text-3xl font-extrabold">Katana</span>
    </Link>
  );
};

export default Logo;