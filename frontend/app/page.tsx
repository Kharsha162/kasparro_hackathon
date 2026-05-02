import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, TrendingUp, Shield, Zap, Target, ArrowRight, 
  CheckCircle, Lightbulb, Rocket, Brain, BarChart3, Cpu,
  Github, Twitter, Linkedin, Mail
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Shadow Shopper",
    description: "Simulate multiple AI agent journeys through your store to identify how AI perceives and interacts with your products.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Sparkles,
    title: "Replay Mode",
    description: "Follow every AI decision step-by-step to identify conversion friction points in your content and navigation.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Zap,
    title: "Auto Fix Engine",
    description: "Automatically rewrite product pages and collection content with AI-first optimization.",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Get comprehensive insights into how your store performs against AI perception standards.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Target,
    title: "Conversion Optimization",
    description: "Optimize your store specifically for AI-driven search engines and recommendations.",
    color: "from-yellow-500 to-orange-600"
  },
  {
    icon: Shield,
    title: "Trust Score",
    description: "Benchmark your store's AI-first readiness against industry standards.",
    color: "from-indigo-500 to-purple-600"
  },
]

const stats = [
  { label: "Merchants Using", value: "2,500+" },
  { label: "Stores Analyzed", value: "15,000+" },
  { label: "Avg Improvement", value: "+42%" },
  { label: "Uptime", value: "99.9%" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    company: "Boutique Co",
    text: "AI Store Reality helped us understand how AI perceives our products. We improved our listings and saw a 35% increase in AI-driven conversions.",
    avatar: "SC"
  },
  {
    name: "Marcus Johnson",
    company: "TechGear Store",
    text: "The Shadow Shopper feature was eye-opening. We discovered UX issues we never knew existed through AI interactions.",
    avatar: "MJ"
  },
  {
    name: "Elena Rodriguez",
    company: "Fashion Plus",
    text: "Auto Fix Engine rewrote our entire product catalog in hours. The AI-optimized content is way more discoverable.",
    avatar: "ER"
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full backdrop-blur-xl bg-slate-900/30 border-b border-purple-500/20 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">
                ✨
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Store Reality
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer mr-2">
                Features
              </Link>
              <Link href="/pricing" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all mr-2">
                <span className="text-xs text-amber-200">Get Pro features and priority support</span>
                <span className="text-xs font-bold text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded-full">Upgrade Plan</span>
              </Link>
              <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">The world's first AI store perception engine</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              See Your Store Through AI Eyes
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Understand how AI sees your Shopify store. Run shadow shopping simulations, identify conversion gaps, and automatically optimize your content with our AI-first platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10 text-lg">
                <Link href="/login">View Dashboard</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 mt-8 border-t border-purple-500/20">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20 scroll-mt-16">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Everything you need to optimize your store for AI perception and conversion
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-purple-500/20 bg-slate-900/40 backdrop-blur hover:bg-slate-900/60 hover:border-purple-500/40 transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
              <p className="text-xl text-slate-400">Three simple steps to AI-optimized store</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect Your Store",
                  description: "Link your Shopify store to start analysis. Takes less than 2 minutes.",
                  icon: Rocket
                },
                {
                  step: "02",
                  title: "Run AI Simulations",
                  description: "Deploy AI shoppers to test your store from multiple perspectives.",
                  icon: Brain
                },
                {
                  step: "03",
                  title: "Optimize & Improve",
                  description: "Get insights and automatically fix issues with our AI engine.",
                  icon: Zap
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="space-y-4">
                    <div className="text-5xl font-bold text-purple-400/20">{item.step}</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-slate-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Loved by Merchants</h2>
              <p className="text-xl text-slate-400">See what store owners are saying about AI Store Reality</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="p-6 rounded-xl border border-purple-500/20 bg-slate-900/40 backdrop-blur"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-slate-300">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
          <div className="max-w-4xl mx-auto text-center space-y-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur p-12">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Store?</h2>
            <p className="text-xl text-slate-300">
              Join thousands of merchants using AI Store Reality to optimize their Shopify stores
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg">
              <Link href="/signup">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 bg-slate-900/40 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  ✨
                </div>
                <span className="font-bold">AI Store Reality</span>
              </div>
              <p className="text-slate-400 text-sm">See your store through AI eyes</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Link href="#" className="text-slate-400 hover:text-white transition"><Twitter className="w-5 h-5" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white transition"><Linkedin className="w-5 h-5" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white transition"><Github className="w-5 h-5" /></Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 AI Store Reality. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
              <Link href="#" className="hover:text-white transition">Cookies</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
