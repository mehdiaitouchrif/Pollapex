"use client";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Pollapex?",
      answer:
        "Pollapex is an online survey tool where users can create, share, and collect responses for surveys. You can sign up using email, Google, or GitHub, and export your survey results in CSV or Excel format.",
    },
    {
      question: "How do I create a survey?",
      answer:
        "Once you're logged in, click on the 'Create Survey' button in your dashboard. You can add multiple questions, share the survey link with others, and start collecting responses right away.",
    },
    {
      question: "Can I collaborate on a survey with others?",
      answer:
        "Yes! You can invite collaborators to your surveys via email. They’ll receive an invitation to join and can help you edit the survey and view the results.",
    },
    {
      question: "How can I export my survey data?",
      answer:
        "After collecting responses, you can export your survey results as a CSV or Excel file from your survey dashboard. Just click on the 'Export' button to download the file.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We take your privacy and security seriously. While no system is 100% secure, we implement industry-standard measures to protect your data. You can also manage your account settings and delete your data anytime.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "If you forget your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions on how to reset your password.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account at any time by going to the account settings. Be aware that deleting your account will remove all of your surveys and data permanently.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h2 className="text-2xl font-semibold text-gray-800 py-4 flex justify-between items-center">
                {faq.question}
                <span
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </h2>
              <div
                className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 py-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
