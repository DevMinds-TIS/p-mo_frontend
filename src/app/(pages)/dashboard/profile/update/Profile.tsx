// import { FileUpload } from "@/app/_lib/components/FileUpload";
// import { useDisclosure, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
// import { Camera01Icon } from "hugeicons-react";

// export default function UpdateProfile() {
//     const { isOpen, onOpen, onOpenChange } = useDisclosure();
//     return (
//         <section className="w-full h-full rounded-full">
//             <Button onPress={onOpen} className="w-full h-full rounded-full">
//                 <Camera01Icon
//                     size={30}
//                 />
//             </Button>
//             <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//                 <ModalContent>
//                     {(onClose) => (
//                         <>
//                             <ModalHeader className="flex flex-col gap-1">Actualiza tu perfil</ModalHeader>
//                             <ModalBody>
//                                 <form action="">
//                                     Imagen de perfil
//                                     <FileUpload />
//                                 </form>
//                             </ModalBody>
//                             <ModalFooter>
//                                 <Button color="primary" onPress={onClose} className="w-full">
//                                     Action
//                                 </Button>
//                             </ModalFooter>
//                         </>
//                     )}
//                 </ModalContent>
//             </Modal>
//         </section>
//     );
// }

import { FileUpload } from "@/app/_lib/components/FileUpload";
import { useDisclosure, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Camera01Icon } from "hugeicons-react";
import { useState, useEffect } from "react";

type User = {
  iduser: number;
  profileuser?: string;
};

export default function UpdateProfile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !user) {
      console.error("File or user not found");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const formData = new FormData();
    formData.append("profileuser", file);

    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.iduser}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la imagen de perfil");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      onOpenChange();
    } catch (error) {
      console.error("Error al actualizar la imagen de perfil:", error);
    }
  };

  return (
    <section className="w-full h-full rounded-full">
      <Button onPress={onOpen} className="w-full h-full rounded-full">
        <Camera01Icon size={30} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">Actualiza tu perfil</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  Imagen de perfil
                  <FileUpload onChange={handleFileChange} />
                  <Button type="submit" className="w-full mt-4">
                    Actualizar
                  </Button>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
