'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DisclaimerModalProps {
  children: React.ReactNode
}

export function DisclaimerModal({ children }: DisclaimerModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-orange-800 dark:text-orange-200">DISCLAIMER</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-orange-700 dark:text-orange-300 space-y-4">
          <p>
            The content provided on this platform is intended solely for informational and general guidance purposes. All materials, including but not limited to articles, templates, recommendations, and shared resources, are made available for free use and do not constitute legal, financial, investment, or other professional advice.
          </p>
          <p>
            Nothing on this platform should be interpreted as a legally binding recommendation or commitment by Vsquared Ventures or any of its affiliates. Founders and users are encouraged to seek independent professional counsel tailored to their specific situation before making any decisions based on the information shared here.
          </p>
          <p>
            Use of this platform and its contents is at your own discretion and risk.
          </p>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
