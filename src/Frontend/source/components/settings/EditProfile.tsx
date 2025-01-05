import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
const ProfileShema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(3, 'Username is too short'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
const EditProfile = () => {
  const [profile, setProfile] = useState({
    username: 'Meryem22',
    name: 'Meryem',
    email: 'test.ts@gmail.com',
    oldPassword: '123',
  });
  const [newProfile, setNewProfile] = useState({
    username: profile.username,
    name: profile.name,
    email: profile.email,
    oldPass: '',
    newPass: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClicked, setIsClicked] = useState(false);
  function handleSave() {
    if (Object.keys(errors).length > 0) {
      setIsClicked(true);
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 5000);
    try {
      ProfileShema.parse({
        email: newProfile.email,
        name: newProfile.name,
        username: newProfile.username,
        newPassword: newProfile.newPass,
      });
      setErrors({});
      setProfile({
        username: newProfile.username,
        name: newProfile.name,
        email: newProfile.email,
        oldPassword: newProfile.oldPass,
      });
      setNewProfile({ ...newProfile, oldPass: '', newPass: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc: any, curr: any) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#28AFB0] sm:max-w-[425px] dark:bg-[#C1382C]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newProfile.name}
              className="col-span-3"
              onChange={(e) => {
                setNewProfile({ ...newProfile, name: e.target.value });
              }}
            />
            {errors.name && (
              <p className="font-coustard mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Old Password" className="text-right">
              Old Password
            </Label>
            <Input id="Old Password" className="col-span-3" onChange={() => {}} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="New Password" className="text-right">
              New Password
            </Label>
            <Input id="New Password" className="col-span-3" onChange={() => {}} />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className={`${isClicked ? 'bg-green-500 text-white shadow-md' : ''}`}
            onClick={handleSave}
          >
            {isClicked ? 'Saved!' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditProfile;
