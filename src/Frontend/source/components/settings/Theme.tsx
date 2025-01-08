import { useTheme } from "next-themes";
import Image from "next/image";
const Theme = () => {
  const { setTheme } = useTheme();
  return (
    <div className="m-10 flex size-4/5 flex-col items-center justify-center md:flex-row">
      <div className="flex h-full w-1/3 flex-col items-center justify-center gap-3">
        <button
          className="size-[150px] overflow-hidden rounded-[10px] transition-all duration-200 hover:border-2"
          onClick={() => setTheme("light")}
        >
          <Image
            src="white.png"
            className="size-full"
            width={150}
            height={150}
            alt={""}
            unoptimized
          ></Image>
        </button>
        <h1 className="font-dayson text-lg text-white">Light</h1>
      </div>
      <div className="flex h-full w-1/3 flex-col items-center justify-center gap-3">
        <button
          className="size-[150px] overflow-hidden rounded-[10px] transition-all duration-200 hover:border-2"
          onClick={() => setTheme("dark")}
        >
          <Image
            src="Dark.png"
            className="size-full"
            width={150}
            height={150}
            alt={""}
            unoptimized
          ></Image>
        </button>
        <h1 className="font-dayson text-lg text-white">Dark</h1>
      </div>
      <div className="flex h-full w-1/3 flex-col items-center justify-center gap-3">
        <button
          className="size-[150px] overflow-hidden rounded-[10px] transition-all duration-200 hover:border-2"
          onClick={() => setTheme("system")}
        >
          <Image
            src="Dark.png"
            className="size-full"
            width={150}
            height={150}
            alt={""}
            unoptimized
          ></Image>
        </button>
        <h1 className="font-dayson text-lg text-white">System</h1>
      </div>
    </div>
  );
};
export default Theme;
