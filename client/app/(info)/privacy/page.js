import Header from "@/components/header";
import Footer from "@/components/footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto mb-8 p-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Privacy Policy
          </h1>
          <p className="mb-4 text-gray-500">Effective Date: October 22, 2024</p>
        </div>
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Pollapex! This Privacy Policy explains how we collect, use,
          and protect your personal information when you use our survey
          application. By using Pollapex, you agree to the collection and use of
          information in accordance with this policy.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          2. Information We Collect
        </h2>
        <p className="mb-4">
          When you create an account, we collect personal information, such as:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Your name and email address when you sign up directly or via Google
            or GitHub.
          </li>
          <li>
            Survey data that you create or respond to within the platform.
          </li>
          <li>
            Usage data, such as your interactions with the app, to improve our
            services.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">
          3. How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To create and manage your Pollapex account.</li>
          <li>
            To allow you to create and manage surveys, and export data as
            needed.
          </li>
          <li>
            To send you email notifications about survey invitations, account
            management, and updates.
          </li>
          <li>
            To improve the overall performance and user experience of Pollapex.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">
          4. Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell or share your personal information with third parties
          for their marketing purposes. However, we may share information with
          service providers who assist us in operating the platform (e.g., email
          services or hosting) to the extent necessary for them to perform their
          services.
        </p>
        <h2 className="text-2xl font-semibold mb-3">5. Security</h2>
        <p className="mb-4">
          We take the security of your personal information seriously. We use
          reasonable measures to protect your data from unauthorized access or
          disclosure. However, no method of internet transmission or electronic
          storage is completely secure, so we cannot guarantee absolute
          security.
        </p>
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p className="mb-4">
          You have the right to update your account information, delete your
          account, or request a copy of your data at any time. To exercise these
          rights, use the application interface or contact us.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          7. Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Effective Date." Please review this policy periodically
          for any updates.
        </p>
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at
          <a className="text-blue-600 ml-1" href="mailto:pollapex@gmail.com">
            pollapexteam@gmail.com
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
