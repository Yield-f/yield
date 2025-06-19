// "use client";
// import * as React from "react";
// import { Minus, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "@/lib/firebase";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type ConfirmTransactionProps = {
//   manager: {
//     id: string;
//     min: number;
//     roi: number;
//     [key: string]: any;
//   };
// };

// interface UserData {
//   availableBalance: number;
//   investedAmount?: number;
//   managerInvestments?: Record<
//     string,
//     {
//       amount: number;
//       date: string;
//     }
//   >;
// }

// const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({ manager }) => {
//   const router = useRouter();
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user?.uid) {
//         try {
//           const docRef = doc(db, "users", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setUserData({
//               availableBalance: data.walletBalance ?? 0,
//               investedAmount: data.investedAmount ?? 0,
//             });
//             setUserId(user.uid);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const min = manager?.min;
//   const [amount, setAmount] = React.useState(min);

//   function onClick(adjustment: number) {
//     setAmount((prev) => Math.max(min, prev + adjustment));
//   }

//   const totalROI = ((manager?.roi / 100) * amount).toFixed(2);

//   const handleConfirm = async () => {
//     if (!userId || !userData) return;
//     setLoading(true);

//     try {
//       const userRef = doc(db, "users", userId);
//       const userDocSnap = await getDoc(userRef);
//       const data = userDocSnap.data();

//       const currentBalance = data?.walletBalance ?? 0;
//       const currentInvestments: Record<
//         string,
//         { amount: number; date: string }
//       > = data?.managerInvestments ?? {};
//       const existingManagers: string[] = data?.patronizedManagers ?? [];

//       const newBalance = currentBalance - amount;

//       const updatedManagers = existingManagers.includes(manager.id)
//         ? existingManagers
//         : [...existingManagers, manager.id];

//       const prev = currentInvestments[manager.id] ?? {
//         amount: 0,
//         date: new Date().toISOString(),
//       };

//       const updatedInvestments = {
//         ...currentInvestments,
//         [manager.id]: {
//           amount: prev.amount + amount,
//           date: prev.amount === 0 ? new Date().toISOString() : prev.date,
//         },
//       };

//       await updateDoc(userRef, {
//         walletBalance: newBalance,
//         managerInvestments: updatedInvestments,
//         patronizedManagers: updatedManagers,
//       });

//       setUserData((prev) =>
//         prev
//           ? {
//               ...prev,
//               availableBalance: newBalance,
//             }
//           : null
//       );

//       router.push("/portfolio");
//       document.getElementById("drawer-close-btn")?.click();
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Drawer>
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
//             <p className="text-sm ">
//               Available Balance:{" "}
//               <span className="font-semibold">
//                 ${userData?.availableBalance ?? "Loading..."}
//               </span>
//             </p>
//           </DrawerHeader>

//           <div className="p-4 pb-0">
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
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(100)}
//               >
//                 <Plus />
//                 <span className="sr-only">Increase</span>
//               </Button>
//             </div>

//             {/* ROI DISPLAY */}
//             <div className="mt-4 text-center text-white">
//               <p className="text-sm">Estimated ROI:</p>
//               <p className="text-2xl font-semibold text-green-400">
//                 ${totalROI}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 ({manager?.roi}% per trade)
//               </p>
//             </div>
//             {userData && userData.availableBalance < amount && (
//               <p className="text-red-500 text-sm text-center mt-2">
//                 Insufficient balance to confirm this transaction.
//               </p>
//             )}
//           </div>

//           <DrawerFooter>
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

// export default ConfirmTransaction;

"use client";

// Import necessary dependencies for React, UI components, and Firebase
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
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions for document operations
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { auth, db } from "@/lib/firebase"; // Firebase configuration (auth and Firestore)
import { useEffect, useState } from "react"; // React hooks for state and side effects
import { useRouter } from "next/navigation"; // Next.js router for navigation

// Define props type for the component
type ConfirmTransactionProps = {
  manager: {
    id: string; // Unique identifier for the manager
    min: number; // Minimum investment amount
    roi: number; // Return on investment percentage
    [key: string]: any; // Allow additional properties for flexibility
  };
};

// Define interface for user data structure
interface UserData {
  availableBalance: number; // User's available wallet balance
  investedAmount?: number; // Total amount invested (optional)
  managerInvestments?: Record<
    string,
    {
      amount: number; // Investment amount for a specific manager
      date: string; // Date of the investment
    }
  >; // Investments per manager
}

// ConfirmTransaction component to handle investment transactions
const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({ manager }) => {
  // Initialize Next.js router for navigation
  const router = useRouter();

  // State for user ID, user data, loading status, and investment amount
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Effect to fetch user data when authentication state changes
  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        try {
          // Fetch user document from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Update state with user data, defaulting to 0 for missing values
            setUserData({
              availableBalance: data.walletBalance ?? 0,
              investedAmount: data.investedAmount ?? 0,
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

  // Extract minimum investment amount from manager props
  const min = manager?.min;
  // Initialize investment amount to the minimum
  const [amount, setAmount] = React.useState(min);

  // Function to adjust investment amount, ensuring it doesn't go below the minimum
  function onClick(adjustment: number) {
    setAmount((prev) => Math.max(min, prev + adjustment));
  }

  // Calculate estimated ROI based on manager's ROI percentage
  const totalROI = ((manager?.roi / 100) * amount).toFixed(2);

  // Handle transaction confirmation
  const handleConfirm = async () => {
    if (!userId || !userData) return; // Exit if user data is not available
    setLoading(true); // Set loading state to indicate processing

    try {
      // Reference to user document in Firestore
      const userRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userRef);
      const data = userDocSnap.data();

      // Get current balance and investment data
      const currentBalance = data?.walletBalance ?? 0;
      const currentInvestments: Record<
        string,
        { amount: number; date: string }
      > = data?.managerInvestments ?? {};
      const existingManagers: string[] = data?.patronizedManagers ?? [];

      // Calculate new balance after deducting investment amount
      const newBalance = currentBalance - amount;

      // Update list of patronized managers
      const updatedManagers = existingManagers.includes(manager.id)
        ? existingManagers
        : [...existingManagers, manager.id];

      // Get previous investment for this manager, defaulting to 0 amount and current date
      const prev = currentInvestments[manager.id] ?? {
        amount: 0,
        date: new Date().toISOString(),
      };

      // Update investments with new amount, preserving original date if investment exists
      const updatedInvestments = {
        ...currentInvestments,
        [manager.id]: {
          amount: prev.amount + amount,
          date: prev.amount === 0 ? new Date().toISOString() : prev.date,
        },
      };

      // Update Firestore document with new balance, investments, and managers
      await updateDoc(userRef, {
        walletBalance: newBalance,
        managerInvestments: updatedInvestments,
        patronizedManagers: updatedManagers,
      });

      // Update local state with new balance
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              availableBalance: newBalance,
            }
          : null
      );

      // Navigate to portfolio page and programmatically close drawer
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
      {/* Button to trigger the drawer */}
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
            {/* Display user's available balance */}
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
                disabled={amount <= min} // Disable if amount is at minimum
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
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(100)} // No max limit check
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
                ({manager?.roi}% per trade)
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
