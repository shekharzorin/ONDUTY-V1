import Image from "next/image";
import Logo from "@/app/images/od_logo.png";
import Link from "next/link";

const Footer = () => {
  return (
    <section
      id="footer"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full mt-10 border-t border-gray-200"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>
      <div className="flex flex-col py-5 lg:py-10 lg:flex-row lg:justify-between gap-5 lg:gap-20">
        <div className="flex flex-col gap-5 w-full lg:w-[50%]">
          <div className="flex gap-2 lg:gap-3 items-center">
            <Image
              src={Logo}
              alt="Onduty Logo"
              height={60}
              width={60}
              className="flex h-10 w-10 md:h-12 md:w-12 lg:h-15 lg:w-15"
            />
            <h1 className="text-2xl lg:text-2xl font-bold">OnDuty</h1>
          </div>
          <p className="md:text-lg text-(--color-gray)">
            The smart way to manage your team's attendance and tracking. Simple,
            efficient, and reliable.
          </p>
        </div>

        <div className="flex justify-between w-full px-5 lg:px-0">
          <div className="flex flex-col gap-5">
            <p className="text-lg lg:text-xl font-semibold mb-3">Product</p>
            <Link href="/#features">
              <p> Features </p>
            </Link>
            <Link href="/#features">
              <p> Interface </p>
            </Link>
            <Link href="/#features">
              <p> Pricing </p>
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-lg lg:text-xl font-semibold mb-3">Company</p>
            <Link href="/#features">
              <p> About Us </p>
            </Link>
            <Link href="/#features">
              <p> Contact </p>
            </Link>
            <Link href="/#features">
              <p> Privacy Policy </p>
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-lg lg:text-xl font-semibold mb-3">Social</p>
            <Link href="/#features">
              <p> Twitter </p>
            </Link>
            <Link href="/#features">
              <p> LinkedIn </p>
            </Link>
            <Link href="/#features">
              <p> Instagram </p>
            </Link>
          </div>
        </div>

        <hr className="text-gray-300 mt-5" />
        <div className="flex flex-col">
          <p> © 2026 OnDuty. All rights reserved. </p>
          <p>Terms & Conditions</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
