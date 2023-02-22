import React from "react";

const LogoPage = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex items-center gap-x-4">
        <div>
          <img className="h-[300px]" src="/logo/favi.png" />
        </div>
        <div>
          <img className="h-[100px]" src="/logo/e-klam.png" />
          <p className="text-tasi font-bold text-[100px] mr-6">تاسي توك</p>
        </div>
      </div>
    </div>
  );
};

export default LogoPage;
