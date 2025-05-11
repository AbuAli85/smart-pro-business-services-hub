import { DemoModeProvider } from "@/contexts/demo-mode-context"
import CreateServiceCategoriesDirectWithErrorBoundary from "@/components/setup/create-service-categories-direct"

export default function CreateServiceCategoriesPage() {
  return (
    <DemoModeProvider>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
        <CreateServiceCategoriesDirectWithErrorBoundary />
      </div>
    </DemoModeProvider>
  )
}
