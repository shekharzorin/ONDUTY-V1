import team from "@/public/images/team.png";
import Image from "next/image";

const About = () => {
  return (
    <section className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>
      
      <div className="flex flex-col gap-10 mb-15">
        <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
          <p className="text-2xl lg:text-3xl font-bold leading-[1.15]">
            Visualizing the future of work
          </p>
          <p className="md:text-lg text-(--color-gray)">
            OnDuty is on a mission to simplify workforce management for teams of
            all sizes. <br />
            We believe in transparency, efficiency, and beautiful software.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10">
          <div className="flex flex-col gap-5 text-center lg:text-start">
            <p className="font-bold text-xl">Built for modern teams</p>

            <p className="text-balance md:text-lg text-(--color-gray)">
              Traditional attendance systems are clunky, ugly, and hard to use.
              We built OnDuty to change that. With a focus on user experience
              and powerful features, we help companies save time and money.
            </p>

            <div className="flex items-center justify-center lg:justify-start lg:pl-10">
              <ul className="space-y-3 flex flex-col items-start justify-center md:text-lg text-(--color-gray)">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full"></span>
                  <span>User-first design approach</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full"></span>
                  <span>Enterprise-grade security</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full"></span>
                  <span>Real-time data synchronization</span>
                </li>
              </ul>
            </div>
          </div>

          <Image
            src={team}
            alt="Team Image"
            height={300}
            width={300}
            className="relative rounded-3xl shadow-2xl md:w-sm xl:w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
