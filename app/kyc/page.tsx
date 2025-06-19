"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/loading";
import Spinner from "@/components/spinner";
import { toast } from "sonner";

const kycSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  otherName: z.string().optional(),
  sex: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(1),
  nationality: z.string().min(1),
  dob: z.string().min(1),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
});

type KYCFormValues = z.infer<typeof kycSchema>;

export default function KYCPage() {
  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      otherName: "",
      sex: "Male",
      address: "",
      nationality: "",
      dob: "",
      maritalStatus: "Single",
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const kycSnap = await getDoc(doc(db, "kyc", user.uid));
      const userSnap = await getDoc(doc(db, "users", user.uid));

      const kycData = kycSnap.exists() ? kycSnap.data() : {};
      const userData = userSnap.exists() ? userSnap.data() : {};

      form.reset({
        email: user.email || "",
        firstName: kycData.firstName || userData.firstName || "",
        lastName: kycData.lastName || userData.lastName || "",
        otherName: kycData.otherName || "",
        sex: kycData.sex || "Male",
        address: kycData.address || "",
        nationality: kycData.nationality || userData.nationality || "",
        dob: kycData.dob || "",
        maritalStatus: kycData.maritalStatus || "Single",
      });

      setLoading(false);
    };

    fetchUserInfo();
  }, [form]);

  const onSubmit = async (data: KYCFormValues) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "kyc", user.uid), data);
      toast.success("KYC updated");
    } catch (error) {
      toast.error("Failed to update KYC");
    }
  };

  if (loading) return <Loading />;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 w-full sm:w-5/6 md:w-3/4 max-w-[600px] mx-auto font-montserrat">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your KYC</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {[
                    ["email", "Email"],
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["otherName", "Other Name"],
                    ["address", "Address"],
                    ["nationality", "Nationality"],
                    ["dob", "Date of Birth (mm/dd/yyyy)"],
                  ].map(([name, label]) => (
                    <FormField
                      key={name}
                      name={name as keyof KYCFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full mt-10 hover:bg-white border hover:text-black"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                      </span>
                    ) : (
                      "Update KYC"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
