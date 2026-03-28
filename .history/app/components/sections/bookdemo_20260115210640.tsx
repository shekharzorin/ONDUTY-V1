import { BsClockFill } from "react-icons/bs";
import { MdCall, MdLocationOn } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";

const Bookdemo = () => {
  return (
    <section className="flex flex-col gap-10 pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto items-center justify-center bg-linear-to-r from-[#eccfff]/50 to-[#fff0cd]/50 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-30 text-center gap-5">
        <p className="text-2xl lg:text-3xl font-bold leading-[1.15] lg:text-balance justify-center items-center">
          Connect with OnDuty
        </p>
        <p className="md:text-lg text-(--color-gray)">
          Have questions about OnDuty? We’re here to help.
        </p>
      </div>

      <div className="backdrop-blur-md border border-white bg-white/30 shadow-lg rounded-3xl p-7 md:p-10 flex flex-col gap-10 justify-center w-full max-w-md">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-xl">Contact Information</p>

          <div className="flex flex-col gap-5 text-(--color-gray)">
            <div className="flex gap-5 items-center">
              <MdCall
                className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                size={42}
              />
              <div>
                <p className="text-(--color-gray)">Number</p>
                <p className="font-medium text-black">+91 999 999 9999</p>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <TbMailFilled
                className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                size={42}
              />
              <div>
                <p className="text-(--color-gray)">Mail</p>
                <p className="font-medium text-black">onduty@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <MdLocationOn
                className="p-2 rounded-full bg-[#fff0cd]/50 border border-white"
                size={42}
              />
              <div>
                <p className="text-(--color-gray)">Office</p>
                <p className="font-medium text-black">
                  Siddipet IT Tower, 2nd floor
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-bold text-xl">Working Hours</p>
          <div className="flex gap-5 items-center text-(--color-gray)">
            <BsClockFill
              className="p-2.5 rounded-full bg-[#fff0cd]/50 border border-white"
              size={42}
            />
            <div>
              <p className="font-medium text-black">
                Monday - Friday : 10AM - 5PM
              </p>
              <p className="text-(--color-gray)">Weekend : Closed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bookdemo;
