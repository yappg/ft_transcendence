import { Switch } from '@/components/ui/switch';
export const SecurityComponent = (user) => {
    return (
        <div className="w-full py-6 flex flex-wrap items-center justify-start h-fit gap-10 border-2 bg-[#00000099] rounded-[50px] shadow-2xl p-7 border-[#B8B8B8]">
        <div className="w-full h-[8%] flex items-center">
          <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
            Security
          </h1>
        </div>
        <div className="w-full h-fit flex md:flex-row flex-col justify-between gap-4">
        <div className="md:w-[50%] flex flex-col gap-4 md:px-12">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={user.password}
            // onChange={(e) => updateState('password', e.target.value)}
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
          />
          <label className="text-white text-sm">New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={user.NewPassword}
            // onChange={(e) => updateState('NewPassword', e.target.value)}
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
          />
          {/* {errors.NewPassword && <p className="text-red-500 text-sm">{errors.NewPassword}</p>} */}
        </div>
        <div className="md:w-[40%] h-full flex items-center md:justify-between flex-row gap-5 pl-9 md:p-0">
            <h1 className="font-coustard lg:text-xl md:text-lg text-sm text-white">Private Account</h1>
            <Switch />
          </div>
          </div>
      </div>
    )
}