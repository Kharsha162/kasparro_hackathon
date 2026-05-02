'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Copy, CheckCircle, Wand2, RefreshCw, FileText, HelpCircle, Settings, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface ProductSpec {
  name: string
  value: string
  category: string
}

interface FAQItem {
  question: string
  answer: string
  category: string
}

interface AutoFixResponse {
  product_id: number
  original_description: string
  improved_description: string
  generated_faqs: FAQItem[]
  structured_specs: ProductSpec[]
  improvements_made: string[]
  generated_at: string
}

interface Product {
  id: number
  title: string
  description: string
  store?: string
  category?: string
}

export function AutoFixEngine() {
  const { user, token } = useAuth()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [isApplying, setIsApplying] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    // Simulate backend fetch
    await new Promise(r => setTimeout(r, 600))
    setProducts([
      { id: 101, store: 'TechHaven', category: 'Electronics - Audio', title: 'Premium Wireless Headphones', description: 'Studio quality headphones with noise cancellation and 30-hour battery life.' },
      { id: 102, store: 'TechHaven', category: 'Electronics - Displays', title: '4K Ultra HD Monitor', description: '27-inch 4K monitor for professionals with 99% sRGB color gamut.' },
      { id: 201, store: 'FitGear Shop', category: 'Apparel - Activewear', title: 'AeroKnit Compression Leggings', description: 'Breathable, high-waisted seamless leggings for peak performance.' },
      { id: 202, store: 'FitGear Shop', category: 'Apparel - Footwear', title: 'CloudFoam Running Shoes', description: 'Ultra-lightweight marathon trainers with responsive cushioning.' },
      { id: 301, store: 'ModernLife', category: 'Home & Kitchen', title: 'Lumina Smart Coffee Maker', description: 'WiFi-enabled coffee machine with mobile app integration.' },
      { id: 401, store: 'GlowBoutique', category: 'Beauty & Skincare', title: 'Vitamin C Brightening Serum', description: 'Clinical grade antioxidant face serum with hyaluronic acid.' }
    ])
  }

  const runAutoFix = async () => {
    if (!selectedProduct) return

    setIsAnalyzing(true)
    setIsApplied(false)
    try {
      // Simulate AI processing delay
      await new Promise(r => setTimeout(r, 2000))
      
      const mockResult: AutoFixResponse = {
        product_id: selectedProduct.id,
        original_description: selectedProduct.description,
        improved_description: `Experience the pinnacle of performance with the ${selectedProduct.title}. Engineered with cutting-edge technology to elevate your daily routine, this premium offering combines aesthetic elegance with uncompromised functionality.\n\n🚀 Why you'll love it:\n- Premium build quality designed to last\n- Industry-leading reliability\n- Intelligent design for maximum efficiency`,
        generated_faqs: [
          { question: `Is the ${selectedProduct.title} easy to set up?`, answer: "Yes, it features a plug-and-play architecture that takes less than 2 minutes to configure right out of the box.", category: 'usage' },
          { question: "What is the warranty period?", answer: "It comes with a standard 1-year manufacturer warranty covering parts and labor.", category: 'other' },
          { question: "What are the dimensions?", answer: "Designed specifically to have a minimal desk footprint while maximizing output.", category: 'dimensions' }
        ],
        structured_specs: [
          { name: 'Model Identity', value: selectedProduct.title, category: 'specifications' },
          { name: 'Materials', value: 'Aerospace-grade Aluminum, Premium Synthetics', category: 'materials' },
          { name: 'Compatibility', value: 'Universal compatibility across major platforms', category: 'compatibility' }
        ],
        improvements_made: [
          'Rewrote product hook to increase emotional engagement by an estimated 14%',
          'Structured feature bullet points with emojis for quick scanning',
          'Added 3 common user FAQs to reduce pre-sales friction by 22%',
          'Generated standardized technical specifications array'
        ],
        generated_at: new Date().toISOString()
      }
      setAutoFixResult(mockResult)
    } catch (error) {
      console.error('Failed to run auto-fix:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const applyChanges = async () => {
    if (!autoFixResult || !selectedProduct) return

    setIsApplying(true)
    try {
      // Simulate backend apply latency
      await new Promise(r => setTimeout(r, 1200))
      
      // Update the mocked product list to reflect the new AI-generated description live in the UI!
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, description: autoFixResult.improved_description }
          : p
      ))
      
      // Update the locally selected product's reference
      setSelectedProduct(prev => prev ? { ...prev, description: autoFixResult.improved_description } : null)
      
      setIsApplied(true)
    } catch (error) {
      console.error('Failed to apply changes:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'usage': 'bg-blue-100 text-blue-800',
      'specifications': 'bg-blue-100 text-blue-800',
      'shipping': 'bg-blue-100 text-blue-800',
      'returns': 'bg-orange-100 text-orange-800',
      'compatibility': 'bg-blue-100 text-blue-800',
      'dimensions': 'bg-indigo-100 text-indigo-800',
      'materials': 'bg-blue-100 text-blue-800',
      'features': 'bg-yellow-100 text-yellow-800',
      'technical': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Auto-Fix Engine</h2>
          <p className="text-muted-foreground">AI-powered product content optimization</p>
        </div>
      </div>

      {/* Product Selection */}
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Select Product to Optimize
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose a product to analyze and improve with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-950/20'
                      : 'border-white/10 bg-muted/50 hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        {product.title}
                        <Badge variant="outline" className="text-[10px] py-0 border-white/20 text-muted-foreground">{product.store}</Badge>
                      </h4>
                      <p className="text-xs font-semibold text-blue-400 mb-1">{product.category}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || 'No description'}
                      </p>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <div className="flex gap-3">
                <Button
                  onClick={runAutoFix}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Run Auto-Fix
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {autoFixResult && (
        <div className="space-y-6">
          {/* Improvements Summary */}
          <Card className="border-white/10 bg-card text-card-foreground/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Improvements Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {autoFixResult.improvements_made.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full" />
                    <span className="text-muted-foreground">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Before/After Comparison */}
          <Card className="border-white/10 bg-card text-card-foreground/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Description Comparison
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Compare original vs AI-improved description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="improved" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="improved">AI Improved</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Original Description</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(autoFixResult.original_description, 'original-desc')}
                      >
                        {copiedItems.has('original-desc') ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={autoFixResult.original_description}
                      readOnly
                      className="min-h-[200px] bg-muted border-border text-muted-foreground"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="improved" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">AI Improved Description</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(autoFixResult.improved_description, 'improved-desc')}
                      >
                        {copiedItems.has('improved-desc') ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={autoFixResult.improved_description}
                      readOnly
                      className="min-h-[200px] bg-muted border-border text-muted-foreground"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Generated FAQs */}
          <Card className="border-white/10 bg-card text-card-foreground/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Generated FAQs
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                AI-generated frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {autoFixResult.generated_faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                        <span className="font-medium text-foreground">Q: {faq.question}</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(`${faq.question}\n\n${faq.answer}`, `faq-${index}`)}
                      >
                        {copiedItems.has(`faq-${index}`) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground pl-4 border-l-2 border-border">
                      A: {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Structured Specifications */}
          <Card className="border-white/10 bg-card text-card-foreground/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Structured Specifications
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Organized product specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {autoFixResult.structured_specs.map((spec, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(spec.category)}>
                        {spec.category}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(`${spec.name}: ${spec.value}`, `spec-${index}`)}
                      >
                        {copiedItems.has(`spec-${index}`) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">{spec.name}</h4>
                      <p className="text-muted-foreground">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Apply Changes */}
          <Card className="border-white/10 bg-card text-card-foreground/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Apply Changes</h3>
                  <p className="text-muted-foreground">Update the product with AI-generated improvements</p>
                </div>
                <Button 
                  onClick={applyChanges} 
                  disabled={isApplying || isApplied}
                  className={isApplied ? "bg-blue-600 hover:bg-blue-700 text-foreground" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isApplying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Publishing to Store...
                    </>
                  ) : isApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Changes Deployed!
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply All Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}