
const LegendComponent = ({ labels, colors, fecha }: { labels: string[]; colors: string[]; fecha?: string }) => {
  return (
    <div className='flex justify-between w-full'>
      {fecha && (
        <div className="text-sm text-gray-500 mt-6 font-medium">
          {fecha}
        </div>
      )}
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
    </div>
  )
}

export default LegendComponent