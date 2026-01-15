import React from "react";
import type { User } from "../welcome/types";

interface UserBadgeProps {
  user?: User;
  onClick?: () => void;
}

const UserBadge: React.FC<UserBadgeProps> = ({ user, onClick }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="mt-1 text-xs text-slate-400 underline-offset-2 hover:text-blue-400 hover:underline"
    >
      Assigned to:{" "}
      <span className="cursor-pointer font-medium">
        {user?.name ?? "Unknown"}
      </span>
    </button>
  );
};

export default UserBadge;
