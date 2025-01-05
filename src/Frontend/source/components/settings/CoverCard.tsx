import Image from 'next/image';

export const CoverCard = ({
  coverImage,
  handleCoverChange,
  coverError,
}: {
  coverImage: string | null;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverError: string;
}) => {
  let imageUrl = coverImage;
  if (imageUrl && !imageUrl.startsWith('blob')) {
    imageUrl = 'http://localhost:8080' + imageUrl;
  }
  return (
    <div className="w-fit h-full flex items-center justify-center sm:gap-6 gap-1 flex-wrap">
      <img
        src={`${imageUrl}` || '/ProfilePicture.svg'}
        alt="Cover picture"
        width={200}
        height={100}
        className="lg:w-[200px] sm:w-[150px] w-[60px] h-[60px] rounded-md bg-white bg-cover object-cover"
      />
      <div className="w-fit h-full flex flex-col items-start justify-center gap-2">
        <h1 className="text-lg text-white tracking-wider">Cover Picture</h1>
        <h1 className="text-sm text-gray-400 tracking-wider">JPEG, JPG, max 5MB</h1>
        {coverError && <p className="text-red-600 text-sm">{coverError}</p>}
      </div>
      <label
        htmlFor="cover-upload"
        className="sm:py-2 sm:px-4 py-1 px-2 bg-white text-black rounded-md cursor-pointer"
      >
        Change Cover
      </label>
      <input
        id="cover-upload"
        type="file"
        accept="image/jpeg, image/jpg"
        className="hidden"
        onChange={handleCoverChange}
      />
    </div>
  );
};
