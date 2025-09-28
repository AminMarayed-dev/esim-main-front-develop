import { useState, useEffect } from "react";
import { Loading } from "./components/ui/loading";
import { UserRegistrationForm } from "./components/UserRegistrationForm";

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds loading

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <UserRegistrationForm />;
}
