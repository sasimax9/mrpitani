import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthMode = "login" | "signup";
type AuthMethod = "email" | "phone";
type AuthStep = "form" | "email-sent";

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithPhone, verifyOtp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [step, setStep] = useState<AuthStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail(""); setPassword(""); setPhone(""); setOtp("");
    setOtpSent(false); setLoading(false); setStep("form");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUpWithEmail(email.trim(), password);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setStep("email-sent");
      }
    } else {
      const { error } = await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You're now signed in." });
        onOpenChange(false);
        resetForm();
      }
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    const { error } = await signInWithPhone(phone.trim());
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOtpSent(true);
      toast({ title: "OTP Sent", description: `Verification code sent to ${phone}` });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    const { error } = await verifyOtp(phone.trim(), otp.trim());
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome!", description: "You're now signed in." });
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-border/50 glass-dropdown p-0 overflow-hidden rounded-2xl mx-auto">
        {/* Gradient header */}
        <div className="hero-gradient px-5 sm:px-6 pt-6 sm:pt-8 pb-5 sm:pb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_0%_100%/0.1),transparent_60%)]" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-lg sm:text-xl font-extrabold text-primary-foreground">
              {step === "email-sent" ? "Check Your Email" : mode === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
            <p className="text-primary-foreground/70 text-xs sm:text-sm mt-1">
              {step === "email-sent"
                ? "We sent you a verification link"
                : mode === "login"
                ? "Sign in to manage your orders"
                : "Join Mr.Pitani for the best deals"}
            </p>
          </DialogHeader>
        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4">
          {step === "email-sent" ? (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-secondary/15 flex items-center justify-center">
                <Send className="h-6 w-6 sm:h-7 sm:w-7 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Verification email sent to</p>
                <p className="text-sm text-primary font-bold mt-1">{email}</p>
              </div>
              <div className="w-full glass-card rounded-xl p-4 text-left space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">Mr.Pitani</p>
                    <p className="text-[10px] text-muted-foreground">noreply@mrpitani.com</p>
                  </div>
                </div>
                <div className="border-t border-border/50 pt-3 space-y-2">
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-full" />
                  <div className="h-3 bg-muted rounded-full w-5/6" />
                  <div className="mt-3 h-9 bg-primary/15 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">Verify Email Address</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Didn't receive it? Check your spam folder.</p>
              <button onClick={() => { resetForm(); setMode("login"); }} className="text-sm font-bold text-primary hover:underline">
                Back to Sign In
              </button>
            </div>
          ) : (
            <div>
              {/* Method toggle */}
              <div className="flex rounded-xl bg-muted/60 p-1 mb-4 sm:mb-5">
                <button
                  onClick={() => { setMethod("email"); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 sm:py-2.5 text-xs font-bold transition-all ${
                    method === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </button>
                <button
                  onClick={() => { setMethod("phone"); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 sm:py-2.5 text-xs font-bold transition-all ${
                    method === "phone" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" /> Phone
                </button>
              </div>

              {method === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Email</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 sm:py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                        required minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient py-2.5 sm:py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 shadow-lg shadow-primary/20">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              ) : (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handlePhoneSendOtp} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number</label>
                        <input
                          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                          required
                        />
                      </div>
                      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient py-2.5 sm:py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        Send OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Enter OTP</label>
                        <input
                          type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456" maxLength={6}
                          className="w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 sm:py-3 text-sm text-foreground text-center tracking-[0.5em] font-bold placeholder:text-muted-foreground placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                          required
                        />
                        <p className="text-[10px] text-muted-foreground mt-1.5">Sent to {phone}</p>
                      </div>
                      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient py-2.5 sm:py-3 text-sm font-bold text-primary-foreground disabled:opacity-60 shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Verify & Sign In
                      </button>
                      <button type="button" onClick={() => setOtpSent(false)} className="w-full text-xs text-muted-foreground hover:text-foreground">
                        ← Change number
                      </button>
                    </form>
                  )}
                </div>
              )}

              {method === "email" && (
                <p className="text-center text-xs text-muted-foreground mt-4 sm:mt-5">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-bold hover:underline">
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
