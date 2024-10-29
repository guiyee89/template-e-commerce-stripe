import { useState } from "react";
import { deleteUnusedImages } from "../../../../../../../firebaseConfig";

export const DeleteImages = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUnusedImages = async () => {
    setIsDeleting(true);
    await deleteUnusedImages();
    setIsDeleting(false);
  };

  
  return (
    <div style={{ position: "absolute", right: "0", top: "20px" }}>
      <button onClick={handleDeleteUnusedImages} disabled={isDeleting}>
        {isDeleting ? "Cleaning up..." : "Delete Unused Images"}
      </button>
    </div>
  );
};
