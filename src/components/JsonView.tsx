export default function JsonView({ data }: { data: any }) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
      <code className="text-sm">
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  );
}