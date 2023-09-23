"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser } from "@/utils/apiUtils/auth";
import { IoNotificationsOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const NotificationDropdown = () => {
  const { data: sessionData } = useSession();

  const [invitations, setInvitations] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    getUser(sessionData?.user?.token).then(({ data }) => {
      const filteredInvitations = data.invitations.filter(
        (invite) => !invite.accepted && invite.survey
      );
      setInvitations(filteredInvitations);
    });

    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, [isOpen, sessionData]);

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <button
        type='button'
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <IoNotificationsOutline className='text-gray-500' size={26} />
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
      </button>
      {isOpen && (
        <div
          className='origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
          role='menu'
          aria-orientation='vertical'
        >
          <div role='none'>
            {invitations.map((invite) => (
              <Link
                href='/invitations'
                key={invite._id}
                className='inline-block w-full px-4 py-2  hover:bg-gray-50 hover:cursor-pointer border-b'
              >
                <div className='flex items-start justify-between gap-2'>
                  <Image
                    src={invite?.survey?.owner?.picture}
                    alt='Sender picture'
                    width={40}
                    height={40}
                  />
                  <p>
                    <strong>{invite?.survey?.owner?.name || "Unknown"}</strong>{" "}
                    invited you to collaborate on a survey
                  </p>
                </div>
              </Link>
            ))}

            {invitations.length === 0 && (
              <div className='py-3 px-4'>No notifications yet!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
