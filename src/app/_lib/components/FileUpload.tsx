"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Button, Input, Tooltip } from "@nextui-org/react";

interface InputFileProps { }

export default function FileUpload(props: InputFileProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveClick = () => {
        setSelectedFile(null);
    };

    return (
        <div className="flex flex-col w-full items-center gap-4">
            <label htmlFor="file-upload" className="w-full">
                <Input
                    id="file-upload"
                    onChange={handleFileChange}
                    type="file"
                    className="hidden"
                />
                <Button as="span" className="w-full">
                    Seleccionar archivo
                </Button>
            </label>
            {selectedFile && (
                <div className="">
                    <Tooltip content="Eliminar archivo" placement="right">
                        <Image
                            src={selectedFile}
                            alt="Previsualización"
                            width={500}
                            height={500}
                            className="rounded-xl hover:cursor-pointer"
                            onClick={handleRemoveClick}
                        />
                    </Tooltip>
                </div>
            )}
        </div>
    );
}