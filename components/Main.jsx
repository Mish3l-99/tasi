import React from "react";

import Stock from "./sub/Stock";
import Voting from "./sub/Voting";
import MiniRoom from "./sub/MiniRoom";
import AdComponent from "./sub/AdComponent";

const Main = () => {
  return (
    <div dir="rtl" className="w-full py-8">
      <div className="container-main">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          {/* ads */}
          <div className="flex flex-col gap-3 w-full md:w-[200px]">
            <AdComponent slot={""} />
            <AdComponent slot={""} />
          </div>

          {/* main area */}
          <div className="flex-1 w-full flex flex-col gap-y-4">
            {/* stock and voting */}
            <div className="md:bg-blue-200 md:shadow-md flex flex-col md:flex-row gap-4">
              {/* voting */}
              <div className="flex-1">
                <Voting />
              </div>
              {/* stock */}
              <div className="p-3">
                <Stock />
              </div>
            </div>

            {/* chat room */}
            <div>
              <MiniRoom />
            </div>
          </div>

          {/* ads */}
          <div className="flex flex-col gap-3 w-full md:w-[200px]">
            <AdComponent slot={""} />
            <AdComponent slot={""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
