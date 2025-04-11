"\"use client"

interface PhaseTargetsProps {
  targets: { name: string; value: string; unit: string }[]
}

export function PhaseTargets({ targets }: PhaseTargetsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">Phase Targets</h3>
      <ul className="space-y-2">
        {targets.map((target, index) => (
          <li key={index} className="flex justify-between items-center text-gray-300">
            <span>{target.name}</span>
            <span className="font-medium">
              {target.value} {target.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
