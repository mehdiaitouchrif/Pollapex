"use client";
import LoadingSpinner from "@/components/loadingSpinner";
import { getUser } from "@/utils/apiUtils/auth";
import {
  acceptCollaborationInvite,
  declineCollaborationInvite,
} from "@/utils/apiUtils/surveys";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSmile, FaCheck } from "react-icons/fa";

const InvitationsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/invitations`);
    },
  });

  const [invitations, setInvitations] = useState(null);

  const acceptCollaborationInviteHandler = async (inviteToken) => {
    try {
      const isAccepted = await acceptCollaborationInvite(
        inviteToken,
        session?.user?.token
      );

      if (isAccepted) {
        setInvitations((invitations) => {
          return invitations.map((invitation) => {
            if (invitation.invitationToken === inviteToken) {
              return { ...invitation, accepted: true };
            }
            return invitation;
          });
        });
        toast.success("Collaboration accepted!");
      } else {
        toast.error("Couldn't perform this action. Try later");
      }
    } catch (error) {
      console.error("Error accepting", error);
      toast.error("Something went wrong. Try later");
    }
  };

  const declineCollaborationInviteHandler = async (inviteToken) => {
    try {
      const isDeclined = await declineCollaborationInvite(
        inviteToken,
        session?.user?.token
      );

      if (isDeclined) {
        setInvitations((invitations) => {
          return invitations.filter(
            (invitation) => invitation.invitationToken !== inviteToken
          );
        });
        toast.success("Removed invite");
      } else {
        toast.error("Couldn't perform this action. Try later");
      }
    } catch (error) {
      console.error("Error declining", error);
      toast.error("Something went wrong. Try later");
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      getUser(session.user.token)
        .then(({ data }) => {
          setInvitations(data.invitations);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    }
  }, [session]);

  if (!invitations) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-normal my-4 uppercase">
        Collaboration Invites
      </h1>

      {invitations && invitations.length === 0 && (
        <div className="flex items-center gap-4">
          <FaSmile size={40} className="text-yellow-400" />
          <h2 className="my-4 text-lg font-semibold">Nothing here yet!</h2>
        </div>
      )}

      {invitations
        ?.sort((a, b) => (a.accepted === b.accepted ? 0 : a.accepted ? 1 : -1))
        .map((invite) => (
          <div
            key={invite._id}
            className="p-4 rounded-lg shadow-md border border-gray-200 my-3 bg-white flex flex-col md:flex-row items-start md:items-center justify-between"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-gray-800">
                {invite?.survey?.title || "Survey removed"}
              </h3>

              <div className="flex items-center gap-3 text-gray-600">
                <Image
                  src={invite?.survey?.owner?.picture || "/default_avatar.png"}
                  alt="Invite sender profile image"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <p>{invite?.survey?.owner?.name || "Unknown"}</p>
              </div>
            </div>

            <div className="mt-3 md:mt-0 flex items-center gap-4">
              {invite.accepted && invite.invitationToken !== "expired" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheck size={18} />
                  <p className="font-medium">Accepted</p>
                </div>
              ) : invite.invitationToken === "expired" || !invite.survey ? (
                <div className="text-red-500 font-medium">Unavailable</div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      acceptCollaborationInviteHandler(invite.invitationToken)
                    }
                    className="rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 shadow-md transition duration-200 ease-in-out"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      declineCollaborationInviteHandler(invite.invitationToken)
                    }
                    className="rounded-md bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 shadow-md transition duration-200 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default InvitationsPage;
