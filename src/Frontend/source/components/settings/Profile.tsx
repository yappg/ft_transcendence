import { useState } from 'react';
import Image from 'next/image';
import { CoverCard } from './CoverCard';
import { ImageCard } from './ImageCard';

export default function ProfileInfo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState('');
  const [coverError, setCoverError] = useState('');
  const [fullName, setFullName] = useState('Meryeme Kelba');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError('File size exceeds 5MB.');
        setSelectedImage(null);
        return;
      }

      // Convert file to URL for preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setProfileError('');
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setCoverError('File size exceeds 5MB.');
        setCoverImage(null);
        return;
      }

      // Convert file to URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      setCoverError('');
    }
  };

  return (
    <div className='size-full overflow-y-scroll'>
      <div className='w-full h-[12%] px-12 flex items-center'>
        <h1 className='text-white font-dayson font-bold text-xl tracking-wider'>Profile Information</h1>
      </div>
      <div className="w-full h-fit px-12 py-6 flex flex-wrap gap-4 items-center justify-between">
        {/* Profile Picture Section */}
          <ImageCard handleDeleteImage={() => {
        setSelectedImage(null);
        setProfileError('');
      }} selectedImage={selectedImage} handleImageChange={handleImageChange} profileError={profileError}/>

        {/* Cover Picture Section */}
            <CoverCard coverImage={coverImage} handleCoverChange={handleCoverChange} coverError={coverError} />
      </div>
      <div className="w-full h-fit px-12 py-6 flex flex-wrap gap-4 items-start justify-start">
        <div className="w-fit flex flex-col gap-4">
          <label className="text-white text-sm">Username</label>
          <input
            type="text"
            value="username123"
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
          <label className="text-white text-sm">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="py-2 px-4 bg-white text-black rounded-md outline-none"
          />
        </div>
      </div>
      <div className='w-full h-[8%] px-12 flex items-center'>
        <h1 className='text-white font-dayson font-bold text-xl tracking-wider'>Security</h1>
      </div>
      <div className="w-full h-fit px-12 py-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="w-fit flex flex-col gap-4">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
          />
          <label className="text-white text-sm">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
          />
        </div>

        <div className="w-fit flex flex-col gap-4">
          <label className="text-white text-sm">Two Factor Authentication</label>
          <button className="py-2 px-4 bg-blue-600 text-white rounded-md">Activate 2FA</button>
          <button disabled className="py-2 px-4 bg-red-600 text-white rounded-md">Delete 2FA</button>
        </div>
      </div>
      <div className="w-full px-12 py-6 flex justify-end">
        <button className="w-[200px] py-3 px-6 bg-white text-black font-dayson rounded-md font-bold text-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}
