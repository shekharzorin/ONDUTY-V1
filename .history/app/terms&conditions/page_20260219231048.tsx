import React from "react";
import Footer from '../components/footer/footer'
import TermsAndConditions from "../components/sections/terms&conditions";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <TermsAndConditions />
      <Footer />
    </div>
  );
};

export default page;
