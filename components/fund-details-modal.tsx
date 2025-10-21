'use client'

import { FundWithRelations } from '@/lib/types/database'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Globe, 
  Linkedin, 
  ExternalLink,
  Target,
  Users,
  FileText,
  X
} from 'lucide-react'

interface FundDetailsModalProps {
  fund: FundWithRelations
  isOpen: boolean
  onClose: () => void
}

export function FundDetailsModal({ fund, isOpen, onClose }: FundDetailsModalProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Building className="h-6 w-6" />
              {fund.f_name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1">{fund.f_description || 'No description available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Domain</label>
                  <p className="mt-1">{fund.f_domain || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Minimum Investment</label>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(fund.f_first_cheque_minimum)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Maximum Investment</label>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(fund.f_first_cheque_maximum)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-lg font-semibold">{formatDate(fund.f_created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {fund.stages && fund.stages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fund.stages.map((stage) => (
                    <Badge key={stage.s_id} variant="secondary">
                      {stage.s_name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fund.themes && fund.themes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Investment Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fund.themes.map((theme) => (
                    <Badge key={theme.ggt_id} variant="outline">
                      {theme.ggt_name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}