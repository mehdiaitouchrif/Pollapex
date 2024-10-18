"use client";
import { useState } from "react";
import { useSurveyData } from "@/utils/hooks/useSurveyData";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  fetchSurveyData,
  deleteCollaboratorHandler,
} from "@/utils/apiUtils/surveys";
import CollaboratorsList from "@/components/collaboratorsList";
import InviteModal from "@/components/inviteModal";

const CollaboratorsPage = ({ params: { id } }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const { data, loading, error, mutate } = useSurveyData(id, fetchSurveyData);

  const isOwner = data?.owner?._id === session?.user?._id;
  const collaborators = data?.collaborators || [];
  const pendingCollabs = data?.pendingCollabs || [];

  const handleDelete = async (collaboratorId) => {
    if (deletingIds.has(collaboratorId)) return;

    setDeletingIds((prev) => new Set([...prev, collaboratorId]));

    try {
      const isDeleted = await deleteCollaboratorHandler(
        id,
        collaboratorId,
        session?.user?.token
      );

      if (isDeleted) {
        toast.success("Collaborator removed successfully");
        mutate(); // Refresh the data
      } else {
        toast.error("Failed to remove collaborator");
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast.error("Failed to remove collaborator. Please try again later.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(collaboratorId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="inset-0 mt-10 flex justify-center ">
        <div className="inset-0 opacity-50"></div>
        <div className="z-10 p-4 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">
          Error loading collaborators
        </h3>
        <p className="text-gray-500 mb-4">
          {error.message || "Please try again later"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <CollaboratorsList
        collaborators={collaborators}
        pendingCollabs={pendingCollabs}
        isOwner={isOwner}
        onDelete={handleDelete}
      />

      {isOwner && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg my-6"
        >
          Invite a new user
        </button>
      )}

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surveyId={id}
        token={session?.user?.token}
      />
    </div>
  );
};

export default CollaboratorsPage;
