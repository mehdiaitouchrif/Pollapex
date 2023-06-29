import Link from "next/link";
import Image from "next/image";
import { FaShare, FaChartBar, FaFileExport, FaPlus } from "react-icons/fa";
import Header from "./components/header";
import Footer from "./components/footer";

const Home = async () => {
  return (
    <main>
      <Header />

      {/* First section */}
      <section
        style={{ marginTop: "80px" }}
        className='max-w-6xl mx-auto p-4 my-16 grid md:grid-cols-2 gap-16'
      >
        <div className='w-full order-2 md:order-1'>
          <Image
            className='rounded-xl p-2'
            style={{ width: "100%" }}
            src='/img/data-analysis.gif'
            alt='data analysis gif'
            height={100}
            width={100}
          />
        </div>
        <div className='order-1 md:order-2'>
          <div className='mb-8'>
            <h2 className='text-7xl'>Build</h2>
            <h2 className='text-7xl'>powerful</h2>
            <h2 className='text-7xl'>surveys!</h2>
          </div>

          <p className='text-2xl'>
            Get more <span className='font-bold'>data—like</span>, feedback,
            conduct studies, and anything
            <span className='font-bold'> else—with</span> Pollapex effortlessly.
          </p>
          <Link
            className='inline-block my-6 font-semibold rounded-xl py-3 px-6 bg-black text-white hover:shadow-lg hover:bg-gray-900 hover:duration-150 hover:ease-in-out'
            href='/signup'
          >
            Get started-it{"'"}s free!
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ margin: "100px auto" }} className='p-4 max-w-6xl'>
        <div className='grid md:grid-cols-3'>
          <div className='hidden md:block'>
            <h2 className='text-4xl mb-4' style={{ lineHeight: 1.15 }}>
              Robust Features, Seamless Experience
            </h2>
            <p className='my-4'>
              Discover features designed to enhance your productivity and your
              workflow. Our seamless user experience ensures a hassle-free
              journey, allowing you to focus on what matters most.
            </p>
            <Link
              className='inline-block my-4 py-3 px-6 bg-black text-white rounded-lg hover:shadow-lg hover:bg-neutral-800 transition hover:duration-150 focus:outline-none focus:shadow-outline'
              href='/dashboard'
            >
              Explore Now
            </Link>
          </div>

          <div className='col-span-2 flex flex-wrap md:mt-auto md:pl-12 gap-y-8'>
            <div className='w-full sm:w-1/2 px-4 mb-8'>
              <div className='p-4 mb-4 rounded-2xl bg-yellow-50 w-fit'>
                <FaPlus size={40} color='#346c66' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                Create Unlimited Surveys
              </h3>
              <p className='text-gray-600'>
                Effortlessly generate as many surveys as you need to gather
                valuable insights from your audience. No limitations or
                restrictions.
              </p>
            </div>

            <div className='w-full sm:w-1/2 px-4 mb-8'>
              <div className='p-4 mb-4 rounded-2xl bg-yellow-50 w-fit'>
                <FaShare size={40} color='#346c66' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                Easily Share surveys
              </h3>
              <p className='text-gray-600'>
                Easily distribute your surveys by sharing a unique URL with your
                participants. Reach audiences and collect responses
                conveniently.
              </p>
            </div>
            <div className='w-full sm:w-1/2 px-4 mb-8'>
              <div className='p-4 mb-4 rounded-2xl bg-yellow-50 w-fit'>
                <FaChartBar size={40} color='#346c66' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                Collect and visualize responses
              </h3>
              <p className='text-gray-600'>
                Gather responses from your surveys and gain valuable insights.
                Effortlessly visualize data to understand trends, and make
                informed decisions.
              </p>
            </div>
            <div className='w-full sm:w-1/2 px-4 mb-8'>
              <div className='p-4 mb-4 rounded-2xl bg-yellow-50 w-fit'>
                <FaFileExport size={40} color='#346c66' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                Export your data anywhere
              </h3>
              <p className='text-gray-600'>
                Seamlessly export your survey data to various formats and
                integrate it with other tools or systems. Take your data with
                you wherever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer */}
      <section
        className='p-16 bg-black text-white mt-8 text-center'
        style={{ borderTopLeftRadius: "6rem", borderTopRightRadius: "6rem" }}
      >
        <h1 className='text-6xl leading-10 my-4 hidden md:block'>
          Revitalize data capture,
          <span className='block my-7'>streamlined forms.</span>
        </h1>

        <h3 className='text-xl font-semibold my-4 mt-14'>
          Our platform lets you:
        </h3>

        <div>
          <p>Create unlimited surveys</p>
          <p>Start visualizing your data</p>
          <p>Export your data for analysis</p>
          <p></p>
        </div>

        <Link
          href='signup'
          className='inline-block my-4 mt-8 bg-white text-gray-900 font-semibold rounded-xl py-3 px-6 hover:-translate-y-1 hover:shadow hover:shadow-purple-100 duration-200 ease-in-out hover:bg-gray-100'
        >
          Sign up
        </Link>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
