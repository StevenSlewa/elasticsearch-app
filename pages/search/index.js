import Header from "@/components/Header";
import { useState } from "react";

export default function Search() {
    const [files, setFiles] = useState([]);


    const saveFile = (title, id) => {
        saveAs(
            `/files/${id}.pdf`,
            title,
        );
    };

    async function getData(q) {

        const res = await fetch(`/api?q=${q}`)        
        const files = await res.json()

        setFiles(files)

    }

    const handleSearch = e => {
        getData(e.target.value)
    }

    return (
        <main>
            <Header />

            <section className="max-w-xl mx-auto my-8">

                <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        className="block w-full px-4 rounded-md cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 border-gray-300 py-2 pl-12 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        type="text"
                        placeholder="Search"
                        onChange={handleSearch}
                    />
                </div>

                <br />
                <br />
                <br />

                {

                    files.map((file) => {
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