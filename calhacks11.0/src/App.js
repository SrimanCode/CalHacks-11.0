<<<<<<< HEAD
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      // Redirect to MainPage when user is signed in
      navigate("/main");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <header className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <SignedOut>
          <div className="flex justify-center">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center">
            <UserButton />
          </div>
        </SignedIn>
      </header>
    </div>
  );
}
=======
>>>>>>> dd2a18dcd4a48e9f06199fe4c7865cf4f0418701
