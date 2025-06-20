// "use client";

// // Import necessary React and Firebase dependencies
// import * as React from "react";
// import { Minus, Plus } from "lucide-react"; // Icons for increment/decrement buttons
// import { Button } from "@/components/ui/button"; // Custom UI button component
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"; // Drawer components for modal interface
// import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firebase Firestore functions
// import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
// import { auth, db } from "@/lib/firebase"; // Firebase configuration
// import { useEffect, useState } from "react"; // React hooks for state and side effects
// import { useRouter } from "next/navigation"; // Next.js router for navigation

// // Define props type for the component
// type ConfirmTransactionProps = {
//   manager: {
//     id: string; // Unique identifier for the manager
//     name: string; // Manager's name
//     roi: number; // Return on investment percentage
//     minInvestment: number; // Minimum investment amount
//     maxInvestment: number; // Maximum investment amount
//   };
// };

// // Define interface for user data structure
// interface UserData {
//   availableBalance: number; // User's available wallet balance
//   investedAmount?: number; // Total amount invested (optional)
//   botInvestments?: Record<string, { amount: number; date: string }>; // Investments per bot with amount and date
// }

// // ConfirmTransaction component to handle investment transactions
// const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({ manager }) => {
//   // Initialize Next.js router
//   const router = useRouter();

//   // State for user ID, user data, loading status, and investment amount
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Extract min and max investment amounts from manager props
//   const min = manager.minInvestment;
//   const max = manager.maxInvestment;
//   const [amount, setAmount] = useState(min); // Initialize investment amount to minimum

//   // Effect to fetch user data when authentication state changes
//   useEffect(() => {
//     // Subscribe to auth state changes
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user?.uid) {
//         try {
//           // Fetch user document from Firestore
//           const docRef = doc(db, "users", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             // Update state with user data
//             setUserData({
//               availableBalance: data.walletBalance ?? 0,
//               investedAmount: data.investedAmount ?? 0,
//               botInvestments: data.botInvestments ?? {},
//             });
//             setUserId(user.uid);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     });

//     // Cleanup subscription on component unmount
//     return () => unsubscribe();
//   }, []);

//   // Function to adjust investment amount within min/max bounds
//   function onClick(adjustment: number) {
//     setAmount((prev) => Math.min(max, Math.max(min, prev + adjustment)));
//   }

//   // Calculate estimated ROI based on manager's ROI percentage
//   const totalROI = ((manager.roi / 100) * amount).toFixed(2);

//   // Handle transaction confirmation
//   const handleConfirm = async () => {
//     if (!userId || !userData) return; // Exit if user data is not available
//     setLoading(true); // Set loading state

//     try {
//       // Reference to user document in Firestore
//       const userRef = doc(db, "users", userId);
//       const userDocSnap = await getDoc(userRef);
//       const data = userDocSnap.data();

//       // Get current balance and investments
//       const currentBalance = data?.walletBalance ?? 0;
//       const currentInvestments: Record<
//         string,
//         { amount: number; date: string }
//       > = data?.botInvestments ?? {};
//       const existingBots: string[] = data?.investedBots ?? [];

//       // Calculate new balance after investment
//       const newBalance = currentBalance - amount;
//       const transactionDate = new Date().toISOString(); // Record transaction timestamp

//       // Update bot investments list
//       const updatedBots = existingBots.includes(manager.id)
//         ? existingBots
//         : [...existingBots, manager.id];

//       // Update investment amount for this manager
//       const prevInvestment = currentInvestments[manager.id] ?? {
//         amount: 0,
//         date: transactionDate,
//       };
//       const updatedInvestments = {
//         ...currentInvestments,
//         [manager.id]: {
//           amount: prevInvestment.amount + amount,
//           date: transactionDate,
//         },
//       };

//       // Update Firestore document with new balance and investments
//       await updateDoc(userRef, {
//         walletBalance: newBalance,
//         botInvestments: updatedInvestments,
//         investedBots: updatedBots,
//       });

//       // Update local state with new balance and investments
//       setUserData((prev) =>
//         prev
//           ? {
//               ...prev,
//               availableBalance: newBalance,
//               botInvestments: updatedInvestments,
//             }
//           : null
//       );

//       // Navigate to portfolio page and close drawer
//       router.push("/portfolio");
//       document.getElementById("drawer-close-btn")?.click();
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   // Render drawer component for investment input
//   return (
//     <Drawer>
//       {/* Button to trigger drawer */}
//       <DrawerTrigger asChild>
//         <Button className="py-2 px-5 border-2 border-black hover:text-white rounded-lg text-black bg-white transition-all duration-500 hover:bg-black">
//           Invest Now
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <div className="mx-auto w-full max-w-sm font-montserrat">
//           <DrawerHeader>
//             <DrawerTitle>Enter Amount</DrawerTitle>
//             <DrawerDescription>
//               Adjust investment to see projected ROI.
//             </DrawerDescription>
//             {/* Display available balance */}
//             <p className="text-sm">
//               Available Balance:{" "}
//               <span className="font-semibold">
//                 ${userData?.availableBalance ?? "Loading..."}
//               </span>
//             </p>
//           </DrawerHeader>

//           <div className="p-4 pb-0">
//             {/* Investment amount adjustment controls */}
//             <div className="flex items-center justify-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(-100)}
//                 disabled={amount <= min}
//               >
//                 <Minus />
//                 <span className="sr-only">Decrease</span>
//               </Button>
//               <div className="flex-1 text-center">
//                 <div className="text-5xl font-bold tracking-tighter">
//                   ${amount}
//                 </div>
//                 <div className="text-muted-foreground text-xs uppercase">
//                   Investment Amount
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Min: ${min} | Max: ${max}
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(100)}
//                 disabled={amount >= max}
//               >
//                 <Plus />
//                 <span className="sr-only">Increase</span>
//               </Button>
//             </div>

//             {/* Display estimated ROI */}
//             <div className="mt-4 text-center text-white">
//               <p className="text-sm">Estimated ROI:</p>
//               <p className="text-2xl font-semibold text-green-400">
//                 ${totalROI}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 ({manager.roi}% per trade)
//               </p>
//             </div>

//             {/* Show insufficient balance warning if applicable */}
//             {userData && userData.availableBalance < amount && (
//               <p className="text-red-500 text-sm text-center mt-2">
//                 Insufficient balance to confirm this transaction.
//               </p>
//             )}
//           </div>

//           <DrawerFooter>
//             {/* Confirm button with loading state */}
//             <Button
//               disabled={loading || (userData?.availableBalance ?? 0) < amount}
//               onClick={handleConfirm}
//             >
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </div>
//               ) : (
//                 "Confirm"
//               )}
//             </Button>

//             {/* Cancel button to close drawer */}
//             <DrawerClose asChild>
//               <Button variant="outline" id="drawer-close-btn">
//                 Cancel
//               </Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// // Export the component
// export default ConfirmTransaction;

"use client";

// Import necessary React and Firebase dependencies
import * as React from "react";
import { Minus, Plus } from "lucide-react"; // Icons for increment/decrement buttons
import { Button } from "@/components/ui/button"; // Custom UI button component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"; // Drawer components for modal interface
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firebase Firestore functions
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { auth, db } from "@/lib/firebase"; // Firebase configuration
import { useEffect, useState } from "react"; // React hooks for state and side effects
import { useRouter } from "next/navigation"; // Next.js router for navigation

// Define props type for the component
type ConfirmTransactionProps = {
  manager: {
    id: string; // Unique identifier for the bot
    name: string; // Bot's name
    roi: number; // Return on investment percentage
    minInvestment: number; // Minimum investment amount
    maxInvestment: number; // Maximum investment amount
  };
};

// Define interface for user data structure
interface UserData {
  availableBalance: number; // User's available wallet balance
  investedAmount?: number; // Total amount invested (optional)
  botInvestments?: Record<string, { amount: number; date: string }>; // Investments per bot with amount and date
}

// ConfirmTransaction component to handle bot investment transactions
const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({ manager }) => {
  // Initialize Next.js router
  const router = useRouter();

  // State for user ID, user data, loading status, and investment amount
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract min and max investment amounts from manager props
  const min = manager.minInvestment;
  const max = manager.maxInvestment;
  const [amount, setAmount] = useState(min); // Initialize investment amount to minimum

  // Effect to fetch user data when authentication state changes
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        try {
          // Fetch user document from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Update state with user data
            setUserData({
              availableBalance: data.walletBalance ?? 0,
              investedAmount: data.investedAmount ?? 0,
              botInvestments: data.botInvestments ?? {},
            });
            setUserId(user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Function to adjust investment amount within min/max bounds
  function onClick(adjustment: number) {
    setAmount((prev) => Math.min(max, Math.max(min, prev + adjustment)));
  }

  // Calculate estimated ROI based on manager's ROI percentage
  const totalROI = ((manager.roi / 100) * amount).toFixed(2);

  // Handle transaction confirmation
  const handleConfirm = async () => {
    if (!userId || !userData) return; // Exit if user data is not available
    setLoading(true); // Set loading state

    try {
      // Reference to user document in Firestore
      const userRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userRef);
      const data = userDocSnap.data();

      // Get current balance and investments
      const currentBalance = data?.walletBalance ?? 0;
      const currentInvestments: Record<
        string,
        { amount: number; date: string }
      > = data?.botInvestments ?? {};
      const existingBots: string[] = data?.investedBots ?? [];
      const currentInitialInvestments = data?.initialInvestments ?? 0; // Initialize to 0 if missing

      // Validate balance
      if (currentBalance < amount) {
        console.error("Insufficient balance", { currentBalance, amount });
        setLoading(false);
        return;
      }

      // Calculate new balance and initial investments
      const newBalance = currentBalance - amount;
      const newInitialInvestments = currentInitialInvestments + amount;
      const transactionDate = new Date().toISOString(); // Record transaction timestamp

      // Update bot investments list
      const updatedBots = existingBots.includes(manager.id)
        ? existingBots
        : [...existingBots, manager.id];

      // Update investment amount for this bot
      const prevInvestment = currentInvestments[manager.id] ?? {
        amount: 0,
        date: transactionDate,
      };
      const updatedInvestments = {
        ...currentInvestments,
        [manager.id]: {
          amount: prevInvestment.amount + amount,
          date: transactionDate,
        },
      };

      // Update Firestore document with new balance, investments, and initialInvestments
      await updateDoc(userRef, {
        walletBalance: newBalance,
        botInvestments: updatedInvestments,
        investedBots: updatedBots,
        initialInvestments: newInitialInvestments, // Add or update initialInvestments
      });

      // Log update for debugging
      console.log("Updated Firestore", {
        newBalance,
        botId: manager.id,
        investmentAmount: amount,
        newInitialInvestments,
      });

      // Update local state with new balance and investments
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              availableBalance: newBalance,
              botInvestments: updatedInvestments,
            }
          : null
      );

      // Navigate to portfolio page and close drawer
      router.push("/portfolio");
      document.getElementById("drawer-close-btn")?.click();
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Render drawer component for investment input
  return (
    <Drawer>
      {/* Button to trigger drawer */}
      <DrawerTrigger asChild>
        <Button className="py-2 px-5 border-2 border-black hover:text-white rounded-lg text-black bg-white transition-all duration-500 hover:bg-black">
          Invest Now
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm font-montserrat">
          <DrawerHeader>
            <DrawerTitle>Enter Amount</DrawerTitle>
            <DrawerDescription>
              Adjust investment to see projected ROI.
            </DrawerDescription>
            {/* Display available balance */}
            <p className="text-sm">
              Available Balance:{" "}
              <span className="font-semibold">
                ${userData?.availableBalance ?? "Loading..."}
              </span>
            </p>
          </DrawerHeader>

          <div className="p-4 pb-0">
            {/* Investment amount adjustment controls */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-100)}
                disabled={amount <= min}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold tracking-tighter">
                  ${amount}
                </div>
                <div className="text-muted-foreground text-xs uppercase">
                  Investment Amount
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Min: ${min} | Max: ${max}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(100)}
                disabled={amount >= max}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>

            {/* Display estimated ROI */}
            <div className="mt-4 text-center text-white">
              <p className="text-sm">Estimated ROI:</p>
              <p className="text-2xl font-semibold text-green-400">
                ${totalROI}
              </p>
              <p className="text-xs text-muted-foreground">
                ({manager.roi}% per trade)
              </p>
            </div>

            {/* Show insufficient balance warning if applicable */}
            {userData && userData.availableBalance < amount && (
              <p className="text-red-500 text-sm text-center mt-2">
                Insufficient balance to confirm this transaction.
              </p>
            )}
          </div>

          <DrawerFooter>
            {/* Confirm button with loading state */}
            <Button
              disabled={loading || (userData?.availableBalance ?? 0) < amount}
              onClick={handleConfirm}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>

            {/* Cancel button to close drawer */}
            <DrawerClose asChild>
              <Button variant="outline" id="drawer-close-btn">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Export the component
export default ConfirmTransaction;
