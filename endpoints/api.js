import { GET_QUERY, POST_QUERY } from "@/shared/constants/endpoints";
import { saveAs } from "file-saver";

export const handleSave = (title, id) => {
  saveAs(
    `/files/${id}.pdf`,
    title,
  );
};

export async function handleGet(query) {
  const res = await fetch(query?.length===0 ? `${GET_QUERY}?q=''` : query? `${GET_QUERY}?q=${query}` : GET_QUERY);
  const files = await res.json();
  return files;
}

export async function handlePost(files) {
  const body = new FormData();
  for (let i = 0; i < files.length; i++) {
    body.append(`file-${i}`, files[i]);
  }
  await fetch(POST_QUERY, {
    method: "POST",
    body: body,
  })
}