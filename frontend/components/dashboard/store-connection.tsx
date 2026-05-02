'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2, CheckCircle, Plus, RefreshCw, Package } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Store {
  id: number
  shop_domain: string
  is_connected: boolean
  created_at: string
}

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

export function StoreConnection() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoadingStores, setIsLoadingStores] = useState(true)
  const [stores, setStores] = useState<Store[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    shop_domain: '',
    api_key: '',
    api_secret: '',
    access_token: ''
  })

  const handleConnectStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setConnectionError(null)

    try {
      const response = await fetch('/api/stores/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newStore = await response.json()
        setStores(prev => [...prev, newStore])
        setSelectedStore(newStore)
        setIsDialogOpen(false)
        setFormData({
          shop_domain: '',
          api_key: '',
          api_secret: '',
          access_token: ''
        })

        toast({
          title: "Store Connected",
          description: `Successfully connected to ${newStore.shop_domain}`,
        })

        // Load products for the new store
        await loadProducts(newStore.id)
      } else {
        const error = await response.json()
        const errorMsg = error.detail || "Failed to connect store"
        setConnectionError(errorMsg)
        toast({
          title: "Connection Failed",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error connecting store:', error)
      const errorMsg = "Failed to connect store. Please try again."
      setConnectionError(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const loadStores = async () => {
    try {
      setIsLoadingStores(true)
      setConnectionError(null)
      
      const response = await fetch('/api/stores/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include'
      })

      if (response.ok) {
        const storesData = await response.json()
        setStores(storesData)
        if (storesData.length > 0) {
          setSelectedStore(storesData[0])
          await loadProducts(storesData[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading stores:', error)
      setConnectionError('Failed to load stores')
    } finally {
      setIsLoadingStores(false)
    }
  }

  const loadProducts = async (storeId: number) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/products`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include'
      })

      if (response.ok) {
        const productsData = await response.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const syncStoreData = async (storeId: number) => {
    setIsSyncing(true)
    try {
      const response = await fetch(`/api/stores/${storeId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Sync Complete",
          description: `Synced ${result.products_synced} products and ${result.policies_synced} policies`,
        })
        await loadProducts(storeId)
      } else {
        const error = await response.json()
        toast({
          title: "Sync Failed",
          description: error.detail || "Failed to sync store data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error syncing store:', error)
      toast({
        title: "Error",
        description: "Failed to sync store data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Load stores on component mount
  useEffect(() => {
    if (user) {
      loadStores()
    }
  }, [user])

  if (isLoadingStores) {
    return (
      <Card className="border-white/10 bg-card text-card-foreground/50">
        <CardHeader>
          <CardTitle className="text-foreground">Shopify Store Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 loading-skeleton rounded-lg" />
            <div className="h-32 loading-skeleton rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Store Connection Section */}
      <Card className="border-white/10 bg-card text-card-foreground/50 hover-lift transition-all duration-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Package className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-foreground">Shopify Store Connection</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connect your Shopify store to analyze products and policies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Error Alert */}
          {connectionError && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">{connectionError}</AlertDescription>
            </Alert>
          )}

          {stores.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-75" />
              <p className="text-muted-foreground mb-2 font-medium">No Stores Connected</p>
              <p className="text-sm text-muted-foreground mb-6">Connect your first Shopify store to get started</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="hover-lift transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Store
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card text-card-foreground border-white/10 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Connect Shopify Store</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Enter your Shopify store credentials to connect
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleConnectStore} className="space-y-4">
                    <div>
                      <Label htmlFor="shop_domain" className="text-foreground font-medium">Shop Domain</Label>
                      <Input
                        id="shop_domain"
                        type="text"
                        placeholder="your-store.myshopify.com"
                        value={formData.shop_domain}
                        onChange={(e) => setFormData(prev => ({ ...prev, shop_domain: e.target.value }))}
                        className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="api_key" className="text-foreground font-medium">API Key</Label>
                      <Input
                        id="api_key"
                        type="password"
                        placeholder="Your Shopify API Key"
                        value={formData.api_key}
                        onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                        className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="api_secret" className="text-foreground font-medium">API Secret</Label>
                      <Input
                        id="api_secret"
                        type="password"
                        placeholder="Your Shopify API Secret"
                        value={formData.api_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, api_secret: e.target.value }))}
                        className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="access_token" className="text-foreground font-medium">Access Token</Label>
                      <Input
                        id="access_token"
                        type="password"
                        placeholder="Your Shopify Access Token"
                        value={formData.access_token}
                        onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                        className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={isConnecting} className="flex-1 hover-lift transition-all duration-200">
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect Store'
                        )}
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-white/5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold">{selectedStore?.shop_domain}</h3>
                      <p className="text-sm text-muted-foreground">Connected • {stores.length} store{stores.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => selectedStore && syncStoreData(selectedStore.id)}
                      disabled={isSyncing}
                      className="hover-lift transition-all duration-200"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Sync Data
                        </>
                      )}
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="hover-lift transition-all duration-200">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Store
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card text-card-foreground border-white/10 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Connect Another Shopify Store</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Enter your Shopify store credentials to connect
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleConnectStore} className="space-y-4">
                          <div>
                            <Label htmlFor="shop_domain" className="text-foreground font-medium">Shop Domain</Label>
                            <Input
                              id="shop_domain"
                              type="text"
                              placeholder="your-store.myshopify.com"
                              value={formData.shop_domain}
                              onChange={(e) => setFormData(prev => ({ ...prev, shop_domain: e.target.value }))}
                              className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="api_key" className="text-foreground font-medium">API Key</Label>
                            <Input
                              id="api_key"
                              type="password"
                              placeholder="Your Shopify API Key"
                              value={formData.api_key}
                              onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                              className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="api_secret" className="text-foreground font-medium">API Secret</Label>
                            <Input
                              id="api_secret"
                              type="password"
                              placeholder="Your Shopify API Secret"
                              value={formData.api_secret}
                              onChange={(e) => setFormData(prev => ({ ...prev, api_secret: e.target.value }))}
                              className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="access_token" className="text-foreground font-medium">Access Token</Label>
                            <Input
                              id="access_token"
                              type="password"
                              placeholder="Your Shopify Access Token"
                              value={formData.access_token}
                              onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                              className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground mt-1.5"
                              required
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={isConnecting} className="flex-1 hover-lift transition-all duration-200">
                              {isConnecting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                'Connect Store'
                              )}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Display */}
      {products.length > 0 && (
        <Card className="border-white/10 bg-card text-card-foreground/50 hover-lift transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-foreground">Store Products</CardTitle>
            <CardDescription className="text-muted-foreground">
              {products.length} products fetched from your connected Shopify store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, index) => (
                <div 
                  key={product.id} 
                  className="border border-white/5 rounded-lg p-4 bg-muted/50 hover:bg-accent hover:text-accent-foreground/80 hover:border-white/10 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground text-sm line-clamp-2 flex-1">{product.title}</h4>
                    <Badge 
                      variant={product.status === 'active' ? 'default' : 'secondary'} 
                      className="text-xs whitespace-nowrap ml-2"
                    >
                      {product.status}
                    </Badge>
                  </div>
                  {product.vendor && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.vendor}</p>
                  )}
                  {product.product_type && (
                    <p className="text-xs text-muted-foreground mb-3">{product.product_type}</p>
                  )}
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {products.length > 6 && (
              <div className="text-center mt-6">
                <Button variant="secondary" size="sm" className="hover-lift transition-all duration-200">
                  View All Products ({products.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
