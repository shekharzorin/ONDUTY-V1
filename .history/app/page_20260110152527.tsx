import Features from "./components/sections/features";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384">
      <Features />
      <Workflow />
    </div>
  );
}
