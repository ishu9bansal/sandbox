import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Card from "./compositions/card";
import { Button } from "./ui/button";

export default function Obfuscation({ children }: { children: React.ReactNode }) {
  return <>
    <SignedIn>
      {children}
    </SignedIn>
    <SignedOut>
      {/* TODO: This is not safe, just obfuscation. Check how to configure route protection via middleware in clerk. */}
      <Card title="You need to Login">
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Please sign in to access this feature.
        </div>
        <div className="flex justify-center">
          <SignInButton>
            <Button variant='default'>Sign In</Button>
          </SignInButton>
        </div>
      </Card>
    </SignedOut>
  </>
}