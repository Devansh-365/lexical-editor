import { useState } from "react";
import axios from "axios";

export default function ImageUploadComponent({ onUpload }: { onUpload: any }) {
  const [file, setFile] = useState<any>(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "caxbcy1y");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvdn0fbf6/image/upload",
        formData
      );
      onUpload(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
}
