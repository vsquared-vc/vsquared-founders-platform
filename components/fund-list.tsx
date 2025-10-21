'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Stage, FundWithRelations } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Calendar, DollarSign, Building } from 'lucide-react'

interface Filters {
  search: string
  investmentRange: string
  stageId: string
  startDate: string
  endDate: string
}

export function FundList() {
  const [funds, setFunds] = useState<FundWithRelations[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [filteredFunds, setFilteredFunds] = useState<FundWithRelations[]>([])
  const [filters, setFilters] = useState<Filters>({
    search: '',
    investmentRange: '',
    stageId: '',
    startDate: '',
    endDate: ''
  })
  const [selectedFund, setSelectedFund] = useState<FundWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchFunds()
    fetchStages()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [funds, filters])

  const fetchFunds = async () => {
    try {
      setLoading(true)
      
      // First, fetch basic fund data
      console.log('Fetching funds from e_fund table...')
      const { data: fundsData, error: fundsError } = await supabase
        .from('e_fund')
        .select('*')
      
      console.log('Funds query result:', { fundsData, fundsError })

      if (fundsError) throw fundsError

      // Fetch investor types and investment focuses separately
      const { data: investorTypes } = await supabase
        .from('e_investor_type')
        .select('*')

      const { data: investmentFocuses } = await supabase
        .from('e_investment_fokus')
        .select('*')

      // Create lookup maps
      const investorTypeMap = new Map(investorTypes?.map(it => [it.it_id, it]) || [])
      const investmentFocusMap = new Map(investmentFocuses?.map(if_ => [if_.if_id, if_]) || [])

      // Fetch stages and themes for each fund
      const fundsWithStages = await Promise.all(
        fundsData.map(async (fund) => {
          const { data: stageData } = await supabase
            .from('e_f_lu_s')
            .select('e_stage:s_id(*)')
            .eq('fls_fund_id', fund.f_id)

          const { data: themeData } = await supabase
            .from('e_f_lu_g')
            .select('e_ggt:ggt_id(*)')
            .eq('flg_fund_id', fund.f_id)

          return {
            ...fund,
            stages: stageData?.map(s => s.e_stage).filter(Boolean) || [],
            themes: themeData?.map(t => t.e_ggt).filter(Boolean) || [],
            investor_type: fund.f_it_id ? investorTypeMap.get(fund.f_it_id) : null,
            investment_focus: fund.f_if_id ? investmentFocusMap.get(fund.f_if_id) : null
          }
        })
      )

      setFunds(fundsWithStages)
    } catch (error) {
      console.error('Error fetching funds:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from('e_stage')
        .select('*')
        .order('s_name')

      if (error) throw error
      setStages(data || [])
    } catch (error) {
      console.error('Error fetching stages:', error)
      console.error('Stages error details:', JSON.stringify(error, null, 2))
    }
  }

  const applyFilters = () => {
    let filtered = [...funds]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(fund =>
        fund.f_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Investment amount filter based on maximum amount
    if (filters.investmentRange) {
      filtered = filtered.filter(fund => {
        if (!fund.f_first_cheque_maximum) return false
        
        const maxAmount = fund.f_first_cheque_maximum
        
        switch (filters.investmentRange) {
          case 'under-1m':
            return maxAmount < 1000000
          case '1m-3m':
            return maxAmount >= 1000000 && maxAmount < 3000000
          case '3m-5m':
            return maxAmount >= 3000000 && maxAmount < 5000000
          case '5m-10m':
            return maxAmount >= 5000000 && maxAmount < 10000000
          case '10m-20m':
            return maxAmount >= 10000000 && maxAmount < 20000000
          case 'over-20m':
            return maxAmount >= 20000000
          default:
            return true
        }
      })
    }

    // Stage filter
    if (filters.stageId) {
      filtered = filtered.filter(fund =>
        fund.stages?.some(stage => stage.s_id === filters.stageId)
      )
    }

    // Date filters
    if (filters.startDate) {
      filtered = filtered.filter(fund =>
        fund.f_created_at && new Date(fund.f_created_at) >= new Date(filters.startDate)
      )
    }

    if (filters.endDate) {
      filtered = filtered.filter(fund =>
        fund.f_created_at && new Date(fund.f_created_at) <= new Date(filters.endDate)
      )
    }

    setFilteredFunds(filtered)
  }

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
    return new Date(date).toLocaleDateString()
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      investmentRange: '',
      stageId: '',
      startDate: '',
      endDate: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading funds...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fund Portfolio</h1>
          <p className="text-muted-foreground">Find and filter your portfolio companies</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredFunds.length} of {funds.length} funds
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Investment Amount Range</label>
              <Select value={filters.investmentRange || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, investmentRange: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Investment Ranges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Investment Ranges</SelectItem>
                  <SelectItem value="under-1m">&lt; 1M</SelectItem>
                  <SelectItem value="1m-3m">1M - 3M</SelectItem>
                  <SelectItem value="3m-5m">3M - 5M</SelectItem>
                  <SelectItem value="5m-10m">5M - 10M</SelectItem>
                  <SelectItem value="10m-20m">10M - 20M</SelectItem>
                  <SelectItem value="over-20m">&gt; 20M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Stage</label>
              <Select value={filters.stageId || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, stageId: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.s_id} value={stage.s_id}>
                      {stage.s_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Creation Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFunds.map((fund) => (
          <Card 
            key={fund.f_id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedFund(fund)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {fund.f_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Investment Range:</span>
                <span className="font-medium">
                  {formatCurrency(fund.f_first_cheque_minimum)} - {formatCurrency(fund.f_first_cheque_maximum)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{formatDate(fund.f_created_at)}</span>
              </div>

              {fund.stages && fund.stages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Stages:</span>
                  <div className="flex flex-wrap gap-1">
                    {fund.stages.map((stage) => (
                      <Badge key={stage.s_id} variant="secondary">
                        {stage.s_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {fund.themes && fund.themes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Themes:</span>
                  <div className="flex flex-wrap gap-1">
                    {fund.themes.map((theme) => (
                      <Badge key={theme.ggt_id} variant="outline">
                        {theme.ggt_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFunds.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No funds found matching your criteria.</p>
        </div>
      )}

      {/* Fund Details Modal */}
      {selectedFund && (
        <FundDetailsModal
          fund={selectedFund}
          isOpen={!!selectedFund}
          onClose={() => setSelectedFund(null)}
        />
      )}
    </div>
  )
}
