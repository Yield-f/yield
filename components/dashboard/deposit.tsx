// // "use client";
// // import React, { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { doc, updateDoc } from "firebase/firestore";
// // import { auth, db } from "@/lib/firebase"; // Adjust this based on your setup
// // import { useRouter, usePathname } from "next/navigation";

// // import {
// //   Dialog,
// //   DialogClose,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Label } from "@/components/ui/label";
// // import { Copy } from "lucide-react";
// // import { toast } from "sonner";

// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // export function Deposit() {
// //   const addresses: Record<string, string> = {
// //     bitcoin: "bc1q6yvxtm9sn5z8qjy8pexqyex57vp9tyz7rvssqs",
// //     ethereum: "0x4c974D8f8FE8932DDd839C5cBDb913C4a44fBBA3",
// //     solana: "6Vz4nCNLqe4qXD6kS1iH5cz1QLK3spzV2YZjKLTd6rXb",
// //     usdt: "0x1234567890abcdef1234567890abcdef12345678",
// //     usdc: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
// //   };

// //   const [selectedNetwork, setSelectedNetwork] = React.useState<string>("");

// //   function handleCopy(address: string) {
// //     navigator.clipboard.writeText(address);
// //     toast("Copied to clipboard!");
// //   }
// //   const router = useRouter();
// //   const pathname = usePathname();

// //   const [amount, setAmount] = useState(0);

// //   // const handleDepositConfirm = async () => {
// //   //   const user = auth.currentUser;

// //   //   if (!user?.uid) {
// //   //     toast.error("User not authenticated");
// //   //     return;
// //   //   }

// //   //   try {
// //   //     const userRef = doc(db, "users", user.uid);

// //   //     await updateDoc(userRef, {
// //   //       pendingStatus: true,
// //   //       pendingAmount: amount,
// //   //     });

// //   //     toast.success("Deposit marked as pending!");
// //   //     setOpen(false); // Close the dialog
// //   //     setAmount(0);
// //   //     setSelectedNetwork("");
// //   //   } catch (error) {
// //   //     console.error("Error updating deposit status:", error);
// //   //     toast.error("Something went wrong. Try again.");
// //   //   }
// //   // };

// //   // dialog close

// //   const handleDepositConfirm = async () => {
// //     const user = auth.currentUser;

// //     if (!user?.uid) {
// //       toast.error("User not authenticated");
// //       return;
// //     }

// //     try {
// //       const userRef = doc(db, "users", user.uid);

// //       await updateDoc(userRef, {
// //         pendingStatus: true,
// //         pendingAmount: amount,
// //       });

// //       toast.success("Deposit marked as pending!");
// //       setOpen(false);
// //       setAmount(0);
// //       setSelectedNetwork("");

// //       // ✅ Redirect to dashboard if not already there
// //       if (pathname !== "/dashboard") {
// //         router.push("/dashboard");
// //       }
// //     } catch (error) {
// //       console.error("Error updating deposit status:", error);
// //       toast.error("Something went wrong. Try again.");
// //     }
// //   };

// //   const [open, setOpen] = useState(false);

// //   return (
// //     <Dialog
// //       open={open}
// //       onOpenChange={(open) => {
// //         setOpen(open); // Control dialog open state
// //         if (!open) {
// //           setAmount(0); // Reset amount
// //           setSelectedNetwork(""); // Reset network
// //         }
// //       }}
// //     >
// //       <DialogTrigger asChild>
// //         <Button variant="outline" className="font-montserrat">
// //           Deposit
// //         </Button>
// //       </DialogTrigger>
// //       <DialogContent className="sm:max-w-[425px] font-montserrat">
// //         <DialogHeader>
// //           <DialogTitle>Make a deposit</DialogTitle>
// //           <DialogDescription>
// //             Select a network, copy the address, and complete your deposit.
// //           </DialogDescription>
// //         </DialogHeader>

// //         <div className="relative w-full">
// //           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
// //             $
// //           </span>
// //           <Input
// //             type="number"
// //             placeholder="Enter amount"
// //             className="pl-7"
// //             onChange={(e) => setAmount(Number(e.target.value))}
// //           />{" "}
// //         </div>

// //         <Select onValueChange={setSelectedNetwork}>
// //           <SelectTrigger className="w-full">
// //             <SelectValue placeholder="Choose Network" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="bitcoin">Bitcoin</SelectItem>
// //             <SelectItem value="ethereum">Ethereum</SelectItem>
// //             <SelectItem value="solana">Solana</SelectItem>
// //             <SelectItem value="usdt">USDT</SelectItem>
// //             <SelectItem value="usdc">USDC</SelectItem>
// //           </SelectContent>
// //         </Select>

// //         {selectedNetwork && addresses[selectedNetwork] && (
// //           <div className="grid gap-4 pt-4">
// //             <Label htmlFor="wallet">
// //               {selectedNetwork.charAt(0).toUpperCase() +
// //                 selectedNetwork.slice(1)}{" "}
// //               Address
// //             </Label>
// //             <div className="flex items-center space-x-2">
// //               <input
// //                 id="wallet"
// //                 readOnly
// //                 value={addresses[selectedNetwork]}
// //                 className="flex-1 rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm"
// //               />
// //               <Button
// //                 type="button"
// //                 size="icon"
// //                 variant="outline"
// //                 onClick={() => handleCopy(addresses[selectedNetwork])}
// //               >
// //                 <Copy className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         )}

// //         {selectedNetwork && amount > 0 && (
// //           <div>
// //             <p className="text font-poppins pb-2 text-sm">
// //               Deposit exactly <span className="font-semibold"> ${amount}</span>{" "}
// //               to the above address{" "}
// //             </p>
// //           </div>
// //         )}

// //         <DialogFooter className="py-2">
// //           <DialogClose asChild>
// //             <Button variant="outline">Cancel</Button>
// //           </DialogClose>
// //           <Button type="button" className="mb-2" onClick={handleDepositConfirm}>
// //             I&apos;ve Made the Deposit
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { useRouter, usePathname } from "next/navigation";
// import { SiBitcoin, SiEthereum, SiTether, SiSolana } from "react-icons/si"; // Crypto icons
// import { CircleDollarSign, Copy } from "lucide-react"; // Fallback for USDC
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export function Deposit() {
//   const [addresses, setAddresses] = useState<Record<string, string>>({});
//   const [selectedNetwork, setSelectedNetwork] = useState<string>("");
//   const [amount, setAmount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   // Crypto-specific icons and colors
//   const networkStyles: Record<
//     string,
//     { icon: React.ComponentType<{ className?: string }>; color: string }
//   > = {
//     bitcoin: { icon: SiBitcoin, color: "text-orange-500 dark:text-orange-300" },
//     ethereum: {
//       icon: SiEthereum,
//       color: "text-purple-500 dark:text-purple-300",
//     },
//     solana: { icon: SiSolana, color: "text-teal-500 dark:text-teal-300" },
//     usdt: { icon: SiTether, color: "text-green-500 dark:text-green-300" },
//     usdc: { icon: CircleDollarSign, color: "text-blue-500 dark:text-blue-300" }, // Fallback for USDC
//   };

//   // Fetch wallet addresses from Firebase
//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       collection(db, "wallets"),
//       (snapshot) => {
//         const walletData: Record<string, string> = {};
//         snapshot.forEach((doc) => {
//           walletData[doc.id] = doc.data().address || "";
//         });
//         setAddresses(walletData);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching wallet addresses:", error);
//         toast.error("Failed to load wallet addresses.");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Copy address to clipboard
//   const handleCopy = (address: string) => {
//     navigator.clipboard.writeText(address);
//     toast.success("Copied to clipboard!");
//   };

//   // Handle deposit confirmation
//   const handleDepositConfirm = async () => {
//     const user = auth.currentUser;

//     if (!user?.uid) {
//       toast.error("User not authenticated");
//       return;
//     }

//     if (!selectedNetwork || !amount) {
//       toast.error("Please select a network and enter an amount.");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", user.uid);
//       await updateDoc(userRef, {
//         pendingStatus: true,
//         pendingAmount: amount,
//         pendingNetwork: selectedNetwork,
//       });

//       toast.success("Deposit marked as pending!");
//       setOpen(false);
//       setAmount(0);
//       setSelectedNetwork("");

//       if (pathname !== "/dashboard") {
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       console.error("Error updating deposit status:", error);
//       toast.error("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(open) => {
//         setOpen(open);
//         if (!open) {
//           setAmount(0);
//           setSelectedNetwork("");
//         }
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="font-montserrat bg-gradient-to-r from-blue-500/10 to-blue-300/10 dark:from-blue-700/10 dark:to-blue-500/10 hover:bg-blue-500/20 transition-all duration-300"
//         >
//           Deposit
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px] font-montserrat bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg animate-in fade-in duration-300">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//             Make a Deposit
//           </DialogTitle>
//           <DialogDescription className="text-muted-foreground">
//             Select a network, copy the address, and complete your deposit.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="relative w-full">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//             $
//           </span>
//           <Input
//             type="number"
//             placeholder="Enter amount"
//             className="pl-7 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-200"
//             onChange={(e) => setAmount(Number(e.target.value))}
//           />
//         </div>

//         <Select onValueChange={setSelectedNetwork} value={selectedNetwork}>
//           <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300">
//             <SelectValue placeholder="Choose Network" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.keys(networkStyles).map((network) => (
//               <SelectItem key={network} value={network}>
//                 <div className="flex items-center space-x-2">
//                   {React.createElement(networkStyles[network].icon, {
//                     className: `size-4 ${networkStyles[network].color}`,
//                   })}
//                   <span>
//                     {network.charAt(0).toUpperCase() + network.slice(1)}
//                   </span>
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {loading ? (
//           <div className="text-muted-foreground text-center py-4">
//             Loading addresses...
//           </div>
//         ) : selectedNetwork && addresses[selectedNetwork] ? (
//           <div className="grid gap-4 pt-4">
//             <Label
//               htmlFor="wallet"
//               className={`font-semibold ${networkStyles[selectedNetwork]?.color}`}
//             >
//               {selectedNetwork.charAt(0).toUpperCase() +
//                 selectedNetwork.slice(1)}{" "}
//               Address
//             </Label>
//             <div className="flex items-center space-x-2">
//               <input
//                 id="wallet"
//                 readOnly
//                 value={addresses[selectedNetwork]}
//                 className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-muted px-3 py-2 text-sm shadow-sm font-mono truncate"
//               />
//               <Button
//                 type="button"
//                 size="icon"
//                 variant="outline"
//                 className="hover:bg-blue-500/10 dark:hover:bg-blue-700/10 transition-all duration-200"
//                 onClick={() => handleCopy(addresses[selectedNetwork])}
//               >
//                 <Copy className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         ) : selectedNetwork ? (
//           <div className="text-red-500 dark:text-red-300 text-center py-4">
//             No address available for{" "}
//             {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
//             .
//           </div>
//         ) : null}

//         {selectedNetwork && amount > 0 && addresses[selectedNetwork] && (
//           <div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
//             Deposit exactly <span className="font-semibold">${amount}</span> to
//             the above address.
//           </div>
//         )}

//         <DialogFooter className="py-2">
//           <DialogClose asChild>
//             <Button
//               variant="outline"
//               className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
//             >
//               Cancel
//             </Button>
//           </DialogClose>
//           <Button
//             type="button"
//             className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all duration-200"
//             onClick={handleDepositConfirm}
//             disabled={
//               !selectedNetwork || !amount || !addresses[selectedNetwork]
//             }
//           >
//             I've Made the Deposit
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

//components/dashboard/deposit.tsx
"use client";
import React, { useState, useEffect } from "react";
import { addDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { SiBitcoin, SiEthereum, SiTether, SiSolana } from "react-icons/si";
import { CircleDollarSign, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Deposit() {
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const networkStyles: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    bitcoin: { icon: SiBitcoin, color: "text-orange-500 dark:text-orange-300" },
    ethereum: {
      icon: SiEthereum,
      color: "text-purple-500 dark:text-purple-300",
    },
    solana: { icon: SiSolana, color: "text-teal-500 dark:text-teal-300" },
    usdt: { icon: SiTether, color: "text-green-500 dark:text-green-300" },
    usdc: { icon: CircleDollarSign, color: "text-blue-500 dark:text-blue-300" },
  };

  // Map UI network names to Firestore document IDs
  const networkToDocId: Record<string, string> = {
    bitcoin: "btc",
    ethereum: "eth",
    solana: "sol",
    usdc: "usdc",
    usdt: "usdt",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "wallets"),
      (snapshot) => {
        const walletData: Record<string, string> = {};
        snapshot.forEach((doc) => {
          walletData[doc.id] = doc.data().address || "";
        });
        setAddresses(walletData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching wallet addresses:", error);
        toast.error("Failed to load wallet addresses.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Copied to clipboard!");
  };

  // const handleDepositConfirm = async () => {
  //   const user = auth.currentUser;

  //   if (!user?.uid) {
  //     toast.error("User not authenticated");
  //     return;
  //   }

  //   if (!selectedNetwork || !amount) {
  //     toast.error("Please select a network and enter an amount.");
  //     return;
  //   }

  //   try {
  //     const userRef = doc(db, "users", user.uid);
  //     await updateDoc(userRef, {
  //       pendingStatus: true,
  //       pendingAmount: amount,
  //       pendingNetwork: selectedNetwork,
  //     });

  //     toast.success("Deposit marked as pending!");
  //     setOpen(false);
  //     setAmount(0);
  //     setSelectedNetwork("");

  //     if (pathname !== "/dashboard") {
  //       router.push("/dashboard");
  //     }
  //   } catch (error) {
  //     console.error("Error updating deposit status:", error);
  //     toast.error("Something went wrong. Try again.");
  //   }
  // };

  // Inside handleDepositConfirm
  // const handleDepositConfirm = async () => {
  //   const user = auth.currentUser;

  //   if (!user?.uid) {
  //     toast.error("User not authenticated");
  //     return;
  //   }

  //   if (!selectedNetwork || !amount) {
  //     toast.error("Please select a network and enter an amount.");
  //     return;
  //   }

  //   try {
  //     const userRef = doc(db, "users", user.uid);

  //     // 1. Update user's pending status
  //     await updateDoc(userRef, {
  //       pendingStatus: true,
  //       pendingAmount: amount,
  //       pendingNetwork: selectedNetwork,
  //     });

  //     // 2. Add transaction to history
  //     await addDoc(collection(db, "transactions"), {
  //       uid: user.uid,
  //       type: "deposit",
  //       amount,
  //       network: selectedNetwork,
  //       status: "pending",
  //       timestamp: serverTimestamp(),
  //     });

  //     //
  //     await updateDoc(userRef, {
  //       pendingDeposits: arrayUnion({
  //         amount,
  //         network: selectedNetwork,
  //         status: "pending",
  //         timestamp: serverTimestamp(),
  //       }),
  //     });

  //     toast.success("Deposit marked as pending!");
  //     setOpen(false);
  //     setAmount(0);
  //     setSelectedNetwork("");

  //     if (pathname !== "/dashboard") {
  //       router.push("/dashboard");
  //     }
  //   } catch (error) {
  //     console.error("Error updating deposit status:", error);
  //     toast.error("Something went wrong. Try again.");
  //   }
  // };
  const handleDepositConfirm = async () => {
    const user = auth.currentUser;

    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (!selectedNetwork || !amount) {
      toast.error("Please select a network and enter an amount.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      // 1. Update user's pending status
      await updateDoc(userRef, {
        pendingStatus: true,
        pendingAmount: amount,
        pendingNetwork: selectedNetwork,
      });

      // 2. Add transaction to global transaction history
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "deposit",
        amount,
        network: selectedNetwork,
        status: "pending",
        timestamp: serverTimestamp(),
      });

      // 3. Create deposit object and use it in arrayUnion
      const depositEntry = {
        amount,
        network: selectedNetwork,
        status: "pending",
        timestamp: new Date(), // Use Date object instead of serverTimestamp()
      };

      await updateDoc(userRef, {
        history: arrayUnion(depositEntry),
      });

      toast.success("Deposit marked as pending!");
      setOpen(false);
      setAmount(0);
      setSelectedNetwork("");

      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating deposit status:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setAmount(0);
          setSelectedNetwork("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-montserrat bg-gradient-to-r from-blue-500/10 to-blue-300/10 dark:from-blue-700/10 dark:to-blue-500/10 hover:bg-blue-500/20 transition-all duration-300"
        >
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-montserrat bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg animate-in fade-in duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Make a Deposit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a network, copy the address, and complete your deposit.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            placeholder="Enter amount"
            className="pl-7 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-200"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <Select onValueChange={setSelectedNetwork} value={selectedNetwork}>
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300">
            <SelectValue placeholder="Choose Network" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(networkStyles).map((network) => (
              <SelectItem key={network} value={network}>
                <div className="flex items-center space-x-2">
                  {React.createElement(networkStyles[network].icon, {
                    className: `size-4 ${networkStyles[network].color}`,
                  })}
                  <span>
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading ? (
          <div className="text-muted-foreground text-center py-4">
            Loading addresses...
          </div>
        ) : selectedNetwork && addresses[networkToDocId[selectedNetwork]] ? (
          <div className="grid gap-4 pt-4">
            <Label
              htmlFor="wallet"
              className={`font-semibold ${networkStyles[selectedNetwork]?.color}`}
            >
              {selectedNetwork.charAt(0).toUpperCase() +
                selectedNetwork.slice(1)}{" "}
              Address
            </Label>
            <div className="flex items-center space-x-2">
              <input
                id="wallet"
                readOnly
                value={addresses[networkToDocId[selectedNetwork]]}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-muted px-3 py-2 text-sm shadow-sm font-mono truncate"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="hover:bg-blue-500/10 dark:hover:bg-blue-700/10 transition-all duration-200"
                onClick={() =>
                  handleCopy(addresses[networkToDocId[selectedNetwork]])
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : selectedNetwork ? (
          <div className="text-red-500 dark:text-red-300 text-center py-4">
            No address available for{" "}
            {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
            .
          </div>
        ) : null}

        {selectedNetwork &&
          amount > 0 &&
          addresses[networkToDocId[selectedNetwork]] && (
            <div className="bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
              Deposit exactly <span className="font-semibold">${amount}</span>{" "}
              to the above address.
            </div>
          )}

        <DialogFooter className="py-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all duration-200"
            onClick={handleDepositConfirm}
            disabled={
              !selectedNetwork ||
              !amount ||
              !addresses[networkToDocId[selectedNetwork]]
            }
          >
            I&apos;ve Made the Deposit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
