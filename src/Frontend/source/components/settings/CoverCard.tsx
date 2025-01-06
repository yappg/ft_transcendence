import Image from "next/image";

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
  if (imageUrl && !imageUrl.startsWith("blob")) {
    imageUrl = "http://localhost:8080" + imageUrl;
  }
  return (
    <div className="flex h-full w-fit flex-wrap items-center justify-center gap-1 sm:gap-6">
      <Image
        src={`${imageUrl}` || "/ProfilePicture.svg"}
        alt="Cover picture"
        width={200}
        height={100}
        className="size-[60px] rounded-md bg-white bg-cover object-cover sm:w-[150px] lg:w-[200px]"
        unoptimized
      />
      <div className="flex h-full w-fit flex-col items-start justify-center gap-2">
        <h1 className="text-lg tracking-wider text-white">Cover Picture</h1>
        <h1 className="text-sm tracking-wider text-gray-400">
          JPEG, JPG, max 5MB
        </h1>
        {coverError && <p className="text-sm text-red-600">{coverError}</p>}
      </div>
      <label
        htmlFor="cover-upload"
        className="cursor-pointer rounded-md bg-white px-2 py-1 text-black sm:px-4 sm:py-2"
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
