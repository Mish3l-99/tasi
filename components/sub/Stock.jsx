import React, { useEffect, useState } from "react";
import protobuf from "protobufjs";
var { Buffer } = require("buffer/");
import { BiRefresh } from "react-icons/bi";
import { BsFillTagsFill } from "react-icons/bs";
import Image from "next/image";

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  if (month <= 9) {
    month = "0" + month;
  }
  if (date <= 9) {
    date = "0" + date;
  }
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = hour + ":" + min + " AST  -  " + date + "/" + month + "/" + year;
  return time;
}

const Stock = () => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [data, setData] = useState(null);

  const [refresh, setRefresh] = useState(false);

  //get stock data
  useEffect(() => {
    setData(null);
    const ws = new WebSocket("wss://streamer.finance.yahoo.com");

    const root = protobuf.load("/YPricingData.proto", (error, root) => {
      if (error) {
        return console.log(error);
      }

      const Yaticker = root.lookupType("yaticker");

      ws.onopen = function open() {
        console.log("connected");
        ws.send(
          JSON.stringify({
            subscribe: ["^TASI.SR"],
          })
        );
      };

      ws.onclose = function close() {
        console.log("disconnected");
      };

      ws.onmessage = function incoming(message) {
        const next = Yaticker.decode(new Buffer(message.data, "base64"));
        setData(next);
      };
    });
  }, [refresh]);
  // console.log(data);

  return (
    <div className="min-w-[250px]">
      <h1 className="text-xl md:text-3xl font-semibold mb-1 pb-1 border-b w-fit text-gray-500 flex items-center gap-x-2">
        <span>
          <BsFillTagsFill size={25} />
        </span>
        سعر المؤشر :
      </h1>
      <div className="flex items-center gap-x-3">
        <span className="" onClick={() => setRefresh(!refresh)}>
          <BiRefresh
            size={28}
            className="text-gray-500 hover:rotate-[-120deg] hover:text-tasi cursor-pointer duration-300 ease-in"
          />
        </span>
        {data !== null ? (
          <>
            <p className="text-2xl md:text-4xl font-semibold mb-1">
              {numberWithCommas(data.price.toFixed(3))}
            </p>
            <p dir="ltr" className={data.change > 0 ? "" : "text-red-600"}>
              ({data.change.toFixed(2)})
            </p>
          </>
        ) : (
          <div className="min-w-[100px]">
            <Image
              alt="/"
              src="/icons/loading.gif"
              height={20}
              width={20}
              className="mx-auto"
            />
          </div>
        )}
      </div>
      {data !== null && (
        <div dir="ltr" className="w-fit">
          As of: <span>{timeConverter(data.time)}</span>.
        </div>
      )}
    </div>
  );
};

export default Stock;
