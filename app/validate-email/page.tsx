import Link from "next/link";

export default function ValidateEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified Successfully
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thanks for verification email. Please login to continue.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
