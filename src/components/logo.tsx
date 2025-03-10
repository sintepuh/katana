import Link from "next/link";
import React from "react";
import LogoIcon  from "@/assets/logo.svg";

type LogoProps = {
  size?: number;
};

const Logo = ({ size = 40}: LogoProps) => {
  return (
    <Link href={"/"} className="flex gap-2 items-center">
      <LogoIcon  className="logo" alt="Logo" width={size} height={size} />
      <span className="text-3xl font-extrabold">Katana</span>
    </Link>
  );
};

export default Logo;
