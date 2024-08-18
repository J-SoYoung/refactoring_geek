export async function uploadCloudImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "thdud_preset");

  const cloudName = import.meta.env.VITE_APP_ClOUDINARY_NAME;
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: data,
    }
  );
  const json = await res.json();
  return json.secure_url;
}
