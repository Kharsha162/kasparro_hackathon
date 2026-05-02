'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Link2, Store, User, Zap } from 'lucide-react'

export default function SettingsPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('Connected')

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncStatus('Syncing...')
    // Mock the sync latency
    await new Promise(r => setTimeout(r, 2000))
    setSyncStatus('Connected')
    setIsSyncing(false)
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground">Manage your connected stores, profiles, and AI simulation preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shopify Integration */}
        <Card className="border-white/10 bg-card text-card-foreground/50 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Store className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-foreground">Shopify Integration</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground mt-2">
              Your live catalog data feeds into the AI Reality Engine from here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Connected Store URL</Label>
              <Input disabled defaultValue="myshopify.store.com" className="bg-muted border-border text-muted-foreground" />
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded-lg border border-border">
              <span className="text-sm font-medium text-muted-foreground">Connection Status</span>
              {syncStatus === 'Connected' ? (
                <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                  <CheckCircle className="w-3 h-3 mr-1" /> Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-border animate-pulse">
                  Syncing
                </Badge>
              )}
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/5 pt-6">
            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="w-full bg-muted hover:bg-accent hover:text-accent-foreground text-foreground"
            >
              {isSyncing ? 'Synchronizing Catalog...' : 'Force Manual Sync'}
            </Button>
          </div>
        </Card>

        {/* AI Engine Preferences */}
        <Card className="border-white/10 bg-card text-card-foreground/50 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-foreground">AI Engine Preferences</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground mt-2">
              Configure how the Shadow Shopper evaluates your product listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="space-y-3">
              <Label className="text-muted-foreground block">Active Persona Loadout</Label>
              <div className="grid grid-cols-2 gap-2">
                <Badge className="py-1.5 justify-center bg-blue-600 hover:bg-blue-700 text-foreground cursor-help">Skeptical Shopper</Badge>
                <Badge className="py-1.5 justify-center bg-blue-600 hover:bg-blue-700 text-foreground cursor-help">Bargain Hunter</Badge>
                <Badge className="py-1.5 justify-center bg-blue-600 hover:bg-blue-700 text-foreground cursor-help">Premium Buyer</Badge>
                <Badge className="py-1.5 justify-center bg-slate-700 hover:bg-slate-600 text-muted-foreground cursor-not-allowed">+ Add Persona</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Analysis Depth</Label>
              <Input disabled defaultValue="Comprehensive (Includes UX/UI friction)" className="bg-muted border-border text-muted-foreground" />
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/5 pt-6">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-foreground">
              Upgrade to Pro for Custom Personas
            </Button>
          </div>
        </Card>

        {/* Profile Settings */}
        <Card className="border-white/10 bg-card text-card-foreground/50 md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-foreground">Account Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Name</Label>
                <Input defaultValue="System Admin" className="bg-muted border-border text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email Address</Label>
                <Input defaultValue="admin@kasparro.com" className="bg-muted border-border text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Current Plan</Label>
                <Input disabled defaultValue="Professional Plan" className="bg-muted border-border text-muted-foreground" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => alert("Profile mock-saved successfully!")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
