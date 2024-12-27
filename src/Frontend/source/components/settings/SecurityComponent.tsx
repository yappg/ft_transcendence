export const SecurityComponent = (user) => {
    return (
        <div className="w-full py-6 flex flex-wrap items-center justify-start h-[40%] gap-10">
        <div className="w-full h-[8%] flex items-center">
          <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
            Security
          </h1>
        </div>
        <div className="w-fit flex flex-col gap-4 2xl:px-20 px-12">
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
      </div>
    )
}