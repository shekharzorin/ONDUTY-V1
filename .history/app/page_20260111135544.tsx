import HashRedirect from "./components/redirect/HashRedirect";
import Features from "./components/sections/features";
import Getstart from "./components/sections/getstart";
import Interface from "./components/sections/interface";
import Workflow from "./components/sections/workflow";

export default function Home() {
  return (
    <main className="w-full h-screen overflow-y-scroll snap-y snap-mandatory">
      <HashRedirect />

      <section
        id="features"
        className="snap-center min-h-screen flex items-center justify-center"
      >
        <Features />
      </section>

      <section
        id="workflow"
        className="snap-center min-h-screen flex items-center justify-center"
      >
        <Workflow />
      </section>

      <section
        id="interface"
        className="snap-center min-h-screen flex items-center justify-center"
      >
        <Interface />
      </section>

      <section
        id="getstart"
        className="snap-center min-h-screen flex items-center justify-center"
      >
        <Getstart />
      </section>
    </main>
  );
}
