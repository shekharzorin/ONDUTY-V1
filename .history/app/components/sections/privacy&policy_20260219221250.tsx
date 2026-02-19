import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto w-full">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col gap-5 mt-30 mb-15 md:text-lg text-(--color-gray)">
        <p className="text-2xl lg:text-3xl text-black font-bold leading-normal lg:text-balance text-center justify-center items-center">
          PRIVACY POLICY <br />{" "}
          <span className="text-xl lg:text-2xl font-semibold ">
            OnDuty ( Employee Tracking System )
          </span>
        </p>
        <p>
          This Privacy Policy describes how OnDuty Employee Tracking System
          (“OnDuty”, “we”, “our”, or “us”) collects, uses, stores, and protects
          personal and work-related information of users.
        </p>
        <p>
          This policy applies to employees, field staff, administrators, and
          authorized users of the OnDuty website and application.
        </p>
        <p className="flex flex-col gap-1">
          The OnDuty platform is operated by : <br />
          <span>
            Company Name : Citrux Information and Technology <br />
            Address : Siddipet IT Tower 2nd Floor, Telangana <br />
            Jurisdiction : India
          </span>
        </p>
        <p>
          By using the OnDuty website or application, you consent to the
          collection and use of information in accordance with this Privacy
          Policy.
        </p>
        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            1. Information We Collect
          </span>
          <span>
            We collect the following categories of information to provide
            employee management and tracking services. <br />
          </span>

          <span className="font-semibold text-black">
            a) Personal Information
          </span>
          <ul className="list-disc pl-10">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
          </ul>

          <span className="font-semibold text-black">
            b) GPS Location Information
          </span>
          <ul className="list-disc pl-10">
            <li>Real-time location during duty hours</li>
            <li>Route history</li>
            <li>Check-in and check-out location for visits</li>
            <li>Field activity location data</li>
          </ul>
          <span className="font-medium text-black">
            Location tracking is limited to working hours and work-related activities.
          </span>

          <span className="font-semibold text-black">
            c) Device Information
          </span>
          <ul className="list-disc pl-10">
            <li>IP address</li>
            <li>Network type</li>
          </ul>

          <span className="font-semibold text-black">
            d) Work-related Information
          </span>
          <ul className="list-disc pl-10">
            <li>Attendance records</li>
            <li>Client visit details</li>
            <li>Tasks and targets</li>
            <li>Daily activity reports</li>
            <li>Uploaded documents, photos, or files</li>
          </ul>
        </div>

        <p className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            2. Purpose of Data Collection
          </span>
          <span>
            We collect information to : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Track attendance and working hours</li>
            <li>Verify field visits and improve employee safety</li>
            <li>Validate client meetings and work activities</li>
            <li>Generate operational reports and analytics</li>
            <li>Support administrative monitoring</li>
            <li>Improve operational efficiency and service quality</li>
            <li>Ensure compliance with company policies</li>
            <li>Send notifications, alerts, and updates</li>
            <li>Improve system functionality and performance</li>
          </ul>
        </p>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            3. How We Use Your Information
          </span>

          <span>
            Your information is used strictly for : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Internal business operations</li>
            <li>Employee performance evaluation</li>
            <li>Territory planning and route optimization</li>
            <li>Client management</li>
            <li>Application improvement and maintenance</li>
            <li>Administrative decision-making</li>
          </ul>

        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            4. Location Tracking Policy
          </span>

          <span>
            Your information is used strictly for : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Internal business operations</li>
            <li>Employee performance evaluation</li>
            <li>Territory planning and route optimization</li>
            <li>Client management</li>
            <li>Application improvement and maintenance</li>
            <li>Administrative decision-making</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
