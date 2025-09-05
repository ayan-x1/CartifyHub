import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-sm sm:max-w-md mx-auto",
            card: "w-full shadow-2xl border-0",
            formFieldInput: "text-base",
            formButtonPrimary: "w-full",
            headerTitle: "text-xl",
            headerSubtitle: "text-sm"
          }
        }}
      />
    </div>
  );
}