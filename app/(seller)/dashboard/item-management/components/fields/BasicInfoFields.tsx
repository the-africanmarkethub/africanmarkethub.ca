"use client";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface BasicInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export default function BasicInfoFields({
  title,
  setTitle,
  description,
  setDescription,
}: BasicInfoProps) {
  const getWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, "").trim();
    return plainText ? plainText.split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(description);
  const charCount = description.length;

  return (
    <>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md input"
          placeholder="Enter item title"
          maxLength={250}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
          <span
            className={`ml-2 text-xs ${charCount > 4000 ? "text-red-500 font-bold" : "text-gray-400"}`}
          >
            ({charCount}/4000 characters)
          </span>
          <span
            className={`ml-2 text-xs ${wordCount < 50 ? "text-orange-500" : "text-green-600"}`}
          >
            {wordCount < 50
              ? `(Min 50 words needed: ${wordCount} current)`
              : `(${wordCount} words)`}
          </span>
        </label>

        <TinyMCEEditor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={description}
          init={{
            height: 300,
            menubar: false,
            branding: false,
            elementpath: false,
            plugins: "link lists wordcount",
            toolbar:
              "undo redo | formatselect | bold italic | bullist numlist | link",
            content_style:
              "body { font-family:Inter,Arial,sans-serif; font-size:14px; color:#374151 }",

            setup: (editor: any) => {
              // Strict enforcement of max characters
              editor.on("KeyDown", (e: any) => {
                const totalLength = editor.getContent().length;
                // Allow Backspace (8) and Delete (46)
                if (
                  totalLength >= 4000 &&
                  e.keyCode !== 8 &&
                  e.keyCode !== 46
                ) {
                  e.preventDefault();
                }
              });
            },
          }}
          onEditorChange={(content) => {
            // Only update if within character limit
            if (content.length <= 4000) {
              setDescription(content);
            }
          }}
        />
        {wordCount < 50 && charCount > 0 && (
          <p className="mt-1 text-xs text-orange-600">
            Please provide a bit more detail (minimum 50 words).
          </p>
        )}
      </div>
    </>
  );
}
