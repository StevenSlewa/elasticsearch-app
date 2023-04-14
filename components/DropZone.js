import { handleGet, handlePost } from '@/controller/DataHandlers';
import { useDropzone } from 'react-dropzone';
import { UploadSvg, LoadingSvg } from '@/assets/svgs'

function DropZone({ isPosting, setIsPosting, setIsLoading, setFiles }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      await postData(acceptedFiles);
    }
  });

  const handleFileSelect = e => {
    let files = [...e.target.files];

    if (files && files.length > 0) {
      postData(files);
    }
  };

  async function postData(files) {
    setIsPosting(true)
    await handlePost(files)
    setIsPosting(false)

    setIsLoading(true)
    const data = await handleGet();
    setFiles(data);
    setIsLoading(false)
  }

  return (
    <div {...getRootProps()} className=" flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        {
          isPosting ?
            (<div role="status" className='w-10 h-10 text-gray-200'>
              <LoadingSvg />
              <span className="sr-only">Loading...</span>
            </div>)
            : (
              <>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className='h-10 w-10 mb-5'><UploadSvg /></div>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input {...getInputProps()} id="dropzone-file" multiple type="file" className="hidden"
                  onChange={handleFileSelect} />
              </>
            )
        }
      </label>
    </div>
  );
}

export default DropZone;