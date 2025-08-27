import { Wand2 } from "lucide-react";
import { Button } from "./ui/button";

function AIHintButton() {
  return (
    <Button variant="outline" className="rounded-2xl flex items-center gap-2">
      <Wand2 className="h-4 w-4" />
      <p className="hidden md:inline ">Smart Reply</p>
    </Button>
  );
}
export default AIHintButton;
