
import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { currencies } from '../utils/currencies';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { toast } = useToast();

  const fetchExchangeRate = async () => {
    if (!fromCurrency || !toCurrency) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      const rate = data.rates[toCurrency];
      
      if (!rate) {
        throw new Error('Currency not supported');
      }
      
      setExchangeRate(rate);
      setLastUpdated(new Date());
      
      // Calculate converted amount
      const converted = (parseFloat(amount) * rate).toFixed(4);
      setConvertedAmount(converted);
      
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    if (exchangeRate && value) {
      const converted = (parseFloat(value) * exchangeRate).toFixed(4);
      setConvertedAmount(converted);
    }
  };

  const formatCurrency = (value, currencyCode) => {
    if (!value || isNaN(value)) return '0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate && amount) {
      const converted = (parseFloat(amount) * exchangeRate).toFixed(4);
      setConvertedAmount(converted);
    }
  }, [amount, exchangeRate]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Input Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <span className="text-3xl">💱</span>
                Currency Converter
              </CardTitle>
              {lastUpdated && (
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg h-14 border-2 focus:border-blue-400 hover:border-blue-300 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="h-14 border-2 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-gray-500">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapCurrencies}
                    className="h-14 w-14 rounded-full border-2 hover:bg-blue-50 hover:border-blue-400 hover:scale-110 transition-all duration-200 shadow-lg"
                    disabled={loading}
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">To</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="h-14 border-2 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-gray-500">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exchange Rate Display */}
              {exchangeRate && (
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200 hover:bg-blue-100 transition-colors">
                  <p className="text-sm text-gray-600 mb-1">Current Exchange Rate</p>
                  <p className="text-lg font-semibold text-blue-800">
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </p>
                </div>
              )}

              {/* Refresh Button */}
              <div className="text-center">
                <Button
                  onClick={fetchExchangeRate}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Updating...' : 'Refresh Rates'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Result Display */}
        <div className="lg:col-span-1">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm h-full hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-green-800 flex items-center justify-center gap-2">
                <span className="text-2xl">💰</span>
                Converted Amount
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col justify-center h-full space-y-6">
              {/* Main Result */}
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-green-700 mb-4 hover:scale-105 transition-transform">
                  {formatCurrency(convertedAmount, toCurrency)}
                </div>
                <div className="bg-white/60 rounded-lg p-4 border border-green-200">
                  <p className="text-gray-700 font-medium">
                    {formatCurrency(amount, fromCurrency)}
                  </p>
                  <p className="text-gray-500 text-sm">equals</p>
                  <p className="text-green-700 font-semibold text-lg">
                    {formatCurrency(convertedAmount, toCurrency)}
                  </p>
                </div>
              </div>

              {/* Currency Flags Display */}
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {currencies.find(c => c.code === fromCurrency)?.flag}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{fromCurrency}</p>
                </div>
                <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {currencies.find(c => c.code === toCurrency)?.flag}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{toCurrency}</p>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center">
                  <div className="animate-pulse flex items-center gap-2 text-green-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Updating rates...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
