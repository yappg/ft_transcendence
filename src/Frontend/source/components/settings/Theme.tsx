import { useTheme } from "next-themes"
const Theme = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div className="h-[80%] w-[80%] flex flex-col md:flex-row m-10 items-center justify-center">
            <div className="h-full w-1/3 flex flex-col items-center justify-center gap-3">
                <button className="size-[150px] rounded-[10px] overflow-hidden hover:border-2 transition-all duration-200" onClick={() => setTheme('light')}>
                    <img src="white.png" className="size-full"></img>
                </button>
                <h1 className="font-dayson text-lg text-white">Light</h1>
            </div>
            <div className="h-full w-1/3 flex flex-col items-center justify-center gap-3">
            <button className="size-[150px] rounded-[10px] overflow-hidden hover:border-2 transition-all duration-200" onClick={() => setTheme('dark')}>
                    <img src="white.png" className="size-full"></img>
                </button>
                <h1 className="font-dayson text-lg text-white">Dark</h1>
            </div>
            <div className="h-full w-1/3 flex flex-col items-center justify-center gap-3">
            <button className="size-[150px] rounded-[10px] overflow-hidden hover:border-2 transition-all duration-200" onClick={() => setTheme('system')}>
                    <img src="white.png" className="size-full"></img>
                </button>
                <h1 className="font-dayson text-lg text-white">System</h1>
            </div>
        </div>
    )
};
export default Theme;