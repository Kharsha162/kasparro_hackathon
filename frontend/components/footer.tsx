import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">AI Store Reality Engine</p>
          <p className="mt-1 text-sm text-slate-400">
            Modern AI-driven insights for Shopify merchants.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-white">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  )
}
