import React from "react";
import { toast } from "react-toastify";

const NotifySuccess = (message: string) => {
  return <>{toast.success(message)}</>;
};

export default NotifySuccess;
