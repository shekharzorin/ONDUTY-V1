import React from "react";

const TermsAndConditions = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-384 mx-auto w-full">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-0 w-[60%] h-[60%] bg-[#eccfff] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
        <div className="absolute bottom-0 w-[60%] h-[60%] bg-[#fff0cd] rounded-full blur-3xl opacity-60 mix-blend-multiply filter" />
      </div>

      <div className="flex flex-col gap-5 mt-30 mb-15 md:text-lg text-(--color-gray)">
        <p className="text-2xl lg:text-3xl text-black font-bold leading-normal lg:text-balance text-center justify-center items-center">
          TERMS AND CONDITIONS <br />{" "}
          <span className="text-xl lg:text-2xl font-semibold ">
            OnDuty ( Employee Tracking System )
          </span>
        </p>
        <p>
          These Terms and Conditions (“Terms”) govern the use of the OnDuty
          Employee Tracking System (“OnDuty”, “we”, “our”, or “us”). By
          accessing or using the OnDuty website or application, you agree to
          comply with these Terms.
        </p>
        <p>
          If you do not agree with these Terms, you must not use the system.
        </p>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            1. Service Description
          </span>
          <span>
            OnDuty is an employee management and tracking system that provides :{" "}
            <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Attendance tracking</li>
            <li>GPS location tracking during working hours</li>
            <li>Field visit monitoring</li>
            <li>Task and performance management</li>
            <li>Work reporting and analytics</li>
            <li>Administrative monitoring tools</li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            2. Eligibility and Authorized Use
          </span>

          <ul className="list-disc pl-10">
            <li>
              The system may only be used by authorized employees,
              administrators, or approved users.
            </li>
            <li>Users must provide accurate and complete information.</li>
            <li>
              Users are responsible for maintaining the confidentiality of their
              login credentials.
            </li>
            <li>Unauthorized access or use is strictly prohibited.</li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            3. User Responsibilities
          </span>

          <span>
            Users agree to : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Use the system only for official work purposes</li>
            <li>Provide accurate work-related information</li>
            <li>Maintain account security</li>
            <li>Not misuse or manipulate tracking features</li>
            <li>Not attempt to access unauthorized data</li>
            <li>Not upload harmful, illegal, or inappropriate content</li>
          </ul>

          <span className="font-medium text-black">
            Violation may result in suspension or termination of access.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            4. Account Access and Security
          </span>

          <ul className="list-disc pl-10">
            <li>
              Users are responsible for all activities under their account.
            </li>
            <li>Passwords must not be shared.</li>
            <li>
              Users must notify administrators of unauthorized access
              immediately.
            </li>
            <li>
              We are not responsible for loss caused by unauthorized account
              use.
            </li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            6. Acceptable Use Restrictions
          </span>

          <span>
            Users must not : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Use the system for unlawful purposes</li>
            <li>Attempt to hack, damage, or disrupt services</li>
            <li>Interfere with system security</li>
            <li>
              Copy, modify, or distribute system content without permission
            </li>
            <li>Use the platform for personal or non-work activities</li>
          </ul>

          <span className="font-medium text-black">
            Despite our efforts, no system can guarantee absolute security.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            7. Intellectual Property Rights
          </span>

          <ul className="list-disc pl-10">
            <li>
              All software, content, design, and features of OnDuty are owned by
              the company.
            </li>
            <li>
              Users are granted limited permission to use the system for work
              purposes only.
            </li>
            <li>Unauthorized copying or reproduction is prohibited.</li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            8. Service Availability
          </span>

          <ul className="list-disc pl-10">
            <li>
              We aim to provide uninterrupted service but do not guarantee
              continuous availability.
            </li>
            <li>
              The system may be temporarily unavailable due to maintenance or
              technical issues.
            </li>
            <li>We are not liable for service interruptions.</li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            9. Data and Privacy
          </span>

          <ul className="list-disc pl-10">
            <li>Use of the system is also governed by our Privacy Policy.</li>
            <li>
              Users acknowledge that work-related and operational data may be
              monitored and recorded.
            </li>
            <li>
              Data handling practices are explained in the Privacy Policy.
            </li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            10. Suspension or Termination of Access
          </span>

          <span>
            We may suspend or terminate access if : <br />
          </span>

          <ul className="list-disc pl-10">
            <li>Terms are violated</li>
            <li>Unauthorized activity is detected</li>
            <li>Employment or authorization ends</li>
            <li>System misuse occurs</li>
          </ul>

          <span className="font-medium text-black">
            Termination may occur without prior notice.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            11. Limitation of Liability
          </span>

          <ul className="list-disc pl-10">
            <li>The system is provided “as is” without warranties.</li>
            <li>
              We are not liable for indirect, incidental, or consequential
              damages.
            </li>
            <li>
              We are not responsible for data loss, service interruptions, or
              technical failures beyond our control.
            </li>
          </ul>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            12. Changes to Terms
          </span>

          <span>
            We may update these Terms at any time. Updated Terms will be posted
            on the website or application. Continued use of the system indicates
            acceptance of the updated Terms.
          </span>
        </div>

        <div className="flex flex-col mt-3 gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-black">
            14. Contact Information
          </span>
          <span>
            For questions regarding these Terms:
            <br />
          </span>
          <span>
            <b>Company Name :</b> Citrux
          </span>
          <span>
            <b>Email :</b> ondutycitrux@gmail.com
          </span>
          <span>
            <b>Address :</b> Siddipet IT Tower 2nd Floor, Telangana
          </span>
          <span>
            <b>Number :</b> +91 987 654 3210
          </span>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
