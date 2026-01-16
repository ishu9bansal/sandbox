import ResctJsonView from '@uiw/react-json-view';

export default function JsonView({ data }: { data: any }) {

  return (
    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
      {data && <ResctJsonView value={data} collapsed={1} enableClipboard={false} displayDataTypes={false} />}
    </pre>
  );
}