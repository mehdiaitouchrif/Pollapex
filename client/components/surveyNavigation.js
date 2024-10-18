"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SurveyNavigation = ({ id }) => {
  const pathname = usePathname();

  const navItems = [
    { href: `/surveys/${id}`, label: "Overview" },
    { href: `/surveys/${id}/responses`, label: "Responses" },
    { href: `/surveys/${id}/questions`, label: "Questions" },
    { href: `/surveys/${id}/collaborators`, label: "Collaborators" },
  ];

  return (
    <div className="flex items-center gap-8">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`inline-block text-lg hover:text-black ${
            pathname === href ? "font-semibold" : "text-gray-600"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default SurveyNavigation;
