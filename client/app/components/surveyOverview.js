"use client";
import { useState, useEffect } from "react";
import { MdContentCopy, MdDownload } from "react-icons/md";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import SkeletonBox from "./skeleton";
import toast from "react-hot-toast";
import { FaCog } from "react-icons/fa";
import Modal from "./modal";
import {
  editSurveyHandler,
  fetchSurveyData,
  publishOrDisableSurveyHandler,
} from "../utils/apiUtils/surveys";
import { exportResponsesToExcel } from "../utils/apiUtils/responses";
import LoadingSpinner from "./loadingSpinner";

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
  const [dynamicUrl, setDynamicUrl] = useState("");

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
      const updatedData = await publishOrDisableSurveyHandler(
        id,
        session?.user?.token,
        survey
      );
      setSurvey(updatedData);
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
      const updatedSurvey = {
        title: survey.title,
        description: survey.description,
      };

      const updatedData = await editSurveyHandler(
        id,
        updatedSurvey,
        session?.user?.token
      );

      setSurvey(updatedData);
      toast.success("Survey updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating survey:", error);
      toast.error("Failed to update the survey. Please try again later.");
    }
  };

  const [excelLoading, setExcelLoading] = useState(false);
  const exportResponses = async () => {
    try {
      setExcelLoading(true);
      const blob = await exportResponsesToExcel(id, session?.user?.token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "survey_responses.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setExcelLoading(false);
      toast.success("Download successfull!");
    } catch (error) {
      console.error("API request failed:", error);
      setExcelLoading(false);
    }
  };

  // API requests
  useEffect(() => {
    const url = `${window.location.origin}/${id}`;
    setDynamicUrl(url);

    const fetchSurvey = async () => {
      try {
        const surveyData = await fetchSurveyData(id, session?.user?.token);
        setSurvey(surveyData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch survey data. Please try again later.");
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
          survey && (
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
              <p className='leading-6 mt-2 text-gray-600'>
                {survey.description}
              </p>

              <div className='flex flex-col md:flex-row items-left md:items-center gap-2 md:gap-8'>
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
                    className='flex items-center justify-between border py-2 px-4 rounded bg-gray-50 item'
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    <Link
                      target='_blank'
                      href={`/${id}`}
                      className='inline-block w-full'
                    >
                      Share Survey Now!
                    </Link>
                    <MdContentCopy
                      className='ml-4 text-green-600 cursor-pointer hover:text-gray-500'
                      size={20}
                    />
                  </div>
                )}

                {excelLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div
                    className='flex items-center justify-between border py-2 px-4 rounded bg-blue-500 text-white font-medium'
                    onClick={exportResponses}
                  >
                    <button className='inline-block w-full'>
                      Download Responses Excel
                    </button>
                    <MdDownload
                      className='ml-4 text-white cursor-pointer hover:text-gray-200'
                      size={20}
                    />
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SurveyOverview;
