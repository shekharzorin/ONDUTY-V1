import Image from "next/image";
import Logo from "@/app/images/od_logo.png"

const Footer = () => {
  return (
    <section
      id="footer"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>
      <div className="flex gap-5">
        <Image src={Logo} alt="Logo" className="w-12 h-12"/>
        <p className="text-2xl lg:text-2xl xl:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center lg:w-[70%]">
          OnDuty
        </p>
      </div>
    </section>
  );
};

export default Footer;
