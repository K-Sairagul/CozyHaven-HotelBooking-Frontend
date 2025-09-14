import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'

const PaymentHistory = () => {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          'https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/payment/history',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        const paymentData = Array.isArray(response.data)
          ? response.data.map((payment) => ({
              ...payment,
              paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : null,
            }))
          : []

        setPayments(paymentData)
        setFilteredPayments(paymentData)
      } catch (error) {
        console.error('Error fetching payments:', error)
        setError('Failed to load payment history')
        setPayments([])
        setFilteredPayments([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  useEffect(() => {
    const applyFilters = () => {
      let results = [...payments]

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        results = results.filter(
          (payment) =>
            payment.hotelName?.toLowerCase()?.includes(term) ||
            payment.roomId?.toString()?.includes(term) ||
            payment.paymentId?.toString()?.includes(term)
        )
      }

      if (statusFilter !== 'all') {
        results = results.filter(
          (payment) => payment.paymentStatus?.toLowerCase() === statusFilter.toLowerCase()
        )
      }

      if (dateRange.start || dateRange.end) {
        const startDate = dateRange.start ? new Date(dateRange.start) : null
        const endDate = dateRange.end ? new Date(dateRange.end) : null
        if (endDate) {
          endDate.setHours(23, 59, 59, 999)
        }
        results = results.filter((payment) => {
          if (!payment.paymentDate) return false
          const paymentDate = payment.paymentDate
          if (startDate && endDate) {
            return paymentDate >= startDate && paymentDate <= endDate
          } else if (startDate) {
            return paymentDate >= startDate
          } else if (endDate) {
            return paymentDate <= endDate
          }
          return true
        })
      }

      setFilteredPayments(results)
    }

    applyFilters()
  }, [payments, searchTerm, statusFilter, dateRange])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
  }

  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({ ...prev, start: e.target.value }))
  }

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({ ...prev, end: e.target.value }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateRange({ start: '', end: '' })
  }

  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'refunded':
        return 'bg-orange-100 text-orange-800'
      case 'refundpending':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all payment transactions</p>
        </header>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by hotel, room ID or payment ID"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search payments"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>

            {/* Filters Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={isFilterOpen}
                aria-controls="filter-panel"
              >
                <FunnelIcon className="mr-2 h-5 w-5 text-gray-500" />
                Filters
                {isFilterOpen ? (
                  <ChevronUpIcon className="ml-2 h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-500" />
                )}
              </button>

              {/* Filter Panel */}
              {isFilterOpen && (
                <div
                  id="filter-panel"
                  className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Payment Status
                      </label>
                      <select
                        id="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={statusFilter}
                        onChange={handleStatusChange}
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                        <option value="refundpending">Refund Pending</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          From Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={dateRange.start}
                          onChange={handleStartDateChange}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          To Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={dateRange.end}
                          onChange={handleEndDateChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear all filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                    aria-label="Clear search filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                    aria-label="Clear status filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {dateRange.start && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  From: {new Date(dateRange.start).toLocaleDateString()}
                  <button
                    onClick={() => setDateRange((prev) => ({ ...prev, start: '' }))}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                    aria-label="Clear start date filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {dateRange.end && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  To: {new Date(dateRange.end).toLocaleDateString()}
                  <button
                    onClick={() => setDateRange((prev) => ({ ...prev, end: '' }))}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                    aria-label="Clear end date filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Payment Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hotel
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{payment.paymentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.hotelName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.roomId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${payment.amountPaid ? payment.amountPaid.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            payment.paymentStatus
                          )}`}
                        >
                          {payment.paymentStatus || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {payments.length === 0
                        ? 'No payment history available'
                        : 'No payments match your filters'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory
