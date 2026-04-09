import { Minus, Plus, ShoppingCart } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onAdd: (e?: React.MouseEvent) => void;
  onIncrement: (e?: React.MouseEvent) => void;
  onDecrement: (e?: React.MouseEvent) => void;
}

const QuantityStepper = ({ quantity, onAdd, onIncrement, onDecrement }: QuantityStepperProps) => {
  if (quantity === 0) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAdd(e);
        }}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 active:scale-[0.97] transition-all"
      >
        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
      </button>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 overflow-hidden">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrement(e);
        }}
        className="h-full px-3 py-2.5 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="text-sm font-extrabold text-primary tabular-nums">
        {quantity}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrement(e);
        }}
        className="h-full px-3 py-2.5 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantityStepper;
