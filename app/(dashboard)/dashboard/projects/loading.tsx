export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-80 rounded bg-gray-100 animate-pulse mt-2" />

        <div className="mt-6 h-12 w-full rounded-2xl bg-gray-100 animate-pulse" />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-gray-200" />
              <div className="mt-5 h-4 bg-gray-200 rounded w-3/4" />
              <div className="mt-2 h-3 bg-gray-100 rounded w-full" />
              <div className="mt-6 h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
