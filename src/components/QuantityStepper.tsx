import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuantityStepperProps {
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityStepper = ({ quantity, onAdd, onIncrement, onDecrement }: QuantityStepperProps) => {
  return (
    <AnimatePresence mode="wait">
      {quantity === 0 ? (
        <motion.button
          key="add"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onAdd}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 active:scale-[0.97] transition-all"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </motion.button>
      ) : (
        <motion.div
          key="stepper"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 overflow-hidden"
        >
          <button
            onClick={onDecrement}
            className="h-full px-3 py-2.5 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <motion.span
            key={quantity}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-sm font-extrabold text-primary tabular-nums"
          >
            {quantity}
          </motion.span>
          <button
            onClick={onIncrement}
            className="h-full px-3 py-2.5 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantityStepper;
