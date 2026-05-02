'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle, Clock, Eye, MessageSquare, XCircle } from 'lucide-react'

interface TimelineStep {
  step_number: number
  action: string
  title: string
  description: string
  reasoning: string
  missing_info: string[]
  confidence: number
  timestamp: string
}

interface ReplayTimelineProps {
  timeline: TimelineStep[]
  finalDecision: string
  overallConfidence: number
  persona: string
  isPlaying?: boolean
  currentStep?: number
  onStepClick?: (stepIndex: number) => void
}

export function ReplayTimeline({
  timeline,
  finalDecision,
  overallConfidence,
  persona,
  isPlaying = false,
  currentStep = 0,
  onStepClick
}: ReplayTimelineProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  const getStepIcon = (action: string, confidence: number) => {
    const baseClasses = "h-6 w-6"

    switch (action.toLowerCase()) {
      case 'read product':
        return <Eye className={`${baseClasses} text-blue-400`} />
      case 'evaluate query':
        return <MessageSquare className={`${baseClasses} text-blue-400`} />
      case 'confusion':
        return <AlertCircle className={`${baseClasses} text-yellow-400`} />
      case 'drop':
        if (confidence > 0.7) {
          return <CheckCircle className={`${baseClasses} text-blue-400`} />
        } else if (confidence > 0.4) {
          return <Clock className={`${baseClasses} text-orange-400`} />
        } else {
          return <XCircle className={`${baseClasses} text-red-400`} />
        }
      default:
        return <Clock className={`${baseClasses} text-muted-foreground`} />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-blue-400'
    if (confidence > 0.6) return 'text-yellow-400'
    if (confidence > 0.4) return 'text-orange-400'
    return 'text-red-400'
  }

  const getDecisionBadgeVariant = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'recommend':
        return 'default'
      case 'not_recommend':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                AI Decision Timeline
                <Badge variant="outline" className="text-xs">
                  {persona}
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Step-by-step breakdown of AI analysis process
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant={getDecisionBadgeVariant(finalDecision)} className="mb-2">
                {finalDecision.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Overall Confidence: {(overallConfidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500 to-blue-500 opacity-30" />

        <div className="space-y-6">
          {timeline.map((step, index) => {
            const isActive = isPlaying && currentStep === index
            const isCompleted = currentStep > index
            const isSelected = selectedStep === index

            return (
              <div key={step.step_number} className="relative flex items-start gap-6">
                {/* Step Circle */}
                <div
                  className={`
                    relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'border-blue-400 bg-blue-400/20 shadow-lg shadow-blue-400/25'
                      : isCompleted
                        ? 'border-blue-400 bg-blue-400/20'
                        : isSelected
                          ? 'border-blue-400 bg-blue-400/20 shadow-lg shadow-blue-400/25'
                          : 'border-slate-600 bg-muted hover:border-slate-500'
                    }
                  `}
                  onClick={() => {
                    setSelectedStep(isSelected ? null : index)
                    onStepClick?.(index)
                  }}
                >
                  {getStepIcon(step.action, step.confidence)}
                  {isActive && (
                    <div className="absolute -inset-1 rounded-full border-2 border-blue-400/50 animate-ping" />
                  )}
                </div>

                {/* Step Content */}
                <Card
                  className={`
                    flex-1 border-white/10 transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'bg-blue-950/50 border-blue-400/50 shadow-lg shadow-blue-400/10'
                      : isSelected
                        ? 'bg-blue-950/50 border-blue-400/50 shadow-lg shadow-blue-400/10'
                        : 'bg-card text-card-foreground/50 hover:bg-accent hover:text-accent-foreground/50'
                    }
                  `}
                  onClick={() => {
                    setSelectedStep(isSelected ? null : index)
                    onStepClick?.(index)
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          Step {step.step_number}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <span className="text-sm text-muted-foreground">{step.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getConfidenceColor(step.confidence)}`}>
                          {(step.confidence * 100).toFixed(0)}% confident
                        </span>
                        <Progress value={step.confidence * 100} className="w-16 h-2" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-3">{step.description}</p>

                    {/* Expandable Details */}
                    {isSelected && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
                        {/* Reasoning */}
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            AI Reasoning
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{step.reasoning}</p>
                        </div>

                        {/* Missing Information */}
                        {step.missing_info && step.missing_info.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Missing Information
                            </h4>
                            <div className="space-y-1">
                              {step.missing_info.map((info, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full" />
                                  <span className="text-muted-foreground">{info}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline Summary */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeline.length}</div>
              <div className="text-sm text-muted-foreground">Total Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {timeline.filter(s => s.missing_info.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Info Gaps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {(timeline.reduce((acc, s) => acc + s.confidence, 0) / timeline.length * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                finalDecision === 'recommend' ? 'text-blue-400' :
                finalDecision === 'not_recommend' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {finalDecision === 'recommend' ? '✓' :
                 finalDecision === 'not_recommend' ? '✗' : '?'}
              </div>
              <div className="text-sm text-muted-foreground">Decision</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}