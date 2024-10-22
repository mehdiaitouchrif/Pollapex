import Link from "next/link";

const Footer = () => (
  <footer className="bg-gray-100">
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">Pollapex</h3>
          <p className="text-gray-600">
            Empowering your surveys with modern solutions.
          </p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="text-md font-semibold mb-2">Quick Links</h4>
          <ul className="text-gray-600">
            <li>
              <Link
                href="#features"
                className="hover:text-gray-900 transition duration-300"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-gray-900 transition duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://github.com/mehdiaitouchrif/Pollapex"
                className="hover:text-gray-900 transition duration-300"
              >
                Source code
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="text-md font-semibold mb-2">Support</h4>
          <ul className="text-gray-600">
            <li>
              <Link
                href="/faq"
                className="hover:text-gray-900 transition duration-300"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition duration-300"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition duration-300"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/4">
          <h4 className="text-md font-semibold mb-2">Stay Connected</h4>
          <p className="text-gray-600 mb-2">Subscribe to our newsletter</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 w-full border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
        <p>&copy; 2024 Pollapex. All rights reserved.</p>
        <p>
          Developed by{" "}
          <Link
            target="_blank"
            className="text-blue-400 hover:text-blue-500 hover:shadow-sm"
            href="https://github.com/mehdiaitouchrif"
          >
            Mehdi Ait Ouchrif
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
