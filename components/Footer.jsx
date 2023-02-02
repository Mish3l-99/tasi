import Image from "next/image";
import React from "react";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <div className="w-full py-2 bg-gray-200">
      <div className="container">
        <div
          dir="rtl"
          className="flex flex-col md:flex-row gap-y-4 justify-between items-center"
        >
          <p className="flex items-center gap-x-2 font-bold">
            جميع الحقوق محفوظة {year}
            <span>&#169;.</span>
          </p>
          <div>
            <Image
              src="/logo/logo-f.png"
              alt="/"
              height={40}
              width={120}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
