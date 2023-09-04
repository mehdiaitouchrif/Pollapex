"use client";
import { useState, useEffect } from "react";
import { MdContentCopy } from "react-icons/md";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import SkeletonBox from "./skeleton";
import toast from "react-hot-toast";
import { FaCog } from "react-icons/fa";
import Modal from "./modal";

const SurveyOverview = ({ id }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}`);
    },
  });
  const [survey, setSurvey] = useState({});
  const [loading, setLoading] = useState(true);

  // Survey Public Link
  const [isCopied, setIsCopied] = useState(false);
  const dynamicUrl = `${window.location.origin}/${id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dynamicUrl);
      setIsCopied(true);
      toast.success("Copied!");
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  // Publish survey
  const publishOrDisableSurvey = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          active: survey.active ? "false" : "true",
          published: survey.published ? "false" : "true",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update survey.");
      }

      const { survey: data } = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update the survey. Please try again later.");
    }
  };

  // Edit survey (on modal)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [e.target.name]: e.target.value,
    }));
  };

  const editSurvey = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: survey.title,
          description: survey.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update survey.");
      }

      const { survey: data } = await response.json();
      setSurvey(data);
      toast.success("Success!");
      closeModal();
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update the survey. Please try again later.");
    }
  };

  // API requests
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/surveys/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch survey data.");
        }

        const { data: survey } = await response.json();
        setSurvey(survey);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      fetchSurvey();
    }
  }, [session, id]);

  return (
    <div className='bg-white border-t shadow'>
      <div className='max-w-6xl mx-auto p-4 md:p-8 my-6'>
        {loading ? (
          <SkeletonBox />
        ) : (
          <>
            <div className='flex items-center justify-between'>
              {survey.active ? (
                <div className='p-2 text-sm w-fit rounded-lg bg-green-200 text-green-600'>
                  Active
                </div>
              ) : (
                <div className='p-2 text-sm w-fit rounded-lg bg-red-100 text-red-500'>
                  Inactive
                </div>
              )}

              <div className='mb-auto'>
                <FaCog
                  size={30}
                  className='text-gray-400 hover:text-gray-500 cursor-pointer'
                  onClick={openModal}
                />
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <h2 className='text-2xl my-4'>Edit Survey </h2>

                  <form
                    className='p-4 my-4 rounded-lg shadow-sm bg-white border border-gray-100'
                    onSubmit={editSurvey}
                  >
                    <div className='relative z-0 w-full mb-6 group'>
                      <input
                        type='text'
                        name='title'
                        id='title'
                        value={survey.title}
                        onChange={handleChange}
                        className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        required
                      />
                      <label
                        htmlFor='title'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                      >
                        Title
                      </label>
                    </div>

                    <div className='relative z-0 w-full mb-6 group'>
                      <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={survey.description}
                        onChange={handleChange}
                        rows={4}
                        className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        required
                      />
                      <label
                        htmlFor='description'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                      >
                        Description
                      </label>
                    </div>

                    <button
                      type='submit'
                      className='inline-block my-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow'
                    >
                      Save Changes
                    </button>
                  </form>
                </Modal>
              </div>
            </div>

            <h2 className='text-3xl mt-4 font-semibold'>{survey.title}</h2>
            <p className='leading-10 text-gray-600'>{survey.description}</p>

            <div className='flex items-center gap-8'>
              {survey.active ? (
                <button
                  onClick={publishOrDisableSurvey}
                  className='inline-block py-2 px-4 bg-red-100 text-red-500 rounded-lg my-4'
                >
                  Disable survey
                </button>
              ) : (
                <button
                  onClick={publishOrDisableSurvey}
                  className='inline-block py-2 px-4 bg-blue-500 text-white font-bold rounded-lg my-4'
                >
                  Publish Survey
                </button>
              )}

              {survey.active && (
                <div
                  className='flex items-center border py-2 px-4 rounded bg-gray-50 item'
                  onClick={handleCopy}
                  disabled={isCopied}
                >
                  <Link target='_blank' href={`/${id}`}>
                    {dynamicUrl}
                  </Link>
                  <MdContentCopy
                    className='ml-4 text-green-600 cursor-pointer hover:text-gray-500'
                    size={20}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyOverview;
