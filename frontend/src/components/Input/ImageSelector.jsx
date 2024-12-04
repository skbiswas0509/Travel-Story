import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleDeleteImg}) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if(file){
        setImage(file);
      }
    }
    const onChooseFule = () => {
      inputRef.current.click();
    };

    const handleRemoveImage = () => {
      setImage(null)
      handleDeleteImg();
    }
    useEffect(() => {
      //if the image prop is a stringurl, set it as a preview url
      if(typeof image === 'string'){
        setPreviewUrl(image);
      }else if (image){
        //if the the image prop is file obect, create a preview url
        setPreviewUrl(URL.createObjectURL(image));
      }else{
        //if there is no image, clear the preview url
        setPreviewUrl(null);
      }

      return () => {
        if (previewUrl && typeof previewUrl === 'string' && !image) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    })

  return (
    <div>
        <input type="file"
        accept='image/*' 
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
        />

        {!image ? <button className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/5' 
        onClick={() => onChooseFule()}>
            <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
                <FaRegFileImage className='text-xl text-cyan-500' />
            </div>

            <p className="text-sm text-slate-500">Brows iamge files to upload</p>
        </button> : 

          <div className="w-full relative">
            <img src={previewUrl} alt="Selected" className='w-full h-[360px] object-cover rounded-lg'/>

            <button className="btn-small btn-delete absolute top-2 right-2"
            onClick={handleRemoveImage}>
              <MdDeleteOutline className='text-lg' />
            </button>
          </div>
        }
    </div>
  )
}

export default ImageSelector