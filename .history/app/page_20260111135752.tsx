
import HashRedirect from "./components/redirect/HashRedirect";
import Features from "./components/sections/features";
import Getstart from "./components/sections/getstart";
import Interface from "./components/sections/interface";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center scroll-smooth">
      <HashRedirect />
      <Features />
      <Workflow />
      <Interface/>
      <Getstart />
    </div>
  );
}
