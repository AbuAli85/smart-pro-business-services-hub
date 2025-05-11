import DatabaseRelationshipFix from "@/components/setup/database-relationship-fix"

export default function FixRelationshipsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      <DatabaseRelationshipFix />
    </div>
  )
}
