import Blocked from "@/constants/Blocked";
import BlockedComponent from "./BlockedComponent";
const BlockedList = () => {
    return (
        <div className="size-full 2xl:p-28">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll 2xl:rounded-[50px] bg-[#4C4D4E] shadow-2xl">
            <div className="bg-black-crd dark:bg-transparent w-full h-fit">
                {Blocked.map((user, index) => (
                    <BlockedComponent
                        key={index}
                        name={user.name}
                        ProfilePhoto={user.Profile}
                    />
                )
                )}
            </div>
            </div>
        </div>
    )
}
export default BlockedList;