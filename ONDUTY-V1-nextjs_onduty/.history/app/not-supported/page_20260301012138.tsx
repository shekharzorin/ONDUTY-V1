"use client";

import { useEffect, useState } from "react";
import od from "@/app/images/onduty-icon.png";
import android from "@/app/images/android.png";
import ios from "@/app/images/ios.png";
import Image from "next/image";
import arrowbend from "@/app/images/arrowbend.png";

const Page = () => {
  const [platform, setPlatform] = useState<"android" | "ios" | "other">(
    "other",
  );

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(userAgent)) {
      setPlatform("ios");
    } else {
      setPlatform("other");
    }
  }, []);

  const getDownloadLink = () => {
    if (platform === "android") {
      return "https://play.google.com/store/apps/details?id=your.package.name";
    }
    if (platform === "ios") {
      return "https://apps.apple.com/us/iphone/games";
    }
    return "/";
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center p-10 text-center h-screen font-semibold">
      <div className="relative animate-bounce -rotate-6 mb-5">
        <div className="text-3xl font-bold text-(--color-primary) mb-0">
          Oops !
        </div>
        <Image src={arrowbend} width={50} alt="Arrow Bend" className="absolute " />
      </div>

      <Image src={od} width={100} alt="Onduty Logo" />

      <p>
        Your device is not supported. <br />
        Please download the application
      </p>

      {platform !== "other" && (
        <>
          {platform === "android" ? (
            <>
              <Image src={android} width={100} alt="Android Logo" />
            </>
          ) : (
            <>
              <Image src={ios} width={100} alt="iOS Logo" />
            </>
          )}
          <a
            href={getDownloadLink()}
            className="bg-(--color-primary) text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Download for{" "}
            {platform === "android" ? " Android / Tablet" : " iOS / iPad"}
          </a>
        </>
      )}
    </div>
  );
};

export default Page;
