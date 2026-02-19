import Footer from "../components/footer/footer";
import ContactModal from "../components/sections/contact";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ContactModal />
      <Footer />
    </div>
  );
};

export default page;
