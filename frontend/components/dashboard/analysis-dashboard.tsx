'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingUp, Target, Users, RefreshCw, Eye, Zap, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface AnalysisInsight {
  mismatches: string[]
  missing_data: string[]
  impact_level: 'low' | 'medium' | 'high' | 'critical'
}

interface PerceptionRealityAnalysis {
  title: string
  description: string
  insight: AnalysisInsight
  recommendations: string[]
}

interface ConversionKillSwitch {
  title: string
  description: string
  trigger_points: string[]
  impact_level: 'low' | 'medium' | 'high' | 'critical'
  mitigation_steps: string[]
}

interface IntentCoverageAnalysis {
  title: string
  description: string
  coverage_score: number
  gaps: string[]
  recommendations: string[]
}

interface StoreAnalysisResponse {
  perception_reality: PerceptionRealityAnalysis[]
  conversion_kill_switches: ConversionKillSwitch[]
  intent_coverage: IntentCoverageAnalysis
  overall_score: number
  generated_at: string
}

export function AnalysisDashboard() {
  const { user, token } = useAuth()
  const [analysisData, setAnalysisData] = useState<StoreAnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  useEffect(() => {
    loadAnalysisData()
  }, [])

  const loadAnalysisData = async () => {
    try {
      const response = await fetch('/api/ai/store-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data)
        setLastAnalyzed(data.generated_at)
      }
    } catch (error) {
      console.error('Failed to load analysis data:', error)
    }
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/store-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data)
        setLastAnalyzed(data.generated_at)
      }
    } catch (error) {
      console.error('Failed to run analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-950/50'
      case 'high': return 'text-orange-400 bg-orange-950/50'
      case 'medium': return 'text-yellow-400 bg-yellow-950/50'
      case 'low': return 'text-blue-400 bg-blue-950/50'
      default: return 'text-muted-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-blue-400'
    if (score >= 0.6) return 'text-yellow-400'
    if (score >= 0.4) return 'text-orange-400'
    return 'text-red-400'
  }

  if (!analysisData) {
    return (
      <div className="space-y-6">
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI Analysis Engine
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Advanced store analysis powered by OpenAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Analysis Data</h3>
              <p className="text-muted-foreground mb-4">Run your first AI-powered store analysis</p>
              <Button onClick={runAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Analysis Engine</h2>
          <p className="text-muted-foreground">OpenAI-powered insights for your store</p>
        </div>
        <div className="flex items-center gap-4">
          {lastAnalyzed && (
            <span className="text-sm text-muted-foreground">
              Last analyzed: {new Date(lastAnalyzed).toLocaleString()}
            </span>
          )}
          <Button onClick={runAnalysis} disabled={isAnalyzing} variant="secondary">
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Store Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(analysisData.overall_score)}`}>
                {Math.round(analysisData.overall_score * 100)}%
              </div>
              <p className="text-muted-foreground">Store performance score</p>
            </div>
            <div className="w-32">
              <Progress value={analysisData.overall_score * 100} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Perception vs Reality */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Perception vs Reality
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Customer expectations vs actual experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.perception_reality.slice(0, 2).map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                    <Badge className={getImpactColor(item.insight.impact_level)}>
                      {item.insight.impact_level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  {item.insight.mismatches.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.insight.mismatches.slice(0, 2).map((mismatch, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {mismatch}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Kill Switches */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Conversion Kill Switches
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Critical barriers preventing purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.conversion_kill_switches.slice(0, 2).map((killSwitch, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">{killSwitch.title}</h4>
                    <Badge className={getImpactColor(killSwitch.impact_level)}>
                      {killSwitch.impact_level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{killSwitch.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {killSwitch.trigger_points.slice(0, 2).map((point, idx) => (
                      <Badge key={idx} variant="destructive" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intent Coverage */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Intent Coverage
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              How well you serve customer shopping intents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Coverage Score</span>
                <span className={`font-bold ${getScoreColor(analysisData.intent_coverage.coverage_score)}`}>
                  {Math.round(analysisData.intent_coverage.coverage_score * 100)}%
                </span>
              </div>
              <Progress value={analysisData.intent_coverage.coverage_score * 100} className="h-2" />

              <div>
                <h4 className="font-medium text-foreground text-sm mb-2">Coverage Gaps</h4>
                <div className="flex flex-wrap gap-1">
                  {analysisData.intent_coverage.gaps.slice(0, 3).map((gap, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommendations */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Key Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Perception Reality Recommendations */}
              {analysisData.perception_reality.flatMap(pr =>
                pr.recommendations.slice(0, 2).map((rec, idx) => (
                  <div key={`pr-${idx}`} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full mt-2" />
                    <p className="text-muted-foreground text-sm">{rec}</p>
                  </div>
                ))
              )}

              {/* Kill Switch Mitigation */}
              {analysisData.conversion_kill_switches.flatMap(ks =>
                ks.mitigation_steps.slice(0, 2).map((step, idx) => (
                  <div key={`ks-${idx}`} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-muted-foreground text-sm">{step}</p>
                  </div>
                ))
              )}

              {/* Intent Coverage Recommendations */}
              {analysisData.intent_coverage.recommendations.slice(0, 2).map((rec, idx) => (
                <div key={`ic-${idx}`} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-400 rounded-full mt-2" />
                  <p className="text-muted-foreground text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Data Alert */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Missing Data Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.perception_reality.flatMap(pr =>
                pr.insight.missing_data.map((data, idx) => (
                  <div key={`md-${idx}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground text-sm">{data}</span>
                    <Badge variant="secondary" className="text-xs">
                      High Impact
                    </Badge>
                  </div>
                ))
              ).slice(0, 4)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}