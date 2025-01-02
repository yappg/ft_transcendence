export const Avatar = ({
    url
} : {
    url: string
}) => {
    return (
        <img src={url} alt="avatar" className="lg:rounded-[40px] rounded-full size-[150px] lg:size-[250px] outline outline-[3px] lg:outline-[5px]" />
    );
}