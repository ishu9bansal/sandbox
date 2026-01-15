import Button from "@/components/Button";
import Card from "@/components/compositions/card";

type EditLayoutProps = {
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
  backLabel?: string;
  nextLabel?: string;
};
export default function EditLayout({
  backLabel = "Cancel",
  nextLabel = "Next",
  children,
  onSubmit,
  onCancel,
  title,
}: EditLayoutProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <Card title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            {backLabel}
          </Button>
          <Button variant="primary" type="submit">
            {nextLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
