import Footer from "../components/footer/footer";
import Pricing from "../components/sections/pricing";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;
