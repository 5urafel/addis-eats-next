"use client";

export default function MenuError({ error, reset }) {
  return (
    <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-red-700 mb-1">Menu Error</h2>
      <p className="text-sm text-slate-600 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
