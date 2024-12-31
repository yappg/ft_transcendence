export default function Page({params} : {params: {UserId: string}}) {
    return (
        <div className="size-full bg-[#00000099] rounded-[50px] flex items-center justify-center
        ">
            <h1>{params.UserId}</h1>
        </div>
    );
}