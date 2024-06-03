import Link from 'next/link';

const actions = [
  {
    title: '1-N Swap',
    href: '/multi-swap',
    description: 'Swap Single Chain Assets to Multi-chain (With the Best Exchange Rates).'
  },
  {
    title: '1-1 Swap',
    href: '/single-swap',
    description: 'Swap Single Chain Assets to a Single Chain'
  },
  {
    title: 'N-1 Swap (Coming Soon)',
    href: '/',
    description: 'Swap Multi-chain Assets to a Single Chain (Coming Soon)'
  },
  {
    title: 'N-N Swap (Coming Soon)',
    href: '/',
    description: 'Swap Multi-chain Assets to Multi-chain (Coming Soon)'
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AppPage() {
  return (
    <div className="p-4 bg-zinc-900 min-h-screen">
      <div className="max-w-screen-lg mx-auto divide-y divide-gray-700 overflow-hidden rounded-lg bg-zinc-800 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={classNames(
              actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
              actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
              actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
              actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
              'group relative bg-zinc-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 m-4'
            )}
          >
            <div className="mt-8">
              <h3 className="text-lg font-semibold leading-6 text-gray-100">
                <Link href={action.href}>
                  <span className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </span>
                </Link>
              </h3>
              <p className="mt-2 text-md text-gray-300">
                {action.description}
              </p>
            </div>
            <span
              className="pointer-events-none absolute right-6 top-6 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }