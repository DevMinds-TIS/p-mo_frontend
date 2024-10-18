// "use client";

// import { Button, Tooltip } from "@nextui-org/react";
// import React, { useState } from "react";

// export const FileUpload = () => {
//     const [file, setFile] = useState<string>();
//     const [fileEnter, setFileEnter] = useState(false);

//     return (
//         <div className="w-full">
//             {!file ? (
//                 <div
//                     onDragOver={(e) => {
//                         e.preventDefault();
//                         setFileEnter(true);
//                     }}
//                     onDragLeave={(e) => {
//                         setFileEnter(false);
//                     }}
//                     onDragEnd={(e) => {
//                         e.preventDefault();
//                         setFileEnter(false);
//                     }}
//                     onDrop={(e) => {
//                         e.preventDefault();
//                         setFileEnter(false);
//                         if (e.dataTransfer.items) {
//                             Array.from(e.dataTransfer.items).forEach((item, i) => {
//                                 if (item.kind === "file") {
//                                     const file = item.getAsFile();
//                                     if (file) {
//                                         let blobUrl = URL.createObjectURL(file);
//                                         setFile(blobUrl);
//                                     }
//                                     console.log(`items file[${i}].name = ${file?.name}`);
//                                 }
//                             });
//                         } else {
//                             Array.from(e.dataTransfer.files).forEach((file, i) => {
//                                 console.log(`… file[${i}].name = ${file.name}`);
//                             });
//                         }
//                     }}
//                     className={`${fileEnter ? "border-4" : "border-2"
//                         } flex flex-col w-full h-96 border-dashed rounded-lg`}
//                 >
//                     <label
//                         htmlFor="file"
//                         className="h-full flex flex-col justify-center text-center hover:cursor-pointer"
//                     >
//                         Haz click para subir o arrastra y suelta
//                     </label>
//                     <input
//                         id="file"
//                         type="file"
//                         className="hidden"
//                         onChange={(e) => {
//                             console.log(e.target.files);
//                             let files = e.target.files;
//                             if (files && files[0]) {
//                                 let blobUrl = URL.createObjectURL(files[0]);
//                                 setFile(blobUrl);
//                             }
//                         }}
//                     />
//                 </div>
//             ) : (
//                 <div className="flex flex-col gap-4">
//                     <Tooltip content="Eliminar archivo" placement="right">
//                         <object
//                             className="rounded-md w-full h-96 hover:cursor-pointer"
//                             data={file}
//                             type="image/png"
//                             onClick={() => setFile("")}
//                         />
//                     </Tooltip>
//                     <Button 
//                         onClick={() => setFile("")}
//                         color="danger"
//                         className="w-full"
//                     >
//                         Descartar
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };


"use client";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [file, setFile] = useState<string>();
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
    <div className="w-full">
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
          className={`${fileEnter ? "border-4" : "border-2"} flex flex-col w-full h-96 border-dashed rounded-lg`}
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
        <div className="flex flex-col gap-4">
          <Tooltip content="Eliminar archivo" placement="right">
            <object className="rounded-md w-full h-96 hover:cursor-pointer" data={file} type="image/png" onClick={() => handleFileChange(null)} />
          </Tooltip>
          <Button onClick={() => handleFileChange(null)} color="danger" className="w-full">
            Descartar
          </Button>
        </div>
      )}
    </div>
  );
};
