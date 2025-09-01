import React from 'react'

const LegendComponent = ({ labels, colors }: { labels: string[]; colors: string[] }) => {
  return (
    <div className="flex items-center gap-4 mt-6 flex-wrap">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
          <span
            className="inline-block rounded-md"
            style={{ width: 16, height: 16, backgroundColor: colors[i] }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default LegendComponent