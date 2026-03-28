import Features from "./components/sections/hero";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      
      <Features />
      <Workflow />
    </div>
  );
}
