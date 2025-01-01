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
  return (
    <div className="w-fit h-full flex items-center justify-center gap-6 flex-wrap">
      <Image
        src={coverImage || '/ProfilePicture.svg'}
        alt="Cover picture"
        width={200}
        height={100}
        className="w-[200px] h-[100px] rounded-md bg-white bg-cover object-cover"
      />
      <div className="w-fit h-full flex flex-col items-start justify-center gap-2">
        <h1 className="text-lg text-white tracking-wider">Cover Picture</h1>
        <h1 className="text-sm text-gray-400 tracking-wider">JPEG, JPG, max 5MB</h1>
        {coverError && <p className="text-red-600 text-sm">{coverError}</p>}
      </div>
      <label
        htmlFor="cover-upload"
        className="py-2 px-4 bg-white text-black rounded-md cursor-pointer"
      >
        Upload Cover
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
