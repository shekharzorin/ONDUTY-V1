
import Footer from "./components/footer/footer";
import HashRedirect from "./components/redirect/HashRedirect";
import Bookdemo from "./components/sections/bookdemo";
import Contact from "./components/sections/contact";
import Features from "./components/sections/features";
import Getready from "./components/sections/getready";
import Getstart from "./components/sections/getstart";
import Interface from "./components/sections/interface";
import Pricing from "./components/sections/pricing";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <HashRedirect />
      <Features />
      <Workflow />
      <Interface />
      <Getstart />
      <Getready />
      <Pricing/>
      <Bookdemo/>
      <Contact/>
      <Footer />
    </div>
  );
}
