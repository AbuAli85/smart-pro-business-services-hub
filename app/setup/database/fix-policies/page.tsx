import FixPolicies from "@/components/setup/fix-policies"

export default function FixPoliciesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Database Policy Fixer</h1>
      <p className="mb-8 text-gray-600">
        This utility helps resolve policy conflicts in your Supabase database by checking if policies exist before
        attempting to create them.
      </p>

      <FixPolicies />
    </div>
  )
}
