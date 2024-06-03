const stats = [
    { id: 1, name: 'Supported Chain', value: '4' },
    { id: 2, name: 'Total Volume', value: '$470B+' },
    { id: 3, name: 'Total Trades', value: '98.4M+' },
]
  
  export default function Stats() {
    return (
      <div className="py-12 sm:py-12">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-white">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
  