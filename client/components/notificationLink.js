"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser } from "@/utils/apiUtils/auth";
import { IoNotificationsOutline } from "react-icons/io5";
import Link from "next/link";

const NotificationDropdown = () => {
  const { data: sessionData } = useSession();

  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    getUser(sessionData?.user?.token).then(({ data }) => {
      const filteredInvitations = data.invitations.filter(
        (invite) => !invite.accepted && invite.survey
      );
      setInvitations(filteredInvitations);
    });
  }, [sessionData]);

  return (
    <div className="relative inline-block text-left">
      <Link href="/invitations">
        <IoNotificationsOutline
          className="text-gray-500 hover:text-red-600 transition-colors duration-150 ease-linear"
          size={26}
        />
        {invitations.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "red",
              color: "white",
              borderRadius: "100%",
              fontSize: "12px",
              width: "16px",
              height: "16px",
              textAlign: "center",
            }}
          >
            {invitations.length}
          </div>
        )}
      </Link>
    </div>
  );
};

export default NotificationDropdown;
