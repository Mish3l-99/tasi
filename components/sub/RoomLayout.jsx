import React from "react";
import AdComponent from "./AdComponent";

const RoomLayout = ({ children }) => {
  return (
    <div>
      <div className="container-main">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          {/* ads */}
          <div className="flex flex-col gap-3 w-full md:w-[200px] py-3">
            <AdComponent slot={""} />
            <AdComponent slot={""} />
            <AdComponent slot={""} />
          </div>

          {/* main area */}
          <div className="flex-1 w-full flex flex-col gap-y-4 mx-auto max-w-[600px] shadow">
            {children}
          </div>

          {/* ads */}
          <div className="flex flex-col gap-3 w-full md:w-[200px] py-3">
            <AdComponent slot={""} />
            <AdComponent slot={""} />
            <AdComponent slot={""} />
          </div>
        </div>
        {/* <div className="flex"></div>
        <div>{children}</div> */}
      </div>
    </div>
  );
};

export default RoomLayout;
