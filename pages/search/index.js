import Header from "@/components/Header";
import { useState } from "react";
import { handleGet, handleSave } from "@/controller/DataHandlers";
import { SearchSvg } from "@/assets/svgs";

export default function Search() {
    const [files, setFiles] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    async function fetchData(query) {
        setIsLoading(true)
        const data = await handleGet(query);
        setFiles(data);
        setIsLoading(false)
    }

    const handleSearch = e => {
        const val = e.target.value.toString().trim()
        setSearchVal(val)
        fetchData(val)
    }

    const getHighlightedContent = (file) => {
        const content = file.attachment?.content;

        if (content) {
            const index = content.toLowerCase().indexOf(searchVal.toLowerCase());
            if (index !== -1) {
                const startIndex = Math.max(0, index - 100);
                const fragment = content.substr(startIndex, 200);

                return (
                    <span>
                        {startIndex > 0 && <span>...</span>}
                        {fragment.split(RegExp(`(${searchVal})`, "gi"))
                            .map((part, i) => {
                                return part.toLowerCase() === searchVal.toLowerCase() ? (
                                    <span key={i} className="bg-amber-200 bg-opacity-20 text-white px-2 py-1 rounded-md">{part}</span>
                                ) : (
                                    part
                                )
                            })}
                        {startIndex + fragment.length < content.length && <span>...</span>}
                    </span>
                );
            } else {
                return (
                    <span>{content}</span>
                );
            }
        } else {
            return null;
        }
    };

    return (
        <main>
            <Header />

            <section className="max-w-xl mx-auto my-8">
                <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchSvg className={`w-6 h-6 text-white transform  duration-500 ease-in-out transition-transform  ${isLoading ? 'animate-pulse rotate-45 -translate-x-2 ' : ''}`} />
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
                            <div key={file._id} onClick={() => { handleSave(file.title, file._id); }} className="w-full mb-4 text-gray-400 rounded-md cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" >
                                <div className="flex justify-between  py-4 px-4 ">
                                    <p className="text-white">{file.title}</p>
                                    <p className="text-amber-500 text-xs">{file._id}</p>
                                </div>
                                <div className="p-4">
                                    {searchVal.trim() != '' ? getHighlightedContent(file) : ''}
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    )
}

{/* {
                                        searchVal.trim() === "" ? (
                                            <b>{file.attachment?.content}</b>
                                        ) : (
                                            <span>
                                                {
                                                    
                                                    
                                                    file.attachment?.content?.split(RegExp(`(${searchVal})`, "gi"))
                                                    .map((part, i) => {



                                                        return part.toLowerCase() === searchVal.toLowerCase() ? (
                                                            <b key={i}>{part}</b>
                                                        ) : (
                                                            part
                                                        )

                                                    })
                                                }
                                            </span>
                                        )
                                    } */}