"use client";

import React from "react";
import ReactQueryClientProvider from "@/utils/ReactQueryClientProvider";

interface CommonProps {
  children: React.ReactNode;
}

const Common: React.FC<CommonProps> = ({ children }) => {
  return <ReactQueryClientProvider> {children}</ReactQueryClientProvider>;
};

export default Common;
