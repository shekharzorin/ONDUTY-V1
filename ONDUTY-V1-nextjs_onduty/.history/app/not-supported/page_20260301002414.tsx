"use client";

import { useEffect, useState } from "react";
import od from "@/app/images/onduty-icon.png";
import Image from "next/image";

const Page = () => {
  const [platform, setPlatform] = useState<"android" | "ios" | "other">(
    "other",
  );

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
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
      return "https://apps.apple.com/app/idYOUR_APP_ID";
    }
    return "/";
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center p-5 text-center h-screen font-semibold">
      <Image src={od} width={100} alt="Onduty Logo" />

      <p>
        Your device is not supported. <br />
        Please download this application.
      </p>

      {platform !== "other" && (
        <a
          href={getDownloadLink()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Download for
          {platform === "android"
            ? "Android / Tablet"
            : platform === "ios"
              ? "iOS / iPad"
              : ""}
        </a>
      )}
    </div>
  );
};

export default Page;
