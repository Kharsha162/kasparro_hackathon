'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReplayTimeline } from '@/components/dashboard/replay-timeline'
import { useAuth } from '@/hooks/useAuth'

export default function ReplayPage() {
  const { user, token } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [query, setQuery] = useState('Is this product worth buying?')
  const [timelineData, setTimelineData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  // Load products on component mount
  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      // Simulate backend fetch latency
      await new Promise(r => setTimeout(r, 600))
      
      setProducts([
        { id: 101, store: 'TechHaven', category: 'Electronics - Audio', title: 'Premium Wireless Headphones' },
        { id: 102, store: 'TechHaven', category: 'Electronics - Displays', title: '4K Ultra HD Monitor' },
        { id: 201, store: 'FitGear Shop', category: 'Apparel - Activewear', title: 'AeroKnit Compression Leggings' },
        { id: 202, store: 'FitGear Shop', category: 'Apparel - Footwear', title: 'CloudFoam Running Shoes' },
        { id: 301, store: 'ModernLife', category: 'Home & Kitchen', title: 'Lumina Smart Coffee Maker' },
        { id: 401, store: 'GlowBoutique', category: 'Beauty & Skincare', title: 'Vitamin C Brightening Serum' }
      ])
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const runTimelineAnalysis = async () => {
    if (!selectedProduct) return

    setIsAnalyzing(true)
    setTimelineData(null)

    try {
      // Simulate backend analysis generation
      await new Promise(r => setTimeout(r, 2000))
      
      const selectedProductName = products.find(p => p.id.toString() === selectedProduct)?.title || 'Selected Product'
      
      // Dynamic Mock Outputs based on the Product chosen
      let finalDecision = "not_recommend";
      let reasoning1 = `The hook is somewhat compelling but fails to properly utilize Shopify's native subtitle parameters. I am looking for immediate clarity without scrolling below the fold.`;
      let missing1 = ['Product dimensions inside Shopify standard fields', 'Specific material composition tags'];
      let reasoning2 = 'The product contains elements related to the query, but the Shopify Buy Button is overpowered by visual clutter, preventing a clear checkout flow.';
      let missing2 = ['Dynamic checkout button missing (Shop Pay)', 'Clear return policy block'];
      let reasoning3 = 'The Shopify variants are presented as a massive list rather than grouped selectors (Color dropdown vs Size swatches), creating cognitive load.';
      let missing3 = ['Structured variant hierarchies', 'Technical constraints section'];
      let reasoning4 = 'Too many unresolved questions regarding the secondary features. Cart conversion likelihood is dropped by 45% due to generic Shopify theme limitations.';
      let missing4 = ['Trust badges in footer', 'Cross-sell pipeline blocks'];
      
      let conf1 = 0.8, conf2 = 0.6, conf3 = 0.45, conf4 = 0.9;
      let overallConf = 0.68;
      let persona = "Skeptical Analyst Shopper";

      if (selectedProductName.includes('Headphones')) {
        finalDecision = "recommend";
        conf1 = 0.95; conf2 = 0.88; conf3 = 0.85; conf4 = 0.92;
        overallConf = 0.90;
        persona = "Audiophile Enthusiast";
        reasoning1 = `Excellent use of Shopify rich text formatting. The 30-hour battery life is featured prominently above the fold.`;
        missing1 = [];
        missing2 = ['Detailed warranty terms'];
        reasoning3 = `The variants (colors) are properly set up using visual swatches, minimizing clicks.`;
        missing3 = [];
        reasoning4 = `High confidence in the product quality due to clear tech specs. Adding to cart seamlessly.`;
        missing4 = [];
      } else if (selectedProductName.includes('Leggings')) {
        conf1 = 0.75; conf2 = 0.55; conf3 = 0.40; conf4 = 0.85;
        overallConf = 0.58;
        persona = "Active Fitness Shopper";
        missing1 = ['Sizing chart link missing next to variant selector'];
        reasoning3 = `Shopify size variants are present, but there is no immediate correlation to actual measurements, causing a high drop risk.`;
      } else if (selectedProductName.includes('Serum')) {
        finalDecision = "recommend";
        conf1 = 0.85; conf2 = 0.90; conf3 = 0.70; conf4 = 0.80;
        overallConf = 0.82;
        persona = "Skincare Researcher";
        reasoning3 = `Ingredients list is properly formatted in a Shopify accordion block, which is excellent for readability on mobile devices.`;
        missing3 = ['Dermatologist certification badge'];
        reasoning4 = `Brand trust is established well enough to overcome minor friction points. Shop Pay express checkout was readily found.`;
        missing4 = [];
      } else if (selectedProductName.includes('Monitor')) {
        conf1 = 0.60; conf2 = 0.45; conf3 = 0.30; conf4 = 0.80;
        overallConf = 0.43;
        reasoning2 = `Missing critical technical parameters in the standard Shopify layout; everything is hidden behind a confusing generic description block.`;
      }

      const mockData = {
        timeline: [
          {
            step_number: 1,
            action: 'read product',
            title: 'Scan Product Listing',
            description: `Evaluates initial hook and product title for ${selectedProductName}`,
            reasoning: reasoning1,
            missing_info: missing1,
            confidence: conf1,
            timestamp: "0.2s"
          },
          {
            step_number: 2,
            action: 'evaluate query',
            title: 'Assess Query Match',
            description: 'Checking if product context matches: "' + query + '"',
            reasoning: reasoning2,
            missing_info: missing2,
            confidence: conf2,
            timestamp: "0.8s"
          },
          {
            step_number: 3,
            action: 'confusion',
            title: 'Identify Friction',
            description: 'Hits a snag when looking for compatibility parameters',
            reasoning: reasoning3,
            missing_info: missing3,
            confidence: conf3,
            timestamp: "1.4s"
          },
          {
            step_number: 4,
            action: 'drop',
            title: 'Final Decision',
            description: 'Persona abandons cart / makes final choice',
            reasoning: reasoning4,
            missing_info: missing4,
            confidence: conf4,
            timestamp: "2.1s"
          }
        ],
        final_decision: finalDecision,
        overall_confidence: overallConf,
        persona: persona
      }
      
      setTimelineData(mockData)
    } catch (error) {
      console.error('Error running timeline analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePlayTimeline = () => {
    if (!timelineData) return

    setIsPlaying(true)
    setCurrentStep(0)

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= timelineData.timeline.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return timelineData.timeline.length - 1
        }
        return prev + 1
      })
    }, 3000) // 3 seconds per step
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Replay Mode</h1>
        <p className="text-muted-foreground">Watch AI personas analyze products step-by-step with detailed reasoning and decision-making process.</p>
      </div>

      {/* Analysis Controls */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">AI Timeline Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a product and run step-by-step AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="product-select" className="text-muted-foreground">Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent className="bg-muted border-border">
                  {['TechHaven', 'FitGear Shop', 'ModernLife', 'GlowBoutique'].map((storeName, storeIdx) => (
                    <SelectGroup key={storeName}>
                      <SelectLabel className="text-blue-400 font-bold">{storeName}</SelectLabel>
                      {products.filter(p => p.store === storeName).map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex flex-col text-left">
                            <span>{product.title}</span>
                            <span className="text-[10px] text-muted-foreground">{product.category}</span>
                          </div>
                        </SelectItem>
                      ))}
                      {storeIdx < 3 && <SelectSeparator className="bg-slate-700" />}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="query-input" className="text-muted-foreground">Analysis Query</Label>
              <Input
                id="query-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your question..."
                className="bg-muted border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Actions</Label>
              <div className="flex gap-2">
                <Button
                  onClick={runTimelineAnalysis}
                  disabled={isAnalyzing || !selectedProduct}
                  className="flex-1"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
                {timelineData && (
                  <Button
                    onClick={handlePlayTimeline}
                    disabled={isPlaying}
                    variant="secondary"
                  >
                    {isPlaying ? 'Playing...' : 'Play Timeline'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Generating AI timeline...</span>
                <span className="text-sm text-muted-foreground">Processing step-by-step analysis</span>
              </div>
              <Progress value={66} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Display */}
      {timelineData ? (
        <ReplayTimeline
          timeline={timelineData.timeline}
          finalDecision={timelineData.final_decision}
          overallConfidence={timelineData.overall_confidence}
          persona={timelineData.persona}
          isPlaying={isPlaying}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      ) : (
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Ready for Analysis</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a product and run AI timeline analysis to see step-by-step decision making with detailed reasoning and missing information highlights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Sessions */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">Previous Analyses</CardTitle>
          <CardDescription className="text-muted-foreground">
            Revisit past AI timeline analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No previous analyses saved yet</p>
            <p className="text-sm text-muted-foreground mt-1">Completed analyses will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}