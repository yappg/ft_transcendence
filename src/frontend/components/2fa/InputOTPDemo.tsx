import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export function InputOTPDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={0}
        />
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={1}
        />
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={2}
        />
      </InputOTPGroup>
      <h1 className="text-white text-[30px] mb-4">.</h1>
      <InputOTPGroup>
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={3}
        />
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={4}
        />
        <InputOTPSlot
          className="md:w-[60px] md:h-[60px] w-[50px] h-[50px]"
          index={5}
        />
      </InputOTPGroup>
    </InputOTP>
  );
}
