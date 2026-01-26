import ActionCard from "@/components/compositions/action-card";
import { Button } from "@/components/ui/button";

type EditLayoutProps = {
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
  backLabel?: string;
  nextLabel?: string;
  actionChildren?: React.ReactNode;
};
export default function EditLayout({
  backLabel = "Cancel",
  nextLabel = "Next",
  children,
  onSubmit,
  onCancel,
  title,
  actionChildren,
}: EditLayoutProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <ActionCard title={title} actionChildren={actionChildren}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            {backLabel}
          </Button>
          <Button type="submit">
            {nextLabel}
          </Button>
        </div>
      </form>
    </ActionCard>
  );
}
