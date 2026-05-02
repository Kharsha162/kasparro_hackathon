'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Chart } from '@/components/dashboard/chart'
import { Progress } from '@/components/ui/progress'
import { AutoFixEngine } from '@/components/dashboard/auto-fix-engine'

export default function AnalysisPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [activeIssues, setActiveIssues] = useState(issues)
  const [fixingId, setFixingId] = useState<number | null>(null)

  const handleFix = async (id: number) => {
    setFixingId(id)
    await new Promise(r => setTimeout(r, 1500))
    setActiveIssues(prev => prev.map((issue: any) => {
      if (issue.id === id) {
        let details = "Issue has been automatically resolved using AI Engine."
        if (issue.title.includes("alt text")) details = "Generated and mapped highly descriptive alt text for 124 product images across your catalog."
        if (issue.title.includes("load times")) details = "Optimized asset delivery and activated lazy loading. Page load times reduced by 1.2s."
        if (issue.title.includes("descriptions")) details = "Rewrote 43 product descriptions. Maintained unified brand voice and consistent formatting."
        if (issue.title.includes("navigation")) details = "Restructured main menu logic to flatten hierarchy. Category depth reduced to 2 levels maximum."
        return { ...issue, isFixed: true, fixDetails: details }
      }
      return issue
    }))
    setFixingId(null)
  }

  const handleScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Store Analysis</h1>
        <p className="text-muted-foreground">Deep analysis of how AI agents perceive and interact with your Shopify store.</p>
      </div>

      {/* Scan Controls */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">Run New Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">
            Scan your store for AI perception issues and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Scanning store...</span>
                <span className="text-sm text-muted-foreground">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          ) : (
            <div className="flex gap-4">
              <Button onClick={handleScan} size="default">
                Start Full Scan
              </Button>
              <Button variant="secondary" size="default">
                Quick Check
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground">AI Perception Score</CardTitle>
            <CardDescription className="text-muted-foreground">
              Overall score of how well AI agents understand your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">87</div>
              <div className="text-sm text-muted-foreground mb-4">out of 100</div>
              <Progress value={87} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground">Issues by Severity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Breakdown of issues found during analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart type="pie" data={severityData} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Issues */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">Detailed Issues</CardTitle>
          <CardDescription className="text-muted-foreground">
            Specific problems identified in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeIssues.map((issue: any) => (
              <div key={issue.id} className="flex flex-col gap-4 p-4 rounded-lg border border-white/5 bg-muted/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Impact: {issue.impact}</span>
                      <span className="text-xs text-muted-foreground">Category: {issue.category}</span>
                    </div>
                  </div>
                  {issue.isFixed ? (
                    <Badge className="bg-blue-500/20 text-blue-400 py-1.5 px-3 border border-blue-500/30">Fixed âœ“</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleFix(issue.id)}
                      disabled={fixingId === issue.id}
                      className={fixingId === issue.id ? "bg-blue-600/50" : "bg-blue-600 hover:bg-blue-700 text-foreground border-0"}
                    >
                      {fixingId === issue.id ? "Fixing..." : "Auto Fix"}
                    </Button>
                  )}
                </div>
                {issue.isFixed && (
                  <div className="mt-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-sm text-blue-300">
                    <strong className="text-blue-400 block mb-1">âœ¨ Auto Fix Deployed:</strong>
                    {issue.fixDetails}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Load Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2.3s</div>
            <p className="text-xs text-blue-400">+0.2s faster than average</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mobile Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">92</div>
            <p className="text-xs text-blue-400">Excellent mobile experience</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">88</div>
            <p className="text-xs text-yellow-400">Good, room for improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Fix Engine */}
      <AutoFixEngine />
    </div>
  )
}

// Placeholder data
const severityData = [
  { name: 'High', value: 15, color: '#ef4444' },
  { name: 'Medium', value: 35, color: '#f59e0b' },
  { name: 'Low', value: 50, color: '#10b981' },
]

const issues = [
  {
    id: 1,
    title: 'Missing alt text on product images',
    description: 'AI agents cannot understand product images without descriptive alt text',
    severity: 'high',
    impact: 'High',
    category: 'Accessibility',
  },
  {
    id: 2,
    title: 'Slow page load times',
    description: 'Pages taking over 3 seconds to load may cause AI agents to abandon browsing',
    severity: 'medium',
    impact: 'Medium',
    category: 'Performance',
  },
  {
    id: 3,
    title: 'Inconsistent product descriptions',
    description: 'Product descriptions vary in length and detail, confusing AI analysis',
    severity: 'medium',
    impact: 'Medium',
    category: 'Content',
  },
  {
    id: 4,
    title: 'Complex navigation structure',
    description: 'Menu hierarchy is too deep, making it hard for AI to navigate efficiently',
    severity: 'low',
    impact: 'Low',
    category: 'Navigation',
  },
]