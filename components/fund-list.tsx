'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Stage, Theme, FundWithRelations } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, DollarSign, Building } from 'lucide-react'
import { FundDetailsModal } from './fund-details-modal'

interface Filters {
  search: string
  investmentRanges: string[]
  stageIds: string[]
  themeIds: string[]
}

export function FundList() {
  const [allFunds, setAllFunds] = useState<FundWithRelations[]>([])
  const [displayedFunds, setDisplayedFunds] = useState<FundWithRelations[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [filteredFunds, setFilteredFunds] = useState<FundWithRelations[]>([])
  const [filters, setFilters] = useState<Filters>({
    search: '',
    investmentRanges: [],
    stageIds: [],
    themeIds: []
  })
  const [selectedFund, setSelectedFund] = useState<FundWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const ITEMS_PER_PAGE = 50

  const supabase = createClient()

  useEffect(() => {
    fetchFunds()
    fetchStages()
    fetchThemes()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [allFunds, filters])


  const fetchFunds = async () => {
    try {
      setLoading(true)
      
      // First, fetch basic fund data - only VCs
      console.log('Fetching VC funds from e_fund table...')
      const { data: fundsData, error: fundsError } = await supabase
        .from('e_fund')
        .select('*')
        .eq('f_it_id', 'f5a5da00-c005-4d55-a4b5-8144b8910f80') // VC investor type ID
      
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
            .select(`
              *,
              e_stage:fls_stage_id(*)
            `)
            .eq('fls_fund_id', fund.f_id)

          const { data: themeData } = await supabase
            .from('e_f_lu_g')
            .select(`
              *,
              e_ggt:flg_ggt_id(*)
            `)
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

      setAllFunds(fundsWithStages)
      // Initially display only the first 50 funds
      setDisplayedFunds(fundsWithStages.slice(0, ITEMS_PER_PAGE))
      setHasMore(fundsWithStages.length > ITEMS_PER_PAGE)
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

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('e_ggt')
        .select('*')
        .order('ggt_name')

      if (error) throw error
      setThemes(data || [])
    } catch (error) {
      console.error('Error fetching themes:', error)
      console.error('Themes error details:', JSON.stringify(error, null, 2))
    }
  }

  const applyFilters = () => {
    // Apply filters to ALL funds, not just displayed ones
    let filtered = [...allFunds]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(fund =>
        fund.f_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Investment amount filter based on maximum amount
    if (filters.investmentRanges.length > 0) {
      filtered = filtered.filter(fund => {
        if (!fund.f_first_cheque_maximum) return false
        
        const maxAmount = fund.f_first_cheque_maximum
        
        return filters.investmentRanges.some(range => {
          switch (range) {
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
              return false
          }
        })
      })
    }

    // Stage filter
    if (filters.stageIds.length > 0) {
      filtered = filtered.filter(fund =>
        fund.stages?.some(stage => filters.stageIds.includes(stage.s_id))
      )
    }

    // Theme filter
    if (filters.themeIds.length > 0) {
      filtered = filtered.filter(fund =>
        fund.themes?.some(theme => filters.themeIds.includes(theme.ggt_id))
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
      investmentRanges: [],
      stageIds: [],
      themeIds: []
    })
  }

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value]
  }

  const handleInvestmentRangeToggle = (range: string) => {
    setFilters(prev => ({
      ...prev,
      investmentRanges: toggleArrayFilter(prev.investmentRanges, range)
    }))
  }

  const handleStageToggle = (stageId: string) => {
    setFilters(prev => ({
      ...prev,
      stageIds: toggleArrayFilter(prev.stageIds, stageId)
    }))
  }

  const handleThemeToggle = (themeId: string) => {
    setFilters(prev => ({
      ...prev,
      themeIds: toggleArrayFilter(prev.themeIds, themeId)
    }))
  }

  const loadMoreFunds = () => {
    console.log('loadMoreFunds called', { loadingMore, hasMore, currentPage, allFundsLength: allFunds.length })
    
    if (loadingMore || !hasMore) {
      console.log('Skipping load more - loadingMore:', loadingMore, 'hasMore:', hasMore)
      return
    }
    
    setLoadingMore(true)
    const nextPage = currentPage + 1
    const startIndex = nextPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newFunds = allFunds.slice(startIndex, endIndex)
    
    console.log('Loading more funds', { nextPage, startIndex, endIndex, newFundsCount: newFunds.length })
    
    setDisplayedFunds(prev => {
      const updated = [...prev, ...newFunds]
      console.log('Updated displayed funds count:', updated.length)
      return updated
    })
    setCurrentPage(nextPage)
    setHasMore(endIndex < allFunds.length)
    setLoadingMore(false)
  }

  // Scroll detection for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      
      // Load more when user is 1000px from bottom
      if (scrollTop + clientHeight >= scrollHeight - 1000) {
        console.log('Scroll detected - loading more funds', { 
          hasMore, 
          loadingMore, 
          currentPage, 
          totalFunds: allFunds.length,
          displayedFunds: displayedFunds.length 
        })
        loadMoreFunds()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore, currentPage, allFunds.length, displayedFunds.length])

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
    <div className="container mx-auto px-6 py-2 space-y-4">
      {/* Header */}
      <div style={{ marginTop: '16px' }}>
        <h1 className="text-3xl font-bold">VC Fund Portfolio</h1>
        <p className="text-muted-foreground">Find and filter venture capital funds</p>
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
                  placeholder="Search VC funds..."
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

          {/* Multi-Select Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Investment Amount Ranges */}
            <div>
              <label className="text-sm font-medium mb-2 block">Investment Amount Range</label>
              <Select onValueChange={(value) => {
                if (value === 'clear') {
                  setFilters(prev => ({ ...prev, investmentRanges: [] }))
                } else {
                  handleInvestmentRangeToggle(value)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ranges...">
                    {filters.investmentRanges.length > 0 
                      ? `${filters.investmentRanges.length} selected`
                      : "Select ranges..."
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear All</SelectItem>
                  {[
                    { value: 'under-1m', label: '< 1M' },
                    { value: '1m-3m', label: '1M - 3M' },
                    { value: '3m-5m', label: '3M - 5M' },
                    { value: '5m-10m', label: '5M - 10M' },
                    { value: '10m-20m', label: '10M - 20M' },
                    { value: 'over-20m', label: '> 20M' }
                  ].map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.investmentRanges.includes(range.value)}
                        />
                        <span>{range.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stages */}
            <div>
              <label className="text-sm font-medium mb-2 block">Investment Stages</label>
              <Select onValueChange={(value) => {
                if (value === 'clear') {
                  setFilters(prev => ({ ...prev, stageIds: [] }))
                } else {
                  handleStageToggle(value)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stages...">
                    {filters.stageIds.length > 0 
                      ? `${filters.stageIds.length} selected`
                      : "Select stages..."
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear All</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.s_id} value={stage.s_id}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.stageIds.includes(stage.s_id)}
                        />
                        <span>{stage.s_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Themes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Investment Themes</label>
              <Select onValueChange={(value) => {
                if (value === 'clear') {
                  setFilters(prev => ({ ...prev, themeIds: [] }))
                } else {
                  handleThemeToggle(value)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select themes...">
                    {filters.themeIds.length > 0 
                      ? `${filters.themeIds.length} selected`
                      : "Select themes..."
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear All</SelectItem>
                  {themes.map((theme) => (
                    <SelectItem key={theme.ggt_id} value={theme.ggt_id}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.themeIds.includes(theme.ggt_id)}
                        />
                        <span>{theme.ggt_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Load More Indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading more funds...</p>
          </div>
        </div>
      )}

      {/* Load More Button (fallback if scroll doesn't work) */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center py-4">
          <Button onClick={loadMoreFunds} variant="outline">
            Load More Funds
          </Button>
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
