const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/auto/upload`;

console.log("Cloud name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chatify-file");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload the file");
  }

  const responseData = await response.json();
  return responseData;
};
