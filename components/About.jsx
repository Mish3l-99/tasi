import Image from "next/image";
import React from "react";
import { BsPatchQuestion } from "react-icons/bs";

const About = () => {
  return (
    <div className="w-full py-8 bg-gray-100">
      <div className="container">
        <div
          dir="rtl"
          className="flex flex-col justify-center items-center gap-y-6"
        >
          <h1 className="font-semibold text-tasi text-xl md:text-2xl flex items-center gap-x-2">
            من نحن
          </h1>
          <p className="max-w-[900px] text-right p-3 bg-white relative text-lg">
            نحن منصة محادثة ودردشة حية ومباشرة لتبادل المعلومات والاراء بين
            المتداولين والمضاربين في سوق الاسهم السعودي تداول ونوفر أيضا نظام
            للتصويت على أداء المؤشر لكل ساعة في اليوم ونشر التصويت في تويتر.
            الانضمام الى المحادثة لا يتطلب حساب شخصي. كما ان الموقع لا يتبنى أي
            رأي او اقتراح ويخلي مسؤوليته من أي ضرر ناتج من المحادثات.
            <span className="absolute top-[-20px] right-0 p-1 bg-white rounded-full">
              <Image alt="/" src="/icons/about.gif" height={28} width={28} />
            </span>
          </p>

          <div className="max-w-fit text-left py-1 px-3 text-lg bg-white rounded flex items-center gap-x-2">
            <a
              className="hover:text-tasi"
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:tasitalk@gmail.com"
            >
              tasitalk@gmail.com
            </a>
            <span className="p-1 bg-white rounded-full">
              <Image alt="/" src="/icons/email.gif" height={18} width={18} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
