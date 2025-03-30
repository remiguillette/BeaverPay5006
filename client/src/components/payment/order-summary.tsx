import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Sample order items (would be fetched from an API in production)
const orderItems: OrderItem[] = [
  {
    name: 'Produit exemple',
    quantity: 1,
    price: 89.99
  }
];

// Calculate subtotal
const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// Calculate tax (5%)
const tax = subtotal * 0.05;
// Calculate total
const total = subtotal + tax;

// Format price in CAD
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'symbol',
  }).format(price);
};

export const OrderSummary: FC = () => {
  return (
    <Card className="bg-[#242424]">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Résumé de la commande</h2>
        
        {/* Order items */}
        <div className="space-y-3 mb-4">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-700">
              <div>
                <p className="text-gray-300">{item.name}</p>
                <p className="text-xs text-gray-300 opacity-70">Quantité: {item.quantity}</p>
              </div>
              <p className="text-gray-300">{formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
        
        {/* Price breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Sous-total</span>
            <span className="text-gray-300">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">TPS/TVH (5%)</span>
            <span className="text-gray-300">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Livraison</span>
            <span className="text-gray-300">Gratuit</span>
          </div>
        </div>
        
        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-700">
          <span className="text-lg font-semibold text-primary">Total</span>
          <span className="text-lg font-semibold text-primary">{formatPrice(total)}</span>
        </div>
        
        {/* Return policy */}
        <div className="mt-6 p-3 bg-[#121212] rounded-md border border-gray-700">
          <p className="text-sm text-gray-300 flex items-start">
            <svg 
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>
              Questions sur votre commande? Consultez notre{' '}
              <a href="#" className="text-primary hover:underline">politique de retour</a> ou{' '}
              <a href="#" className="text-primary hover:underline">contactez-nous</a>.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
