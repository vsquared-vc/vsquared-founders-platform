'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface IntroEmailButtonProps {
  fundName: string
  fundId: string
}

export function IntroEmailButton({ fundId }: IntroEmailButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showNameInputModal, setShowNameInputModal] = useState(false)
  const [userFirstNameInput, setUserFirstNameInput] = useState('')
  const [userLastNameInput, setUserLastNameInput] = useState('')

  const checkUserNames = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to send introduction emails')
      return null
    }

    const { data: eUserData, error: eUserError } = await supabase
      .from('e_user')
      .select('u_first_name, u_last_name')
      .eq('u_lu_auth_user', user.id)
      .single()

    if (eUserError || !eUserData) {
      console.error('Error fetching e_user data:', eUserError)
      alert('Could not retrieve your user profile. Please try again.')
      return null
    }

    if (!eUserData.u_first_name || !eUserData.u_last_name) {
      setUserFirstNameInput(eUserData.u_first_name || '')
      setUserLastNameInput(eUserData.u_last_name || '')
      setShowNameInputModal(true)
      return null // Stop here, wait for user input
    }
    return eUserData
  }

  const handleSaveNames = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      alert('Authentication error. Please log in again.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('e_user')
      .update({ u_first_name: userFirstNameInput, u_last_name: userLastNameInput })
      .eq('u_lu_auth_user', user.id)

    if (error) {
      console.error('Error updating user names:', error)
      alert('Failed to save your names. Please try again.')
    } else {
      setShowNameInputModal(false)
      // Re-attempt to create email after names are saved
      createIntroEmail()
    }
    setLoading(false)
  }

  const createIntroEmail = async () => {
    setLoading(true)
    
    try {
      // Check if user has first and last name
      const eUserData = await checkUserNames()
      if (!eUserData) {
        setLoading(false)
        return // User needs to input names or is not logged in
      }

      // Get current user's portfolio company and team member info
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to send introduction emails')
        return
      }

      // Get user's portfolio company info
      const { data: userData, error: userError } = await supabase
        .from('e_user')
        .select(`
          u_lu_pc,
          e_portfolio_company:u_lu_pc (
            pc_name,
            pc_domain,
            pc_lu_t,
            e_team:pc_lu_t (
              t_first_name,
              t_name,
              t_email
            )
          )
        `)
        .eq('u_lu_auth_user', user.id)
        .single()

      if (userError || !userData?.u_lu_pc) {
        alert('No portfolio company associated with your account')
        return
      }

      const portfolioCompany = userData.e_portfolio_company
      if (!portfolioCompany) {
        alert('Portfolio company information not found')
        return
      }

      // Get fund details with contact information
      const { data: fundData, error: fundError } = await supabase
        .from('e_fund')
        .select(`
          f_name,
          f_description,
          f_domain,
          f_lu_t,
          e_team:f_lu_t (
            t_first_name,
            t_name,
            t_email
          )
        `)
        .eq('f_id', fundId)
        .single()

      if (fundError || !fundData) {
        alert('Fund information not found')
        return
      }

      // Create email draft
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pcContactFirstName = (portfolioCompany as any).e_team?.t_first_name || 'Team Member'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const teamMemberEmail = (portfolioCompany as any).e_team?.t_email || ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fundContactFirstName = (fundData as any).e_team?.t_first_name || 'Fund Representative'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pcName = (portfolioCompany as any).pc_name || 'Our Portfolio Company'
      const userFirstName = eUserData.u_first_name || 'User'

      const subject = `Introduction Request: ${pcName} ↔ ${fundData.f_name}`

      const emailBody = `Hi ${pcContactFirstName},

I hope this email finds you well. I am writing to request an introduction between ${pcName} and ${fundData.f_name}.

We would like to introduce our portfolio company to this fund for potential investment opportunities. The fund appears to be a good fit based on their investment focus and stage preferences.

Contact: ${fundContactFirstName}

Thank you for your time and assistance.

Best regards,
${userFirstName}

---
This email was generated from the Vsquared Ventures Founders Platform.`

      // Create mailto link
      const mailtoLink = `mailto:${teamMemberEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
      
      // Open email client
      window.open(mailtoLink, '_blank')
      
    } catch (error) {
      console.error('Error creating intro email:', error)
      alert('Error creating introduction email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={createIntroEmail}
        disabled={loading}
        className="flex items-center gap-2"
        variant="outline"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        {loading ? 'Preparing Email...' : 'Request Introduction'}
      </Button>

      <Dialog open={showNameInputModal} onOpenChange={setShowNameInputModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please provide your first and last name to personalize the introduction email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={userFirstNameInput}
                onChange={(e) => setUserFirstNameInput(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={userLastNameInput}
                onChange={(e) => setUserLastNameInput(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNames} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Save Names & Continue'
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setShowNameInputModal(false)}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
