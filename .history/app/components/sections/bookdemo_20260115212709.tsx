import { BsClockFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import Inputbox from "../ui/Inputbox";

const Bookdemo = () => {
  return (
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Schedule a Demo
        </p>
        <p className="md:text-lg text-(--color-gray)">
          Get a personalized demo tailored to your organization.
        </p>
      </div>

      <div className="backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-7 md:p-10 flex flex-col gap-10 justify-center w-full max-w-md">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-xl">Send a Request to OnDuty</p>
          <form
            className="flex flex-col w-full h-full px-3 gap-3 items-center"
            onSubmit={(e) => e.preventDefault()}
          ></form>
        </div>
      </div>
    </section>
  );
};

export default Bookdemo;
