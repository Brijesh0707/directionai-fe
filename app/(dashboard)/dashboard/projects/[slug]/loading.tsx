export default function ProjectDetailsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gray-100 animate-pulse" />
          <div>
            <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-96 rounded bg-gray-100 animate-pulse mt-2" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border-b border-border last:border-0 px-6 py-5 animate-pulse">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 h-4 bg-gray-200 rounded" />
                <div className="col-span-3 h-4 bg-gray-100 rounded" />
                <div className="col-span-2 h-4 bg-gray-100 rounded" />
                <div className="col-span-2 h-9 bg-gray-100 rounded ml-auto w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
