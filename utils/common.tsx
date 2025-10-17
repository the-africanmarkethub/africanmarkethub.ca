"use client";

import React from "react";
import ReactQueryClientProvider from "@/utils/ReactQueryClientProvider";
import { Toaster } from "sonner";

interface CommonProps {
  children: React.ReactNode;
}

const Common: React.FC<CommonProps> = ({ children }) => {
  return (
    <ReactQueryClientProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          },
        }}
      />
    </ReactQueryClientProvider>
  );
};

export default Common;
