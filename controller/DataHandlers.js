import { saveAs } from "file-saver";

export const handleSave = (title, id) => {
  saveAs(
    `/files/${id}.pdf`,
    title,
  );
};

export async function handleGet(query) {
  const res = await fetch(query ? `/api?q=${query}` : '/api');
  const files = await res.json();
  return files;
}

export async function handlePost(files) {
  const body = new FormData();
  for (let i = 0; i < files.length; i++) {
    body.append(`file-${i}`, files[i]);
  }
  await fetch("/api/", {
    method: "POST",
    body: body,
  })
}