"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiShare2,
  FiBarChart2,
  FiDownload,
  FiPlusCircle,
} from "react-icons/fi";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="text-indigo-600 mb-4">
      <Icon size={40} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-10 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Create Powerful Surveys with Ease
                </h1>
                <p className="text-xl mb-8">
                  Gather insights, make decisions, and drive your business
                  forward with Pollapex's intuitive survey platform.
                </p>
                <Link
                  href="/signup"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div
                className="md:w-2/5 ml-auto"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src="/img/undraw_survey.svg"
                  alt="Survey Illustration"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50" id="features">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Powerful Features for Seamless Surveys
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={FiPlusCircle}
                title="Create Unlimited Surveys"
                description="Design and launch as many surveys as you need, without any restrictions."
              />
              <FeatureCard
                icon={FiShare2}
                title="Easy Sharing"
                description="Distribute your surveys effortlessly with unique, shareable links."
              />
              <FeatureCard
                icon={FiBarChart2}
                title="Real-time Analytics"
                description="Visualize responses instantly with our powerful analytics dashboard."
              />
              <FeatureCard
                icon={FiDownload}
                title="Export Anywhere"
                description="Download your data in multiple formats for seamless integration."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="p-16 bg-indigo-600 text-white mt-8 text-center"
          style={{ borderTopLeftRadius: "6rem", borderTopRightRadius: "6rem" }}
        >
          <h1 className="text-6xl leading-10 my-4 hidden md:block">
            Revitalize data capture,
            <span className="block my-7">streamlined forms.</span>
          </h1>

          <div className="container mx-auto px-6 text-center">
            <p className="text-xl mb-8">
              Join thousands of satisfied users and start creating impactful
              surveys today.
            </p>
            <Link
              href="/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Start Now, It's Free!
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
