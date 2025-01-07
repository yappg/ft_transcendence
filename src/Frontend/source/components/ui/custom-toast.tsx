import { Toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

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
  showActions = false 
}: CustomToastProps) {
  return (
    <Toast className="bg-primary-dark border-none text-white">
      <div className="flex flex-col gap-2">
        {showActions && (
          <div className="flex gap-2 mt-2">
            <Button
              onClick={onAccept}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
            >
              Accept
            </Button>
            <Button
              onClick={onDecline}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </Toast>
  )
} 