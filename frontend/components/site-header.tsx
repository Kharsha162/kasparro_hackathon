import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SiteHeader() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">AI Store Reality</p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Detect AI trust issues and improve store content with every click.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            Give your store a voice for AI agents with multi-step simulation, intent coverage reporting, and rewrite-ready content guidance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Try it free</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
