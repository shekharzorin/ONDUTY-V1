import Features from "./components/sections/features";
import Hero from "./components/sections/hero";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">

      <Hero />
      <Features />
    </div>
  );
}
