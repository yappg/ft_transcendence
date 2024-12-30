import { ImageCard } from './ImageCard';
import { CoverCard } from './CoverCard';
import { z } from 'zod';
const ProfileInformations = (user) => {
      const imageSchema = z.object({
        type: z.enum(['image/jpeg', 'image/png']),
        size: z.number().max(5 * 1024 * 1024),
      });
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const validationResult = imageSchema.safeParse({
            type: file.type,
            size: file.size,
          });
    
          if (!validationResult.success) {
            return;
          }
    
          const imageUrl = URL.createObjectURL(file);
        }
      };
      const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const validationResult = imageSchema.safeParse({
            type: file.type,
            size: file.size,
          });
    
          if (!validationResult.success) {
            return;
          }
    
          const imageUrl = URL.createObjectURL(file);
        }
      };
      console.log("hhhhhhhhhhhhhhhhhh", user);
    return(
              <div className="gap-10 border-2 bg-[#00000099] h-fit rounded-[50px] shadow-2xl md:p-6 sm:p-9 p-14 border-[#B8B8B8]">
                <div className="w-full h-[12%] flex items-center">
                  <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
                    Profile Information
                  </h1>
                </div>
                <div className="w-full 2xl:px-20 py-6 flex sm:gap-[100px] gap-[50px] items-center justify-start flex-wrap">
                  <ImageCard
                    selectedImage={user.avatar}
                    handleImageChange={handleImageChange}
                    profileError={user.profileError}
                  />
        
                  <CoverCard
                    coverImage={user.cover}
                    handleCoverChange={handleCoverChange}
                    coverError={user.coverError}
                  />
                </div>
                <div className="w-full h-fit 2xl:px-20 py-6 flex 2xl:gap-20 xl:gap-10 lg:gap-7 items-start justify-start sm:px-12 lg:flex-row flex-col">
                  <div className="w-fit flex flex-col gap-4">
                    <label className="text-white text-sm">Username</label>
                    <input
                      type="text"
                      value={user?.username}
                      disabled
                      className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed"
                    />
                    <label className="text-white text-sm">Email</label>
                    <input
                      type="email"
                      value="user@example.com"
                      disabled
                      className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed"
                    />
                  </div>
        
                  <div className="w-fit h-full  flex flex-col gap-4">
                    <label className="text-white text-sm">Display name</label>
                    <input
                      type="text"
                    //   value={profileState.fullName}
                      onChange={(e) => {
                        // updateState('fullName', e.target.value);
                      }}
                      className="py-2 px-4 bg-white text-black rounded-md outline-none"
                    />
                    {/* {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>} */}
                  </div>
                </div>
              </div>
    )
}
export default ProfileInformations;