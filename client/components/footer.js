import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='p-4 bg-neutral-900 text-white'>
      <div className='max-w-lg text-center mx-auto'>
        <h2 className='text-3xl font-bold my-4'>Pollapex</h2>
        <p>
          Pollapex - Building Powerful Surveys and Polls, Collect valuable
          insights and feedback effortlessly.
        </p>
        <div className='flex gap-1  justify-center mt-4'>
          <Link
            target='_blank'
            href='https://github.com/mehdiaitouchrif/Pollapex'
            className='hover:text-gray-300'
          >
            <FaGithub size='24px' />
          </Link>
          <Link
            target='_blank'
            href='https://linkedin.com/in/mehdiaitouchrif'
            className='hover:text-gray-300'
          >
            <FaLinkedin size='24px' />
          </Link>
        </div>

        <hr className='my-10' />

        <div>
          <p>Copyright &copy; Pollapex. All rights reserved.</p>
          <p>
            Developed by{" "}
            <Link
              target='_blank'
              className='text-blue-400 hover:text-blue-500 hover:shadow-sm'
              href='https://github.com/mehdiaitouchrif'
            >
              Mehdi Ait Ouchrif
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
