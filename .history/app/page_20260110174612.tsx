
import HashRedirect from "./components/redirect/HashRedirect";
import Features from "./components/sections/features";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <HashRedirect />
      <Features />
      <Workflow />
    </div>
  );
}
