'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, RefreshCw, TrendingUp, Eye, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface TrustScoreBreakdown {
  clarity: number
  completeness: number
  trust_signals: number
  consistency: number
}

interface TrustScoreReason {
  factor: string
  score: number
  explanation: string
  recommendations: string[]
}

interface TrustScoreResponse {
  overall_score: number
  breakdown: TrustScoreBreakdown
  reasons: TrustScoreReason[]
  generated_at: string
}

export function TrustScoreDashboard() {
  const { user, token } = useAuth()
  const [trustScore, setTrustScore] = useState<TrustScoreResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  useEffect(() => {
    loadTrustScore()
  }, [])

  const loadTrustScore = async () => {
    try {
      const response = await fetch('/api/ai/trust-score', {
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
        setTrustScore(data)
        setLastAnalyzed(data.generated_at)
      }
    } catch (error) {
      console.error('Failed to load trust score:', error)
    }
  }

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/trust-score', {
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
        setTrustScore(data)
        setLastAnalyzed(data.generated_at)
      }
    } catch (error) {
      console.error('Failed to run trust score analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case 'clarity': return <Eye className="h-4 w-4" />
      case 'completeness': return <FileText className="h-4 w-4" />
      case 'trust_signals': return <Shield className="h-4 w-4" />
      case 'consistency': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getFactorLabel = (factor: string) => {
    switch (factor) {
      case 'clarity': return 'Clarity'
      case 'completeness': return 'Completeness'
      case 'trust_signals': return 'Trust Signals'
      case 'consistency': return 'Consistency'
      default: return factor
    }
  }

  if (!trustScore) {
    return (
      <div className="space-y-6">
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              AI Trust Score
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Measure your store's trustworthiness and credibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Trust Score Available</h3>
              <p className="text-muted-foreground mb-4">Run your first AI trust analysis</p>
              <Button onClick={runAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Calculate Trust Score
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
          <h2 className="text-2xl font-bold text-foreground">AI Trust Score</h2>
          <p className="text-muted-foreground">Measure your store's trustworthiness and credibility</p>
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
            <Shield className="h-5 w-5" />
            Overall Trust Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(trustScore.overall_score)}`}>
                {trustScore.overall_score}
              </div>
              <p className="text-muted-foreground">out of 100</p>
            </div>
            <div className="w-48">
              <Progress value={trustScore.overall_score} className="h-4" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(trustScore.breakdown).map(([factor, score]) => (
          <Card key={factor} className="border-white/10 bg-card text-card-foreground/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getFactorIcon(factor)}
                  <span className="text-sm font-medium text-foreground">
                    {getFactorLabel(factor)}
                  </span>
                </div>
                <Badge className={getScoreColor(score * 100)}>
                  {Math.round(score * 100)}%
                </Badge>
              </div>
              <Progress value={score * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Factor Explanations */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Factor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trustScore.reasons.map((reason, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getFactorIcon(reason.factor)}
                    <h4 className="font-medium text-foreground">
                      {getFactorLabel(reason.factor)}
                    </h4>
                    <Badge className={getScoreColor(reason.score * 100)}>
                      {Math.round(reason.score * 100)}%
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{reason.explanation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trustScore.reasons.flatMap((reason) =>
                reason.recommendations.map((rec, idx) => (
                  <div key={`${reason.factor}-${idx}`} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full mt-2" />
                    <p className="text-muted-foreground text-sm">{rec}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}