import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function InputOTPDemo({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <InputOTP
      pattern={REGEXP_ONLY_DIGITS}
      maxLength={6}
      value={value}
      onChange={(value) => setValue(value)}
    >
      <InputOTPGroup className="h-[200px] w-1/2 justify-end text-black dark:text-white">
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator className="text-black dark:text-white" />
      <InputOTPGroup className="h-[200px] w-1/2 justify-end text-black dark:text-white">
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
