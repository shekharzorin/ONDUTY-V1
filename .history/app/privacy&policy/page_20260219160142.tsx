import React from "react";
import Footer from "../components/footer/footer";
import PrivacyPolicy from "../components/sections/privacy&policy";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Footer />
      <PrivacyPolicy/>
    </div>
  );
};

export default page;
