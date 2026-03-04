import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddIndependentMode() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-md bg-[#2E2E2E] text-gray-200 shadow-xl">
        <div className="p-4 py-2 text-sm font-medium font-mono border-b border-white/10">
          Save Mode
        </div>
        <div className="px-5 py-2">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 mb-4">
            <div className="text-sm flex items-center gap-2">
              <div className="text-white/70">Created date</div>
              <div className="font-medium">29-09-2023</div>
            </div>
            <div className="text-sm flex items-center justify-end gap-2">
              <div className="text-white/70">Created by</div>
              <div className="font-medium">username</div>
            </div>
          </div>
          <div className="mb-3 text-white/70 font-mono">Add Details</div>

          <div className="mb-4">
            <Label className="mb-1 block text-sm text-white/70">
              Mode Name
            </Label>
            <Input
              placeholder="Mode_123"
              className="h-10 bg-[#0000001A] text-gray-100 placeholder:text-white/40 border-[#FFFFFF1A]"
            />
          </div>
          <div className="mb-2">
            <Label  className="mb-1 block text-sm text-white/70">
              Description
            </Label>
            <Textarea
              rows={4}
              placeholder="This mode is designed to enhance user experience..."
              className="file:text-foreground placeholder:text-white/40 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 w-full rounded-md border bg-[#0000001A] p-3 text-sm text-gray-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 border-[#FFFFFF1A]"
            />
          </div>
        </div>
        <div className="flex justify-end border-t border-white/10 px-5 py-4">
          <Button className="h-9 cursor-pointer rounded-sm bg-[#7B70D6] px-4 text-white hover:bg-[#7C70FF]/90">
            Add Mode To all
          </Button>
        </div>
      </div>
    </div>
  );
}
