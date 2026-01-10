import { Buffer } from "buffer";

export const fileToDataURI = (
  file: File | Blob
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const dataURItoBlob = (dataURI: string): Blob => {
  const [header, data] = dataURI.split(",");
  const mime = header.split(":")[1].split(";")[0];
  const buffer = header.includes("base64")
    ? Buffer.from(data, "base64")
    : decodeURIComponent(data);

  return new Blob([buffer], { type: mime });
};
