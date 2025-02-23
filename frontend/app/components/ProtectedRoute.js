"use client";  //  Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  //  Correct import
import { auth } from "../lib/firebase";  //  Ensure Firebase is set up properly

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();  //  Now it should work

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");  //  Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>; //  Show a loading state while checking authentication

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
