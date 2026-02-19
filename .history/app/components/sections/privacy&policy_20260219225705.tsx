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
            Location tracking is limited to working hours and work-related
            activities.
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

          <span className="font-medium text-black">
            We do not sell, rent, or trade personal data to third parties.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            4. Location Tracking Policy
          </span>

          <ul className="list-disc pl-10">
            <li>GPS tracking occurs only during duty or working hours.</li>
            <li>
              The application does not track location outside working hours.
            </li>
            <li>
              Certain features may not function if location services are
              disabled.
            </li>
          </ul>

          <span className="font-medium text-black">
            Location tracking is used strictly for work-related purposes.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            5. Data Storage and Security
          </span>

          <span>
            We implement appropriate technical and organizational security
            measures to protect your data, including : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Encrypted data transmission using HTTPS</li>
            <li>Secure and encrypted database storage</li>
            <li>Role-based access control</li>
            <li>Authentication and access logging</li>
            <li> Secure servers and regular backups</li>
            <li> Restricted access to authorized personnel only</li>
          </ul>

          <span className="font-medium text-black">
            Despite our efforts, no system can guarantee absolute security.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            6. Data Sharing and Third-Party Services
          </span>

          <span>
            We may share information with : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Internal company management and administrators</li>
            <li>
              Service providers such as cloud hosting, maps services, and
              email/SMS providers
            </li>
            <li>Government or legal authorities when required by law</li>
          </ul>

          <span className="font-medium text-black">
            Third-party service providers process data according to their own
            privacy policies. <br />
            We never sell or misuse employee data.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            7. Data Retention and Deletion
          </span>

          <ul className="list-disc pl-10">
            <li>
              Employee and work-related data is retained as long as required for
              business operations, legal compliance, or audit purposes.
            </li>
            <li>
              When employment ends or an account is deactivated, data may be
              archived or deleted according to company policy and legal
              requirements.
            </li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            8. User Rights
          </span>

          <span>
            Users may request : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Access to their personal data</li>
            <li>Correction of inaccurate or incomplete data</li>
            <li>Information about how their data is processed</li>
          </ul>

          <span className="font-medium text-black">
            Requests will be reviewed subject to company policies and applicable
            legal requirements.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            9. Cookies
          </span>

          <span>
            The OnDuty website may use cookies or similar technologies to :{" "}
            <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Maintain login sessions</li>
            <li>Improve website performance </li>
            <li>Analyze usage and traffic patterns</li>
          </ul>

          <span className="font-medium text-black">
            Users may manage cookie preferences through browser settings.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            10. Legal Compliance
          </span>

          <span>
            We process personal data in accordance with applicable laws,
            including the Information Technology Act, 2000 and related data
            protection regulations in India.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            11. Changes to This Policy
          </span>

          <span>
            We may update this Privacy Policy periodically. Changes will be
            posted on the website or application with an updated revision date.
            Continued use of the service indicates acceptance of the updated
            policy.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            12. Contact Information
          </span>

          <span>
            For privacy-related questions, concerns, or requests :
            <br />
          </span>

            <span>
              <b>Company Name:</b> Citrux
            </span>
            <span>
              <b>Email:</b> ondutycitrux@gmail.com
            </span>
            <span>
              <b>Address:</b> Siddipet IT Tower 2nd Floor, Telangana
            </span>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
