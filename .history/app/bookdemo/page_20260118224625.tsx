import Footer from "../components/footer/footer";
import Bookdemo from "../components/sections/bookdemo";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Bookdemo />
      <Footer />
    </div>
  );
};

export default page;
