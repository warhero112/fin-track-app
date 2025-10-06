'use client'

import { useState, useEffect } from 'react'
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react'

interface MortgageCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  loanAmount: number
  downPayment: number
  propertyValue: number
}

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState(50000000) // 50 million yen
  const [downPayment, setDownPayment] = useState(10000000) // 10 million yen
  const [interestRate, setInterestRate] = useState(1.5) // 1.5% annual
  const [loanTerm, setLoanTerm] = useState(30) // 30 years
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null)

  useEffect(() => {
    calculateMortgage()
  }, [propertyValue, downPayment, interestRate, loanTerm])

  const calculateMortgage = () => {
    const loanAmount = propertyValue - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (monthlyRate === 0) {
      // Handle zero interest rate
      const monthlyPayment = loanAmount / numberOfPayments
      setCalculation({
        monthlyPayment,
        totalPayment: loanAmount,
        totalInterest: 0,
        loanAmount,
        downPayment,
        propertyValue
      })
    } else {
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      const totalPayment = monthlyPayment * numberOfPayments
      const totalInterest = totalPayment - loanAmount

      setCalculation({
        monthlyPayment,
        totalPayment,
        totalInterest,
        loanAmount,
        downPayment,
        propertyValue
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${(amount / 10000).toLocaleString()}万`
  }

  const formatMonthlyPayment = (amount: number) => {
    return `¥${Math.round(amount).toLocaleString()}/月`
  }

  const downPaymentPercentage = (downPayment / propertyValue) * 100

  return (
    <div className="card p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-primary-600" />
        <h3 className="text-2xl font-semibold text-gray-900">Mortgage Calculator</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Property Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Property Value
            </label>
            <div className="relative">
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(parseInt(e.target.value) || 0)}
                className="input-field pr-16"
                placeholder="50000000"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                円
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {formatCurrency(propertyValue)}
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <div className="relative">
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                className="input-field pr-16"
                placeholder="10000000"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                円
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {formatCurrency(downPayment)} ({downPaymentPercentage.toFixed(1)}%)
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Percent className="w-4 h-4 inline mr-1" />
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="input-field pr-8"
                placeholder="1.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                %
              </span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Loan Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={10}>10 years</option>
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
              <option value={35}>35 years</option>
            </select>
          </div>

          {/* Loan Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Loan Amount</div>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(propertyValue - downPayment)}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Monthly Payment */}
              <div className="bg-primary-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">Monthly Payment</span>
                </div>
                <div className="text-3xl font-bold text-primary-600">
                  {formatMonthlyPayment(calculation.monthlyPayment)}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Breakdown</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Payment</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(calculation.totalPayment)}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(calculation.totalInterest)}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Interest as % of Total</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {((calculation.totalInterest / calculation.totalPayment) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Affordability Check */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Affordability Guidelines</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• Monthly payment should not exceed 30% of gross income</div>
                  <div>• Total debt payments should not exceed 40% of gross income</div>
                  <div>• Consider additional costs: insurance, taxes, maintenance</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Get Pre-approved
                </button>
                <button className="w-full btn-secondary">
                  Contact Mortgage Specialist
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Important Notes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">For Foreigners in Japan</h5>
            <ul className="space-y-1">
              <li>• Most banks require 20% down payment</li>
              <li>• Permanent residence or long-term visa required</li>
              <li>• Stable income in Japan for 2+ years</li>
              <li>• Japanese language proficiency may be required</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Additional Costs</h5>
            <ul className="space-y-1">
              <li>• Property tax: ~1.4% annually</li>
              <li>• Home insurance: ¥50,000-100,000/year</li>
              <li>• Maintenance: 1-2% of property value/year</li>
              <li>• Registration and legal fees: 2-3%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}