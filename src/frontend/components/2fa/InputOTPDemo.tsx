import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export function InputOTPDemo({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
      <InputOTPGroup className="w-1/2 h-[200px] text-white justify-end">
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator className="text-white" />
      <InputOTPGroup className="w-1/2 h-[200px] text-white justify-end">
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
