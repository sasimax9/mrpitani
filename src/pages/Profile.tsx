import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Save, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, phone")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name || "");
        setPhone(data.phone || "");
      } else {
        setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "");
        setPhone(user.phone || "");
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName, phone })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero-gradient py-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground">My Profile</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Manage your account details</p>
        </div>
      </section>

      <div className="container max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-full hero-gradient flex items-center justify-center shadow-lg shadow-primary/20 mb-3">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-lg font-bold text-foreground">{displayName || "User"}</p>
          <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
        </div>

        {/* Edit Form */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 space-y-5">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 8977775878"
                className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-muted-foreground bg-muted/30 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition-all"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-6 rounded-2xl glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Quick Links</h3>
          <div className="space-y-2">
            <button onClick={() => navigate("/cart")} className="w-full flex items-center gap-3 rounded-xl hover:bg-muted p-3 transition-colors text-left">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">My Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
