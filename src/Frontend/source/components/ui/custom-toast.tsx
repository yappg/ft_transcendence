import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface CustomToastProps {
  title: string;
  description: string;
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export function CustomToast({
  onAccept,
  onDecline,
  showActions = false,
}: CustomToastProps) {
  return (
    <Toast className="border-none bg-primary-dark text-white">
      <div className="flex flex-col gap-2">
        {showActions && (
          <div className="mt-2 flex gap-2">
            <Button
              onClick={onAccept}
              className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600"
            >
              Accept
            </Button>
            <Button
              onClick={onDecline}
              className="rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600"
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </Toast>
  );
}
