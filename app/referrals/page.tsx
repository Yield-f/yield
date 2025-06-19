"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button"; // Optional for styled button
import { toast } from "sonner"; // Optional for feedback

import {
  doc,
  onSnapshot,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/loading";

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData?.referrals?.length) {
        const referralDocs = await Promise.all(
          userData.referrals.map((id: string) => getDoc(doc(db, "users", id)))
        );
        setReferrals(
          referralDocs
            .filter((doc) => doc.exists())
            .map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }

      setReferralCode(userData?.referralCode ?? "");
      setLoading(false);
    };

    fetchReferrals();
  }, []);

  function maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    const visible = user.slice(0, 5);
    return `${visible}***@${domain}`;
  }

  const referralUrl = `https://yieldfountain-iu3q.vercel.app/auth?ref=${referralCode}`;

  if (loading) return <Loading />;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 font-montserrat">
          <h2 className="text-2xl font-bold mb-4">Referral Program</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>
                Share this code to invite others and earn rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold truncate">{referralUrl}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralUrl);
                    toast.success("Referral link copied!");
                  }}
                  className="p-1 hover:text-blue-600 transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Code: <span className="font-semibold">{referralCode}</span>
              </p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold mb-2">Your Referrals</h3>
          {referrals.length === 0 ? (
            <p>No referrals yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {referrals.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {maskEmail(user.email)}
                    </CardTitle>

                    <CardDescription>Joined via your referral</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
