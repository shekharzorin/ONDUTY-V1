import Footer from "../components/footer/footer";
import Bookdemo from "../components/sections/bookdemo";

const page = () => {
  return (
    <div className="flex flex-col">
      <Bookdemo />;
      <Footer />
    </div>
  );
};

export default page;
