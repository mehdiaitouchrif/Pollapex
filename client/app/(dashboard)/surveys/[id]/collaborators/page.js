"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import SurveyOverview from "@/components/surveyOverview";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import {
  deleteCollaboratorHandler,
  fetchSurveyData,
  sendCollaborationInvite,
} from "@/utils/apiUtils/surveys";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loadingSpinner";

const CollaboratorsPage = ({ params: { id } }) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/surveys/${id}`);
    },
  });

  const [collaborators, setCollaborators] = useState([]);
  const [pendingCollabs, setPendingCollabds] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  // Delete question
  const deleteCollaborator = async (collaboratorId) => {
    try {
      const isDeleted = await deleteCollaboratorHandler(
        id,
        collaboratorId,
        session?.user?.token
      );

      if (isDeleted) {
        toast.success("Deleted!");
        setCollaborators((prev) =>
          prev.filter((user) => user._id !== collaboratorId)
        );
        setPendingCollabds((prev) =>
          prev.filter((user) => user._id !== collaboratorId)
        );
      } else {
        toast.error("Failed to delete. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting collaborator:", error);
      toast.error("Failed to delete. Please try again later.");
    }
  };

  //   Modal (invite users)
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const sendCollaborationInviteHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    const result = await sendCollaborationInvite(
      id,
      email,
      session?.user?.token
    );
    if (result.success) {
      toast.success(result.data);
      setLoading(false);
    }

    if (result.errors) {
      toast.error(result.errors[0].msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchSurveyData(id)
        .then((data) => {
          if (data.owner._id === session.user._id) {
            setIsOwner(true);
          }
          setCollaborators(data.collaborators);
          setPendingCollabds(data.pendingCollabs);
        })
        .catch((error) => {
          console.error("Error fetching survey: ", error);
        });
    }
  }, [session, id]);

  return (
    <>
      <SurveyOverview id={id} />

      <div className='h-full'>
        <div className='max-w-6xl mx-auto p-3 md:p-8'>
          <div className='flex items-center gap-8'>
            <Link
              href={`/surveys/${id}`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Overview
            </Link>
            <Link
              href={`/surveys/${id}/responses`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Responses
            </Link>
            <Link
              href={`/surveys/${id}/questions`}
              className='inline-block text-gray-600 text-lg hover:text-black'
            >
              Questions
            </Link>
            <Link
              href={`/surveys/${id}/collaborators`}
              className='inline-block text-lg font-semibold hover:text-black'
            >
              Collaborators
            </Link>
          </div>

          {collaborators.length === 0 && pendingCollabs.length === 0 && (
            <h2 className='mt-6 text-xl'>
              You have no collaborators on this survey yet.
            </h2>
          )}

          {collaborators.length > 0 && (
            <div className='px-4 py-2 my-4 rounded-lg bg-white shadow'>
              {collaborators.map((collaborator, idx) => (
                <div
                  key={collaborator._id}
                  className={`flex items-center justify-between py-2 my-2 border-b ${
                    idx === collaborators.length - 1
                      ? "border-b-transparent"
                      : "border-b-gray-100"
                  }`}
                >
                  <div className='mr-2'>
                    <h4 className='font-semibold text-gray-900'>
                      {collaborator.name}
                    </h4>
                    <p className='text-gray-400 text-sm'>
                      <strong>Email: </strong> {collaborator.email}
                    </p>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => deleteCollaborator(collaborator._id)}
                      className='inline-block rounded-lg shodow py-3 px-4 border bg-red-50 border-red-100 shadow hover:bg-red-100 duration-150 ease-in-out'
                    >
                      <FaTrash size={18} className='text-red-400' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {pendingCollabs.length > 0 && (
            <div className='px-4 py-2 my-4 rounded-lg bg-white shadow'>
              {pendingCollabs.map((collaborator, idx) => (
                <div
                  key={collaborator._id}
                  className={`flex items-center justify-between py-2 my-2 border-b ${
                    idx === pendingCollabs.length - 1
                      ? "border-b-transparent"
                      : "border-b-gray-100"
                  }`}
                >
                  <div className='mr-2'>
                    <h4 className='font-semibold text-gray-900'>
                      {collaborator.name}
                    </h4>
                    <p className='text-gray-400 text-sm'>
                      <strong>Email: </strong> {collaborator.email}
                    </p>
                    <div className='bg-blue-500 text-white font-medium p-1 rounded-lg text-sm shadow-sm mt-3 w-fit'>
                      Pending
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => deleteCollaborator(collaborator._id)}
                      className='inline-block rounded-lg shodow py-3 px-4 border bg-red-50 border-red-100 shadow hover:bg-red-100 duration-150 ease-in-out'
                    >
                      <FaTrash size={18} className='text-red-400' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isOwner && (
            <button
              onClick={openModal}
              className='inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg my-6'
            >
              Invite a new user
            </button>
          )}

          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className='text-xl my-2'>
              Enter the email of the user you want to collaborate with:
            </h2>
            {loading && <LoadingSpinner />}

            <form onSubmit={sendCollaborationInviteHandler}>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-semibold mb-2'
                  htmlFor='email'
                >
                  Email
                </label>
                <input
                  className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:hover:cursor-not-allowed'
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <input
                type='submit'
                value='Send request'
                className='inline-block py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700'
              />
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CollaboratorsPage;
