export type Signal = {
  id: number;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  status: 'Active' | 'Expired';
};

export const signals: Signal[] = [
  { id: 1, pair: 'EUR/USD', action: 'BUY', entry: 1.0750, stopLoss: 1.0700, takeProfit1: 1.0800, takeProfit2: 1.0850, status: 'Active' },
  { id: 2, pair: 'GBP/JPY', action: 'SELL', entry: 201.50, stopLoss: 202.20, takeProfit1: 200.50, takeProfit2: 199.80, status: 'Active' },
  { id: 3, pair: 'AUD/USD', action: 'BUY', entry: 0.6620, stopLoss: 0.6580, takeProfit1: 0.6670, takeProfit2: 0.6700, status: 'Active' },
  { id: 4, pair: 'USD/CAD', action: 'SELL', entry: 1.3700, stopLoss: 1.3750, takeProfit1: 1.3620, takeProfit2: 1.3580, status: 'Expired' },
  { id: 5, pair: 'XAU/USD', action: 'BUY', entry: 2350.00, stopLoss: 2340.00, takeProfit1: 2365.00, takeProfit2: 2375.00, status: 'Expired' },
  { id: 6, pair: 'NZD/USD', action: 'SELL', entry: 0.6150, stopLoss: 0.6190, takeProfit1: 0.6100, takeProfit2: 0.6070, status: 'Expired' },
];

export type CalendarEvent = {
  id: number;
  time: string;
  currency: string;
  impact: 'High' | 'Medium' | 'Low';
  event: string;
  actual: string;
  forecast: string;
  previous: string;
};

export const calendarEvents: CalendarEvent[] = [
    { id: 1, time: '08:30', currency: 'USD', impact: 'High', event: 'Non-Farm Employment Change', actual: '272K', forecast: '182K', previous: '165K' },
    { id: 2, time: '10:00', currency: 'CAD', impact: 'Medium', event: 'Ivey PMI', actual: '52.0', forecast: '65.2', previous: '63.0' },
    { id: 3, time: '13:00', currency: 'USD', impact: 'Low', event: 'Final Wholesale Inventories m/m', actual: '0.1%', forecast: '0.2%', previous: '0.2%' },
    { id: 4, time: '19:30', currency: 'CNY', impact: 'High', event: 'CPI y/y', actual: '0.3%', forecast: '0.4%', previous: '0.3%' },
    { id: 5, time: '21:45', currency: 'NZD', impact: 'Medium', event: 'Visitor Arrivals m/m', actual: '-1.5%', forecast: '', previous: '1.2%' },
    { id: 6, time: 'All Day', currency: 'CHF', impact: 'Low', event: 'Bank Holiday', actual: '', forecast: '', previous: '' },
];
