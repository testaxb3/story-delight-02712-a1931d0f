import { Sparkles } from "lucide-react";

export const ChapterDecorator = () => {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 rounded-full" />
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative bg-background border-2 border-primary rounded-full p-2">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="flex-1 h-1 bg-gradient-to-r from-primary via-transparent to-transparent opacity-30 rounded-full" />
    </div>
  );
};
