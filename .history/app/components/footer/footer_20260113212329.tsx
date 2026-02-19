import Image from "next/image";
import Logo from "@/app/images/od_logo.png";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerLinks: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Pricing", href: "/pricing/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy&policy" },
    ],
  },
  {
    title: "Social",
    links: [
      {
        label: "Facebook",
        href: "https://www.facebook.com",
        external: true,
        icon: <FaFacebook size={22}/>,
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com",
        external: true,
        icon: <FaInstagram size={22}/>,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com",
        external: true,
        icon: <FaYoutube size={22}/>,
      },
    ] as any,
  },
];

const Footer = () => {
  return (
    <section
      id="footer"
      className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 w-full border-t border-gray-200"
    >
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#fff4da] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>
      <div className="md:text-lg flex flex-col py-5 lg:py-10 lg:flex-row lg:justify-between gap-10 lg:gap-20">
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

        <div className="flex flex-wrap text-(--color-gray) justify-between w-full px-5 lg:px-0 text-center gap-5">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-5">
              <p className="text-black text-lg lg:text-xl font-semibold mb-3">
                {section.title}
              </p>

              {section.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external === true ? "_blank" : undefined}
                  rel={
                    link.external === true ? "noopener noreferrer" : undefined
                  }
                  className="hover:text-(--color-primary) transition"
                >
                  <p className="flex items-center gap-2 justify-center">
                    {link.icon}
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <hr className="text-gray-300 mt-5" />
      <div className="md:text-lg text-(--color-gray) flex flex-col md:flex-row md:justify-between gap-5 my-5">
        <p> © 2026 OnDuty. All rights reserved. </p>
        <Link href="#">
          <p>Terms & Conditions</p>
        </Link>
      </div>
    </section>
  );
};

export default Footer;
