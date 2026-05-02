'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Sparkles, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: number
  shopify_id: string
  title: string
  handle: string
  description?: string
  product_type?: string
  vendor?: string
  tags: string[]
  status: string
  variants: any[]
  images: any[]
}

interface PersonaAnalysis {
  persona: string
  decision: string
  reasoning: string
  confidence: number
  missing_info: string[]
}

interface ShadowShopperResponse {
  product_id: number
  product_title: string
  query: string
  analyses: PersonaAnalysis[]
}

function LoadingAnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 loading-skeleton rounded-lg" />
      <div className="h-40 loading-skeleton rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 loading-skeleton rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function AIShadowShopper() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [query, setQuery] = useState("Is this product worth buying?")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ShadowShopperResponse | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productError, setProductError] = useState<string | null>(null)

  // Load products on component mount
  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true)
      setProductError(null)

      // First get stores
      const storesResponse = await fetch('/api/stores/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include'
      })

      if (storesResponse.ok) {
        const stores = await storesResponse.json()
        if (stores.length > 0) {
          // Load products from the first store
          const productsResponse = await fetch(`/api/stores/${stores[0].id}/products`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            },
            credentials: 'include'
          })

          if (productsResponse.ok) {
            const productsData = await productsResponse.json()
            setProducts(productsData)
            if (productsData.length > 0) {
              setSelectedProduct(productsData[0])
            }
          } else {
            setProductError('Failed to load products from store.')
          }
        }
      } else {
        setProductError('No stores connected. Please connect a store first.')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setProductError('Failed to load products. Please try again.')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const runAnalysis = async () => {
    if (!selectedProduct) {
      toast({
        title: "No Product Selected",
        description: "Please select a product to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisResult(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 300)

      const response = await fetch('/api/ai/shadow-shopper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: selectedProduct.id,
          query: query
        })
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult(result)
        toast({
          title: "Analysis Complete",
          description: "AI Shadow Shopper analysis finished successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Analysis Failed",
          description: error.detail || "Failed to run AI analysis.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error running analysis:', error)
      toast({
        title: "Error",
        description: "Failed to run AI analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 1000)
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'recommend': return <CheckCircle className="h-5 w-5 text-blue-400" />
      case 'not_recommend': return <XCircle className="h-5 w-5 text-red-400" />
      case 'neutral': return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default: return null
    }
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'recommend': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'not_recommend': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'neutral': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getDecisionText = (decision: string) => {
    switch (decision) {
      case 'recommend': return 'Recommend'
      case 'not_recommend': return 'Not Recommend'
      case 'neutral': return 'Neutral'
      default: return decision
    }
  }

  if (isLoadingProducts) {
    return (
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">AI Shadow Shopper</CardTitle>
          <CardDescription className="text-muted-foreground">
            Loading analysis tool...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingAnalysisSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analysis Setup */}
      <Card className="border-white/10 bg-card text-card-foreground/50 hover-lift transition-all duration-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-foreground">AI Shadow Shopper</CardTitle>
              <CardDescription className="text-muted-foreground">
                Run AI-powered analysis using different shopper personas to understand how customers perceive your products
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Error State */}
          {productError && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                {productError}
              </AlertDescription>
            </Alert>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product-select" className="text-foreground font-medium">Select Product</Label>
            <Select
              value={selectedProduct?.id.toString() || ""}
              onValueChange={(value) => {
                const product = products.find(p => p.id.toString() === value)
                setSelectedProduct(product || null)
              }}
            >
              <SelectTrigger className="bg-muted border-white/10 text-foreground hover:border-white/20 transition-colors">
                <SelectValue placeholder="Choose a product to analyze" />
              </SelectTrigger>
              <SelectContent className="bg-muted border-white/10">
                {products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No products available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Label htmlFor="query-input" className="text-foreground font-medium">Analysis Query</Label>
            <Input
              id="query-input"
              type="text"
              placeholder="Enter a question for the AI personas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isAnalyzing}
              className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground hover:border-white/20 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Example: "Is this product worth the price?" or "Would a budget shopper be interested?"
            </p>
          </div>

          {/* Run Analysis Button */}
          <Button
            onClick={runAnalysis}
            disabled={!selectedProduct || isAnalyzing || products.length === 0}
            className="w-full hover-lift transition-all duration-200 h-11"
            size="default"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run AI Shadow Shopper Analysis
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Analyzing with AI personas...</span>
                <span className="font-medium">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Results Header */}
          <Card className="border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50 hover-lift transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground">Analysis Results</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                <span className="block text-sm">Product: <span className="text-foreground font-medium">{analysisResult.product_title}</span></span>
                <span className="block text-sm mt-1">Query: <span className="text-foreground font-medium">"{analysisResult.query}"</span></span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Persona Analyses */}
          <div className="space-y-4">
            {analysisResult.analyses.map((analysis, index) => (
              <Card key={index} className="border-white/10 bg-card text-card-foreground/50 hover-lift transition-all duration-200 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        {getDecisionIcon(analysis.decision)}
                      </div>
                      <CardTitle className="text-foreground text-lg">{analysis.persona}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${getDecisionColor(analysis.decision)} border`}>
                        {getDecisionText(analysis.decision)}
                      </Badge>
                      <Badge variant="secondary" className="border-white/10">
                        {Math.round(analysis.confidence * 100)}% confident
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">Reasoning</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{analysis.reasoning}</p>
                  </div>

                  {/* Missing Information */}
                  {analysis.missing_info.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <h4 className="font-semibold text-foreground text-sm">Missing Information</h4>
                      <div className="space-y-2">
                        {analysis.missing_info.map((info, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span className="text-muted-foreground">{info}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence Bar */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Confidence Level</span>
                      <span className="text-foreground font-semibold">{Math.round(analysis.confidence * 100)}%</span>
                    </div>
                    <Progress value={analysis.confidence * 100} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="border-white/10 bg-card text-card-foreground/50 hover-lift transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {analysisResult.analyses.filter(a => a.decision === 'recommend').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Recommend</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center border border-yellow-500/20">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">
                    {analysisResult.analyses.filter(a => a.decision === 'neutral').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Neutral</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center border border-red-500/20">
                  <div className="text-3xl font-bold text-red-400 mb-1">
                    {analysisResult.analyses.filter(a => a.decision === 'not_recommend').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Not Recommend</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setAnalysisResult(null)}
              variant="secondary"
              className="hover-lift transition-all duration-200"
              size="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Another Analysis
            </Button>
          </div>
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && !isAnalyzing && !isLoadingProducts && !productError && (
        <Card className="border-white/10 bg-card text-card-foreground/50">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4 opacity-75" />
            <p className="text-muted-foreground mb-2 font-medium">No Products Available</p>
            <p className="text-sm text-muted-foreground">Connect a Shopify store and sync products to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}