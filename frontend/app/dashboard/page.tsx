'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Sparkles, TrendingUp, Shield, Zap, Target, Lightbulb, BarChart3, 
  Settings, Bell, LogOut, Menu, X, CheckCircle, AlertCircle, Clock,
  Cpu, Brain, Rocket, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout, token } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isMounted, setIsMounted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  
  const [isShopifyConnected, setIsShopifyConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const [isShopperRunning, setIsShopperRunning] = useState(false)
  const [shopperData, setShopperData] = useState<any>(null)
  
  const [isAutoFixing, setIsAutoFixing] = useState(false)
  const [autoFixData, setAutoFixData] = useState<any>(null)

  const handleConnectShopify = async () => {
    setIsConnecting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsShopifyConnected(true)
    setIsConnecting(false)
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setActiveTab('analysis')
    await new Promise(r => setTimeout(r, 2000))
    setAnalysisData({
      overall_score: 0.87,
      intent_coverage: { coverage_score: 0.82 },
      perception_reality: [
        {
          title: "Premium Descriptions vs Basic Imagery",
          description: "Product descriptions claim luxury quality, but standard photography fails to support these premium claims. Adding high-res close-ups of material textures could bridge this gap.",
          insight: { impact_level: "High" }
        },
        {
          title: "Promised Shipping vs Hidden Policies",
          description: "Banner advertises 'Fast Shipping', but the deep-linked shipping policy outlines a 3-5 day processing delay. This mismatch causes significant cart abandonment.",
          insight: { impact_level: "Critical" }
        }
      ],
      conversion_kill_switches: [
        {
          title: "Missing Trust Badges on Checkout",
          description: "No security or payment processor badges near the checkout button. This creates friction for first-time skeptical buyers."
        },
        {
          title: "Unclear Return Policy",
          description: "Customers must navigate 4 pages deep to find return terms. 40% of AI personas flagged this as a 'dealbreaker' during evaluation."
        }
      ]
    })
    setIsAnalyzing(false)
  }

  const runShadowShopper = async () => {
    setIsShopperRunning(true)
    await new Promise(r => setTimeout(r, 2000))
    setShopperData([
      { persona: "Budget Shopper", action: "Abandoned Cart", thought: "Hidden shipping costs added $15 at checkout." },
      { persona: "Premium Buyer", action: "Purchased", thought: "Product quality looks great, trusted the premium photography." },
      { persona: "Skeptical User", action: "Dropped", thought: "Couldn't find clear return policies." }
    ])
    setIsShopperRunning(false)
  }

  const runAutoFix = async () => {
    setIsAutoFixing(true)
    await new Promise(r => setTimeout(r, 2000))
    setAutoFixData([
      { issue: "Missing Trust Badges", fix: "Injected trusted payment icons below \"Add to Cart\" Button.", status: "Fixed" },
      { issue: "Weak Headline", fix: "Rewrote \"Audio Devices\" to \"Studio Quality Sound without the Studio Price\".", status: "Fixed" },
      { issue: "Unclear Returns", fix: "Added \"30-Day Guarantee\" badge next to pricing.", status: "Fixed" }
    ])
    setIsAutoFixing(false)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login')
    }
  }, [isLoading, token, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isMounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-border border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { icon: TrendingUp, label: 'Store Health', value: '94%', change: '+4%', color: 'from-blue-500 to-blue-600' },
    { icon: Brain, label: 'AI Accuracy', value: '89%', change: '+2%', color: 'from-blue-500 to-blue-600' },
    { icon: Zap, label: 'Performance', value: '2.3s', change: '-0.4s', color: 'from-orange-500 to-red-600' },
    { icon: Target, label: 'Conversion', value: '3.2%', change: '+0.8%', color: 'from-blue-500 to-cyan-600' },
  ]

  const recentAnalysis = [
    { id: 1, title: 'Product Page A/B Test', status: 'Completed', result: '+12% CTR', date: '2 hours ago' },
    { id: 2, title: 'Checkout Flow Analysis', status: 'In Progress', result: 'Analyzing...', date: 'Now' },
    { id: 3, title: 'Navigation Optimization', status: 'Completed', result: '+8% Engagement', date: '1 day ago' },
    { id: 4, title: 'Copy Review & Rewrite', status: 'Completed', result: '+15% Clarity', date: '2 days ago' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card text-card-foreground shadow-sm backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-accent hover:text-accent-foreground rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">
                  âœ¨
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    AI Store Reality
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-accent hover:text-accent-foreground rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground text-sm font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} border-r border-border bg-card text-card-foreground shadow-sm backdrop-blur-xl transition-all duration-300 overflow-hidden md:w-64`}>
            <nav className="p-6 space-y-2">
              <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-border">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Account</p>
                <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              </div>

              <div className="pt-4 space-y-1">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</p>
                {[
                  { icon: Activity, label: 'Overview', id: 'overview' },
                  { icon: Brain, label: 'AI Analysis', id: 'analysis' },
                  { icon: Sparkles, label: 'Shadow Shopper', id: 'shopper' },
                  { icon: Zap, label: 'Auto Fix Engine', id: 'autofix' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-500/20 border border-border text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 space-y-1 border-t border-border">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</p>
                {[
                  { icon: Settings, label: 'Settings' },
                  { icon: Shield, label: 'Security' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}</h2>
                <p className="text-muted-foreground">Here's your AI store analysis dashboard</p>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="bg-card text-card-foreground shadow-sm border border-border p-1 rounded-lg">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20">
                    <Activity className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-500/20">
                    <Brain className="w-4 h-4 mr-2" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="shopper" className="data-[state=active]:bg-blue-500/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Shadow Shopper
                  </TabsTrigger>
                  <TabsTrigger value="autofix" className="data-[state=active]:bg-blue-500/20">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto Fix
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <Card key={index} className="border-border bg-card text-card-foreground shadow-sm backdrop-blur hover:bg-card text-card-foreground/60 transition-all hover:border-blue-500/40 group cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-30 transition-opacity`}>
                              <stat.icon className="w-5 h-5" />
                            </div>
                            <Badge className={`bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs`}>
                              {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                              {stat.change}
                            </Badge>
                          </div>
                          <CardTitle className="text-muted-foreground text-sm font-medium mt-4">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Analysis */}
                  <Card className="border-border bg-card text-card-foreground shadow-sm backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Recent Analysis
                      </CardTitle>
                      <CardDescription>Your latest AI analysis reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentAnalysis.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30 hover:bg-accent hover:text-accent-foreground/50 transition-all group cursor-pointer">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`p-2.5 rounded-lg ${item.status === 'Completed' ? 'bg-blue-500/20' : 'bg-blue-500/20'}`}>
                                {item.status === 'Completed' ? (
                                  <CheckCircle className={`w-5 h-5 ${item.status === 'Completed' ? 'text-blue-400' : 'text-blue-400'}`} />
                                ) : (
                                  <Clock className="w-5 h-5 text-blue-400 animate-spin" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-400">{item.result}</p>
                              <Badge className="mt-2 bg-slate-700/50 text-muted-foreground border-slate-600/50">{item.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border bg-gradient-to-br from-blue-900/30 to-slate-900/30 backdrop-blur hover:from-blue-900/40 hover:to-slate-900/40 transition-all cursor-pointer group">
                      <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all p-2 mb-4">
                          <Cpu className="w-6 h-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-base">Run Analysis</CardTitle>
                        <CardDescription>Analyze your store with AI</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab('analysis')}>Start Now</Button>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-gradient-to-br from-blue-900/30 to-slate-900/30 backdrop-blur hover:from-blue-900/40 hover:to-slate-900/40 transition-all cursor-pointer group">
                      <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all p-2 mb-4">
                          <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-base">Shadow Shopper</CardTitle>
                        <CardDescription>Simulate customer journeys</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Launch</Button>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-900/30 to-slate-900/30 backdrop-blur hover:from-blue-900/40 hover:to-slate-900/40 transition-all cursor-pointer group">
                      <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all p-2 mb-4">
                          <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-base">Auto Fix Engine</CardTitle>
                        <CardDescription>Auto-rewrite content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Configure</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Analysis Tab */}
                <TabsContent value="analysis">
                  <Card className="border-border bg-card text-card-foreground shadow-sm backdrop-blur">
                    <CardHeader>
                      <CardTitle>Store Analysis</CardTitle>
                      <CardDescription>AI-powered insights about your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!isShopifyConnected ? (
                          <>
                            <Alert className="border-border bg-blue-500/10">
                              <Lightbulb className="h-4 w-4 text-blue-400" />
                              <AlertDescription className="text-blue-300">
                                Analysis feature is ready. Connect your Shopify store to get started with comprehensive AI analysis.
                              </AlertDescription>
                            </Alert>
                            <Button 
                              onClick={handleConnectShopify} 
                              disabled={isConnecting}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              {isConnecting ? (
                                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Connecting to Shopify...</>
                              ) : (
                                <><Rocket className="w-4 h-4 mr-2" /> Connect Shopify Store</>
                              )}
                            </Button>
                          </>
                        ) : !analysisData ? (
                          <>
                            <Alert className="border-blue-500/30 bg-blue-500/10">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <AlertDescription className="text-blue-300">
                                Shopify Connected Successfully! You can now scan your store's AI perception.
                              </AlertDescription>
                            </Alert>
                            <Button 
                              onClick={runAnalysis} 
                              disabled={isAnalyzing}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              {isAnalyzing ? (
                                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Analyzing Store...</>
                              ) : (
                                <><Brain className="w-4 h-4 mr-2" /> Run Comprehensive AI Scan</>
                              )}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-border">
                                <span className="text-muted-foreground mb-1 font-medium">Overall Trust Score</span>
                                <span className="text-4xl font-bold text-blue-400">{Math.round(analysisData.overall_score * 100)}%</span>
                              </div>
                              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-border">
                                <span className="text-muted-foreground mb-1 font-medium">Intent Coverage</span>
                                <span className="text-4xl font-bold text-blue-400">{Math.round((analysisData.intent_coverage?.coverage_score || 0) * 100)}%</span>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="text-xl font-semibold border-b border-border pb-2 text-foreground">Perception vs Reality</h3>
                              {analysisData.perception_reality?.map((item: any, i: number) => (
                                <div key={i} className="mb-4 p-5 rounded-lg bg-muted/40 border border-border hover:bg-accent hover:text-accent-foreground/60 transition-all">
                                  <h4 className="font-bold text-blue-300 text-lg">{item.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                                  <div className="mt-4 flex gap-2">
                                    <Badge className="bg-blue-500/20 text-blue-300 border-border">Impact: {item.insight?.impact_level}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-4 pt-4">
                              <h3 className="text-xl font-semibold border-b border-border pb-2 text-foreground">Conversion Kill Switches</h3>
                              {analysisData.conversion_kill_switches?.map((ks: any, i: number) => (
                                <div key={i} className="mb-4 p-5 rounded-lg border-l-4 border-red-500 bg-red-950/20 shadow-lg relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                  <h4 className="font-bold text-red-400 text-lg relative z-10">{ks.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed relative z-10">{ks.description}</p>
                                </div>
                              ))}
                            </div>

                            <Button onClick={() => setAnalysisData(null)} disabled={isAnalyzing} className="w-full bg-muted hover:bg-accent hover:text-accent-foreground border border-slate-600 transition-all">
                              Reset Analysis
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Shadow Shopper Tab */}
                <TabsContent value="shopper">
                  <Card className="border-border bg-card text-card-foreground shadow-sm backdrop-blur">
                    <CardHeader>
                      <CardTitle>AI Shadow Shopper</CardTitle>
                      <CardDescription>Simulate multiple AI shopper personas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!shopperData ? (
                          <>
                            <Alert className="border-blue-500/30 bg-blue-500/10">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                              <AlertDescription className="text-blue-300">
                                Shadow Shopper is configured and ready to analyze your store's AI perception.
                              </AlertDescription>
                            </Alert>
                            <Button 
                              onClick={runShadowShopper}
                              disabled={isShopperRunning}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              {isShopperRunning ? (
                                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Simulating Users...</>
                              ) : (
                                <><Brain className="w-4 h-4 mr-2" /> Start Shopping Simulation</>
                              )}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            {shopperData.map((d: any, i: number) => (
                              <div key={i} className="p-4 bg-muted/40 rounded-lg border border-border">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-bold text-foreground">{d.persona}</h4>
                                  <Badge className={d.action === "Purchased" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}>
                                    {d.action}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">"{d.thought}"</p>
                              </div>
                            ))}
                            <Button onClick={() => setShopperData(null)} className="w-full bg-muted hover:bg-accent hover:text-accent-foreground border border-slate-600 transition-all">
                              Run New Simulation
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Auto Fix Tab */}
                <TabsContent value="autofix">
                  <Card className="border-border bg-card text-card-foreground shadow-sm backdrop-blur">
                    <CardHeader>
                      <CardTitle>Auto Fix Engine</CardTitle>
                      <CardDescription>Automatically improve your store content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!autoFixData ? (
                          <>
                            <Alert className="border-yellow-500/30 bg-yellow-500/10">
                              <AlertCircle className="h-4 w-4 text-yellow-400" />
                              <AlertDescription className="text-yellow-300">
                                Auto Fix Engine will analyze and suggest improvements to your product pages and collections.
                              </AlertDescription>
                            </Alert>
                            <Button 
                              onClick={runAutoFix}
                              disabled={isAutoFixing}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              {isAutoFixing ? (
                                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Optimizing Store...</>
                              ) : (
                                <><Zap className="w-4 h-4 mr-2" /> Scan & Optimize</>
                              )}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            {autoFixData.map((d: any, i: number) => (
                              <div key={i} className="p-4 bg-muted/40 rounded-lg border border-border">
                                <h4 className="font-bold text-foreground mb-1">Issue: {d.issue}</h4>
                                <p className="text-sm text-blue-400 mb-2">Fix: {d.fix}</p>
                                <Badge className="bg-blue-500/20 text-blue-400">{d.status}</Badge>
                              </div>
                            ))}
                            <Button onClick={() => setAutoFixData(null)} className="w-full bg-muted hover:bg-accent hover:text-accent-foreground border border-slate-600 transition-all">
                              Review New Fixes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
