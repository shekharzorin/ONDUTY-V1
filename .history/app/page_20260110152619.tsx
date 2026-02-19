import Features from "./components/sections/features";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-24 max-w-384">
      <Features />
      <Workflow />
    </div>
  );
}
