"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [accessToken, router]);

  // Show welcome screen only for non-authenticated users
  if (accessToken) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Welcome to the Portal Management System</h1>
        <p className="mt-4 text-lg text-gray-600">
          Please proceed to the login page to access your portal.
        </p>
        <div className="mt-8">
          <Link href="/login" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
