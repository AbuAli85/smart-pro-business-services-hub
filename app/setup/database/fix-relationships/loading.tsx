export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
