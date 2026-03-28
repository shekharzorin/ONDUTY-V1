import Footer from "../components/footer/footer";
import About from "../components/sections/about";

const page = () => {
  return (
    <div className="flex flex-col">
      <About />
      <Footer/>
    </div>
  );
};

export default page;
