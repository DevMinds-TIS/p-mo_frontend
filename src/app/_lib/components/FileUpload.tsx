"use client";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  existingFile?: { name: string; url: string } | null;
  readOnly?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange, existingFile, readOnly = false, className }) => {
  const [file, setFile] = useState<string | undefined>(existingFile?.url);
  const [fileEnter, setFileEnter] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      let blobUrl = URL.createObjectURL(file);
      setFile(blobUrl);
      onChange(file);
    } else {
      setFile(undefined);
      onChange(null);
    }
  };

  return (
    <div className={`${className}`}>
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={() => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (e.dataTransfer.items) {
              Array.from(e.dataTransfer.items).forEach((item, i) => {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  handleFileChange(file);
                }
              });
            } else {
              Array.from(e.dataTransfer.files).forEach((file) => {
                handleFileChange(file);
              });
            }
          }}
          className={`${fileEnter ? "border-4" : "border-2"} flex flex-col w-full h-full border-dashed rounded-lg ${className}`}
        >
          <label htmlFor="file" className="h-full flex flex-col justify-center text-center hover:cursor-pointer">
            Haz click para subir o arrastra y suelta
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => {
              let files = e.target.files;
              if (files && files[0]) {
                handleFileChange(files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full">
          {!readOnly && (
            <Tooltip content="Eliminar archivo" placement="right">
              <object className="rounded-md w-full h-full hover:cursor-pointer" data={file}  onClick={() => handleFileChange(null)} />
            </Tooltip>
          )}
          {readOnly && (
            <Tooltip content="Abrir archivo en otra ventana" placement="right">
                <object className="rounded-md w-full h-full hover:cursor-pointer" data={file}  />
            </Tooltip>
          )}
          {!readOnly && (
            <Button onClick={() => handleFileChange(null)} color="danger" className="w-full h-12 font-bold text-lg">
              Descartar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};