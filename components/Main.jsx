import React from "react";

import Stock from "./sub/Stock";
import Voting from "./sub/Voting";
import MiniRoom from "./sub/MiniRoom";
import AdComponent from "./sub/AdComponent";

const Main = () => {
  return (
    <div dir="rtl" className="w-full py-8">
      <div className="container">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* price area */}
            <Stock />
            {/* voting area */}
            <Voting />
          </div>
          {/* second area */}
          <div className="mt-6 flex flex-col md:flex-row items-start gap-4">
            {/* ads area */}
            <div className="flex flex-col gap-6  w-full md:w-[250px]">
              <AdComponent />
            </div>
            {/* chat room area */}
            <MiniRoom />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
