import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/admin")({
  component: DecoyNotFound,
});

function DecoyNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white font-mono">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-gray-200 cursor-pointer"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
