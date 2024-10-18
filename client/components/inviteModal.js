import { useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loadingSpinner";
import { sendCollaborationInvite } from "@/utils/apiUtils/surveys";

const InviteModal = ({ isOpen, onClose, surveyId, token }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendCollaborationInvite(surveyId, email, token);

      if (result.success) {
        toast.success(result.data);
        setEmail("");
        onClose();
      } else if (result.errors) {
        toast.error(result.errors[0].msg);
      }
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl my-2">
        Enter the email of the user you want to collaborate with:
      </h2>
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:hover:cursor-not-allowed"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-block py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Send request
        </button>
      </form>
    </Modal>
  );
};

export default InviteModal;
