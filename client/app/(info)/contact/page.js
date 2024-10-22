import Header from "@/components/header";
import Footer from "@/components/footer";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          If you have any questions, feedback, or suggestions, feel free to
          reach out!
        </p>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-4">You can contact us via email:</p>
          <a
            href="mailto:pollapexteam@gmail.com"
            className="text-blue-600 hover:underline mb-4 block"
          >
            pollapexteam@gmail.com
          </a>
          <p className="text-gray-600 mb-4">
            Or reach (me) the developer directly:
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/mehdiaitouchrif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/mehdiaitouchrif/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="mailto:mehdi.aitouchrif@outlook.com"
              className="text-blue-600 hover:underline"
            >
              Email
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
