import React, { useEffect, useState } from "react";
import { ImageForm } from "./ImageForm";
import { uploadFile } from "../../../../../../../../firebaseConfig";

export const ImageFormContainer = ({
  newProduct,
  setNewProduct,
  existingImages,
  selectedItem,
  setSelectedItem,
}) => {
  let [allSelectedFiles, setAllSelectedFiles] = useState([]);
  const [isQueueProcessing, setIsQueueProcessing] = useState(false); // Use a queue to handle concurrency of handleImage
  const [imageQueue, setImageQueue] = useState([]); // State for manage images loading order

  //Loader after image upload success
  const [isLoadingImage, setIsLoadingImage] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  //Loader while image upload
  const [isLoading, setIsLoading] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [file, setFile] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  //Confirmed image upload state
  const [confirmedImageUpload, setConfirmedImageUpload] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  /////*****         HANDLE IMAGE INPUTS        ******///////

  // Activate states for handling image uploading queues
  const handleImage = (inputNumber) => {
    setIsQueueProcessing(true);
    setIsLoading((prevLoading) => ({
      ...prevLoading,
      [inputNumber]: true,
    }));
    try {
      // Add the image upload request to the queue
      setImageQueue((prevQueue) => [
        ...prevQueue,
        { inputNumber, selectedFiles: file[inputNumber] },
      ]);
    } catch (error) {}
  };

  //fetch original image URL and replace for resized image URL
  const getResizedImageUrl = async (originalUrl) => {
    try {
      // Construct the URL for the resized image based on the original URL
      const resizedUrl = originalUrl.replace(/(\.[^.]*)?$/, "_982x1243$1");
     
      // Return the resized URL
      return resizedUrl;
    } catch (error) {
      console.error("Error getting resized image URL:", error);
      throw error;
    }
  };

  //Image queue processing
  useEffect(() => {
    const handleImageQueue = async () => {
      if (imageQueue.length > 0) {
        const { inputNumber, selectedFiles } = imageQueue[0];

        try {
          const newUrls = await Promise.all(
            selectedFiles.map(async (selectedFile) => {
              return await uploadFile(selectedFile);
            })
          );

          const resizedUrls = await Promise.all(
            newUrls.map(async (newUrl) => {
              const resizedUrl = await getResizedImageUrl(newUrl);
              return resizedUrl;
            })
          );

          // Set the uploaded image URLs to the corresponding input numbers
          if (selectedItem) {
            setSelectedItem((prevSelectedItem) => {
              const imgCopy = [...(prevSelectedItem.img || [])];
              imgCopy[inputNumber - 1] = resizedUrls[0];
              return {
                ...prevSelectedItem,
                img: imgCopy,
              };
            });
          } else {
            setNewProduct((prevProduct) => {
              const imgCopy = [...(prevProduct.img || [])];
              imgCopy[inputNumber - 1] = resizedUrls[0];
              return {
                ...prevProduct,
                img: imgCopy,
              };
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          // Reset the loading state after the upload is complete or if an error occurs
          setIsLoading((prevLoading) => ({
            ...prevLoading,
            [inputNumber]: false,
          }));

          setIsLoadingImage((prevLoading) => ({
            ...prevLoading,
            [inputNumber]: true,
          }));

          // Set the confirmedImageUpload state for this input to true
          setConfirmedImageUpload((prevConfirmedImageUpload) => ({
            ...prevConfirmedImageUpload,
            [inputNumber]: true,
          }));

          // Remove the processed item from the queue
          setImageQueue((prevQueue) => {
            const updatedQueue = [...prevQueue];
            updatedQueue.shift(); // Use shift to remove the first item
            return updatedQueue;
          });

          setTimeout(() => {
            setIsLoadingImage((prevLoading) => ({
              ...prevLoading,
              [inputNumber]: false,
            }));
          }, 2000);
        }
      } else {
        // No more items in the queue, set isQueueProcessing to false
        setIsQueueProcessing(false);
      }
    };
    // Call handleImageQueue initially
    if (imageQueue.length > 0) {
      handleImageQueue();
    }
  }, [imageQueue, selectedItem, newProduct]);

  // Merge the selected files with the existing files for the input
  const handleFileInputChange = (inputNumber, selectedFiles) => {
    const updatedFiles = { ...file };
    updatedFiles[inputNumber] = [
      ...updatedFiles[inputNumber],
      ...selectedFiles,
    ];

    setFile(updatedFiles);
    // Combine all the selected files into one array
    allSelectedFiles = Object.keys(updatedFiles).reduce((acc, key) => {
      return [...acc, ...updatedFiles[key]];
    }, []);

    setAllSelectedFiles(allSelectedFiles);
  };

  //////////         CANCEL / DELETE IMAGES       ///////////
  const handleCancelFile = (inputNumber) => {
    // Create a copy of the current file object
    const updatedFiles = { ...file };
    // Clear the selected file at the specified inputNumber
    updatedFiles[inputNumber] = [];

    setFile(updatedFiles);
    // Combine all the selected files into one array
    const allSelectedFiles = Object.keys(updatedFiles).reduce((acc, key) => {
      if (Array.isArray(updatedFiles[key])) {
        return [...acc, ...updatedFiles[key]];
      } else {
        return acc;
      }
    }, []);
    setAllSelectedFiles(allSelectedFiles);
    // Clear the file input value
    const fileInput = document.querySelector(`#fileInput${inputNumber}`);
    if (fileInput) {
      fileInput.value = ""; // Reset the input value
    }

    // Set the confirmedImageUpload state for this input to false
    setConfirmedImageUpload((prevConfirmedImageUpload) => ({
      ...prevConfirmedImageUpload,
      [inputNumber]: false,
    }));
  };

  const handleDeleteImage = (inputNumber) => {
    setIsLoadingImage((prevLoading) => ({
      ...prevLoading,
      [inputNumber]: true,
    }));

    const imgCopy = [...(selectedItem?.img || [])];
    // Mark the deleted slot as empty
    imgCopy[inputNumber - 1] = null;

    if (selectedItem) {
      setSelectedItem({ ...selectedItem, img: imgCopy });
      setTimeout(() => {
        setIsLoadingImage((prevLoading) => ({
          ...prevLoading,
          [inputNumber]: false,
        }));
      }, 2000);
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        img: imgCopy,
      }));
    }
  };

  return (
    <>
      <ImageForm
        selectedItem={selectedItem}
        existingImages={existingImages}
        handleImage={handleImage}
        isLoadingImage={isLoadingImage}
        handleDeleteImage={handleDeleteImage}
        confirmedImageUpload={confirmedImageUpload}
        file={file}
        handleFileInputChange={handleFileInputChange}
        handleCancelFile={handleCancelFile}
        isLoading={isLoading}
      />
    </>
  );
};
