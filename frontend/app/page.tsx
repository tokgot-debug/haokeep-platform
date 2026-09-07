import React from "react";

export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold text-primary">Vanbransa CleanPulse Operations OS</h1>
      <p className="text-muted mt-2">Next.js App Router Frontend Loaded Successfully</p>
      <div className="mt-4 p-4 border rounded bg-darker max-w-lg mx-auto">
        <a href="/index.html" className="btn btn-primary">Launch Operations Platform Workspace</a>
      </div>
    </main>
  );
}
