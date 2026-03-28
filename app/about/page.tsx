import Footer from "../components/footer/footer";
import About from "../components/sections/about";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <About />
      <Footer />
    </div>
  );
};

export default page;
