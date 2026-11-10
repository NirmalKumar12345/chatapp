import { Marker, MarkerContent } from "@/components/ui/marker";

interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({
  label,
}: DateSeparatorProps) {
  return (
    <Marker variant="separator" className="py-3">
      <MarkerContent className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
        {label}
      </MarkerContent>
    </Marker>
  );
}