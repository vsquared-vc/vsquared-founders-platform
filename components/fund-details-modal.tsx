'use client'

import { FundWithRelations } from '@/lib/types/database'
import { Dialog, DialogPortal, DialogOverlay, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntroEmailButton } from '@/components/intro-email-button'
import { 
  Building, 
  DollarSign, 
  Target,
  Users,
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


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-y-auto modal-scrollbar"
          )}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <Building className="h-6 w-6" />
                {fund.f_domain ? (
                  <a 
                    href={`https://${fund.f_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    {fund.f_name}
                  </a>
                ) : (
                  fund.f_name
                )}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <IntroEmailButton 
                  fundName={fund.f_name} 
                  fundId={fund.f_id} 
                />
                <DialogClose asChild>
                  <button 
                    className="h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm leading-relaxed">{fund.f_description || 'No description available'}</p>
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
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Investment Range:</span>
                  <span className="font-semibold">
                    {formatCurrency(fund.f_first_cheque_minimum)} - {formatCurrency(fund.f_first_cheque_maximum)}
                  </span>
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
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}