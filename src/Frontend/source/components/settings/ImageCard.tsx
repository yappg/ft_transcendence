import Image from 'next/image';

export const ImageCard = ({
    selectedImage,
    handleImageChange,
    handleDeleteImage,
    profileError
} : {
    selectedImage: string | null,
    handleDeleteImage: () => void,
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    profileError: string,
}) => {
    return (        
    <div className='w-fit h-full flex items-center justify-center gap-6'>
    <Image
      src={selectedImage || '/ProfilePicture.svg'}
      alt='Profile picture'
      width={80}
      height={80}
      className='size-[80px] rounded-full bg-white bg-cover object-cover'
    />
    <div className='w-fit h-full flex flex-col items-start justify-center gap-2'>
      <h1 className='text-sm text-white tracking-wider'>Profile Picture</h1>
      <h1 className='text-sm text-gray-400 tracking-wider'>JPEG, JPG, max 5MB</h1>
      {profileError && <p className='text-red-600 text-sm'>{profileError}</p>}
    </div>
    <label
      htmlFor='profile-upload'
      className='py-2 px-4 bg-white text-black rounded-md cursor-pointer'
    >
      Change Picture
    </label>
    <input
      id='profile-upload'
      type='file'
      accept='image/jpeg, image/jpg'
      className='hidden'
      onChange={handleImageChange}
    />
    <button
      className='py-2 px-4 bg-red-600 text-white rounded-md'
      onClick={handleDeleteImage}
    >
      Delete
    </button>
  </div>)}