import React, { useState, useRef } from "react";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  className?: string;
  initialUrl?: string;
  onChange?: (file: File | null) => void;
  label?: string;
}

export default function FileUpload(props: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(props.initialUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setUploadedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        props.onChange?.(file);
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      props.onChange?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(props.initialUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    props.onChange?.(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={cn(
        "relative bg-[#F8F8F8] border border-[#EEEEEE] h-[101px] p-3 text-center cursor-pointer",
        props.className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!uploadedFile && !previewUrl ? (
        <div className="flex flex-col h-full justify-between">
          <div className="w-6 h-6 mx-auto mb-1.5 bg-white rounded-full flex items-center justify-center border border-gray-200">
            <Image
              src="/assets/icons/image-upload.svg"
              alt="image upload icon"
              width={24}
              height={24}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-x-3 text-[#BDBDBD]">
              <CloudUpload className="w-6 h-6" />
              <p className="font-medium text-base  leading-[22px]">
                {props.label || "Choose files or drag and drop"}
              </p>
            </div>
            <p className="font-normal text-sm text-[#BDBDBD]">Image (1MB)</p>
          </div>
        </div>
      ) : previewUrl && !uploadedFile ? (
        <div className="relative h-full">
          <Image
            src={previewUrl}
            alt="Current image"
            fill
            className="object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
            }}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-center items-center gap-x-3 text-[#BDBDBD]">
            <CloudUpload className="w-6 h-6" />
          </div>
          <div className="text-sm">
            <p className="text-gray-900 font-medium truncate">
              {uploadedFile?.name} ({uploadedFile ? formatFileSize(uploadedFile.size) : '0 Bytes'})
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <X className="w-3 h-3" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
