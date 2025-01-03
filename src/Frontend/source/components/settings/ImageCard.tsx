import Image from 'next/image';

export const ImageCard = ({
  selectedImage,
  handleImageChange,
  profileError,
}: {
  selectedImage: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profileError: string;
}) => {
  return (
    <div className="w-fit h-full flex items-center justify-center sm:gap-6 gap-1 flex-wrap">
      <img
        src={`http://localhost:8080${selectedImage}`}
        alt="Profile picture"
        width={80}
        height={80}
        className="sm:size-[80px] size-[60px] rounded-full bg-white bg-cover object-cover"
      />
      <div className="w-fit h-full flex flex-col items-start justify-center gap-2">
        <h1 className="text-sm text-white tracking-wider">Profile Picture</h1>
        <h1 className="text-sm text-gray-400 tracking-wider">JPEG, JPG, max 5MB</h1>
        {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
      </div>
      <label
        htmlFor="profile-upload"
        className="sm:py-2 sm:px-4 py-1 px-2 bg-white text-black rounded-md cursor-pointer"
      >
        Change Picture
      </label>
      <input
        id="profile-upload"
        type="file"
        accept="image/jpeg, image/jpg"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

