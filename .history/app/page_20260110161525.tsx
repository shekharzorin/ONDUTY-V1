import Hero from "@/app/components/sections/hero";
import Features from "@/app/components/sections/features"

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">

      <Hero />
      <Features />
    </div>
  );
}
