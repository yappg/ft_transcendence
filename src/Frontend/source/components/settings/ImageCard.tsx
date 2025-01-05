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
  let imageUrl = selectedImage;
  if (imageUrl && !imageUrl.startsWith('blob')) {
    imageUrl = 'http://localhost:8080' + imageUrl;
  }
  return (
    <div className="flex h-full w-fit flex-wrap items-center justify-center gap-1 sm:gap-6">
      <img
        src={`${imageUrl}`}
        alt="Profile picture"
        width={80}
        height={80}
        className="size-[60px] rounded-full bg-white bg-cover object-cover sm:size-[80px]"
      />
      <div className="flex h-full w-fit flex-col items-start justify-center gap-2">
        <h1 className="text-sm tracking-wider text-white">Profile Picture</h1>
        <h1 className="text-sm tracking-wider text-gray-400">JPEG, JPG, max 5MB</h1>
        {profileError && <p className="text-sm text-red-600">{profileError}</p>}
      </div>
      <label
        htmlFor="profile-upload"
        className="cursor-pointer rounded-md bg-white px-2 py-1 text-black sm:px-4 sm:py-2"
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
