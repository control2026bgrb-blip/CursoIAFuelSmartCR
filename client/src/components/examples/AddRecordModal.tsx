import { useState } from "react";
import { AddRecordModal } from "../AddRecordModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function AddRecordModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Record
      </Button>
      <AddRecordModal open={open} onOpenChange={setOpen} />
      <Toaster />
    </div>
  );
}
