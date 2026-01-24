import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

export default function QuickLabels({ labels, onSelect }: { labels: string[]; onSelect: (label: string) => void }) {
  return (
    <div className="mt-2 flex gap-2">
      <ButtonGroup>
        {labels.map((label) => (
          <Button key={label} size="xs" onClick={() => onSelect(label)} className="text-xs" variant="secondary">
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
