import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";


export default function Home({data}) {
  const [files, setFiles] = useState([]);

async function getData(){

 const res = await fetch("/api")
 const files = await res.json()

 setFiles( files)
}

async function postData(files){

  // const body = new FormData();
  //   body.append("file", image);
  //   const response = await fetch("/api/file", {
  //     method: "POST",
  //     body
  //   });

    const res = await fetch(`http://localhost:8000/api/docs`, {
      method: "POST",
      body: files,
    })
 
 console.log(res)
  }

  useEffect(()=>{
    getData();
  },[])

  const saveFile = (title, id) => {
    saveAs(
        `/files/${id}.pdf`,
        title,
    );
};


  const handleFileSelect = e => {

    // get files from event on the input element as an array
    let files = [...e.target.files];

    // ensure a file or files are selected
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      postData(files);
    }
  };


  return (
    <main>
      <Header />

      <section className="w-8/12 mx-auto my-8">

        <div className=" flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" multiple type="file" className="hidden"
             onChange={handleFileSelect} />
          </label>
        </div>

        <br />
        <br />
        <br />

        {
          files.map((file)=>{
            return (
              <div key={file._id} onClick={() => { saveFile(file.title, file._id); }} className="flex justify-between w-full mb-4 text-gray-400 py-4 px-4 rounded-md cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <p>{file.title}</p> 
                <p>{file._id}</p>
              </div>
            );
          })
        }
      </section>

    </main>
  )
}
