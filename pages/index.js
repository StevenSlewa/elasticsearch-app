import Header from "@/components/Header";
import { useEffect, useState } from "react";
import HomeSkeleton from "@/components/HomeSkeleton";
import DropZone from "@/components/DropZone";
import { handleGet, handleSave } from "@/controller/DataHandlers";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await handleGet();
      setFiles(data);
      setIsLoading(false);
    }

    fetchData();
  }, [])

  return (
    <main>
      <Header />

      <section className="w-8/12 mx-auto my-8">
        <DropZone {...{
          isPosting,
          setIsPosting,
          setFiles,
          setIsLoading,
        }} />
        <br />
        <br />
        <br />
        {
          isLoading ? (
            <HomeSkeleton />
          ) : (
            files.map((file) => {
              return (
                <div key={file._id} onClick={() => { handleSave(file.title, file._id); }} className="flex justify-between w-full mb-4 text-gray-400 py-4 px-4 rounded-md cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <p>{file.title}</p>
                  <p>{file._id}</p>
                </div>
              );
            })
          )
        }
      </section>
    </main>
  )
}
