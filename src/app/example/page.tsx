import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ComboboxDemo from "./ComboExample";
import DialogDemo from "./DialogExample";

export default function ExamplePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Example Project</h1>
        <p className="text-gray-600 dark:text-gray-300">
          This is an example page demonstrating how to use the sandbox environment.
          You can use the common components and utilities to quickly build your ideas.
        </p>
      </div>

      <Card title="Component Examples">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Buttons</h4>
            <div className="flex gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Input Fields</h4>
            <Input label="Name" placeholder="Enter your name" />
            <Input label="Email" type="email" placeholder="Enter your email" />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Cards</h4>
            <p className="text-gray-600 dark:text-gray-300">
              This entire section is wrapped in a Card component. You can nest them too!
            </p>
          </div>
        </div>
      </Card>

      <Card title="Project Structure">
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>
            <strong>Components:</strong> Reusable UI components are in{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              src/components
            </code>
          </p>
          <p>
            <strong>Utils:</strong> Helper functions are in{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              src/utils
            </code>
          </p>
          <p>
            <strong>Routes:</strong> Each folder in{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              src/app
            </code>{" "}
            becomes a route
          </p>
          <p>
            <strong>Projects:</strong> Register your routes in{" "}
            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              src/lib/projects.ts
            </code>
          </p>
        </div>
      </Card>

      <Card title="Next Steps">
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>Create a new folder in src/app for your project</li>
          <li>Add a page.tsx file with your content</li>
          <li>Register it in src/lib/projects.ts</li>
          <li>Your project will appear in the sidebar automatically!</li>
        </ul>
      </Card>

      <Card title="Different Input Types">
        {INPUT_MODES.map((mode) => (
          <div key={mode} className="mb-4">
            <Input
              label={`Input type="${mode}"`}
              type="text"
              inputMode={mode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
              placeholder={`This input has inputMode="${mode}"`}
            />
          </div>
        ))}
      </Card>

      <Card title="Data Selector Example">
        <ComboboxDemo />
      </Card>

      <Card title="Dialog Example">
        <DialogDemo />
      </Card>
    </div>
  );
}

const INPUT_MODES = ["tel", "text", "email", "search", "decimal", "url", "none", "numeric"];
