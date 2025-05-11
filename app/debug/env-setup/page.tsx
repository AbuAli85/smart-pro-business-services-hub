import { EnvFileCreator } from "@/components/debug/env-file-creator"

export default function EnvSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Environment Setup</h1>
      <EnvFileCreator />
    </div>
  )
}
