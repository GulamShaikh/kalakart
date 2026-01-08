import { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Banknote, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  amount: number;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export function PaymentModal({ isOpen, onClose, onSuccess, amount }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePay = async () => {
    setStatus('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (simulateFailure) {
      setStatus('failed');
      return;
    }

    const transactionId = `TXN-DEMO-${Date.now()}`;
    setStatus('success');

    setTimeout(() => {
      onSuccess(transactionId);
    }, 1500);
  };

  const resetModal = () => {
    setStatus('idle');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setUpiId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={() => { onClose(); resetModal(); }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-t-2xl md:rounded-2xl shadow-elevated animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 gradient-hero p-4 rounded-t-2xl md:rounded-t-2xl">
          <button
            onClick={() => { onClose(); resetModal(); }}
            className="absolute right-4 top-4 text-primary-foreground/80 hover:text-primary-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-display font-bold text-lg text-primary-foreground">KalaKart — Demo Payment</h2>
          <p className="text-primary-foreground/80 text-sm">Secure checkout powered by demo</p>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-secondary" />
            </div>
            <h3 className="font-display font-bold text-xl text-secondary">Payment Successful!</h3>
            <p className="text-muted-foreground mt-2">Your order is being processed</p>
          </div>
        ) : status === 'failed' ? (
          <div className="p-8 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="font-display font-bold text-xl text-destructive">Payment Failed</h3>
            <p className="text-muted-foreground mt-2">Please try again with different details</p>
            <Button onClick={resetModal} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Payment Methods */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'card', icon: CreditCard, label: 'Card' },
                { id: 'upi', icon: Smartphone, label: 'UPI' },
                { id: 'netbanking', icon: Building2, label: 'Bank' },
                { id: 'cod', icon: Banknote, label: 'COD' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id as PaymentMethod)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                    method === id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className={cn("w-5 h-5", method === id ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-medium", method === id ? "text-primary" : "text-muted-foreground")}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Card Form */}
            {method === 'card' && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 bg-accent/10 rounded-lg text-xs text-muted-foreground">
                  💡 Use test card: <span className="font-mono font-medium">4111 1111 1111 1111</span>
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {method === 'upi' && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 bg-accent/10 rounded-lg text-xs text-muted-foreground">
                  💡 Use UPI ID: <span className="font-mono font-medium">demo@upi</span>
                </div>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'netbanking' && (
              <div className="animate-fade-in">
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select your bank to continue (Demo mode)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                    <button
                      key={bank}
                      className="p-3 border border-border rounded-lg text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      {bank} Bank
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COD */}
            {method === 'cod' && (
              <div className="animate-fade-in p-4 bg-muted rounded-lg">
                <p className="text-sm text-center">
                  Pay <span className="font-bold text-primary">₹{amount.toLocaleString()}</span> when your order is delivered
                </p>
              </div>
            )}

            {/* Simulate failure toggle (demo only) */}
            <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-lg">
              <input
                type="checkbox"
                id="simulateFailure"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="accent-destructive"
              />
              <label htmlFor="simulateFailure" className="text-xs text-muted-foreground">
                Simulate payment failure (demo)
              </label>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePay}
              disabled={status === 'processing'}
              className="w-full h-12 text-base font-semibold"
            >
              {status === 'processing' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Pay ₹${amount.toLocaleString()} (Demo)`
              )}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground">
              🔒 This is a demo payment. No real transaction will occur.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
