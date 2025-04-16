import { useEffect, useState } from "react";

function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        setIsKeyboardUser(true);
      }
    };
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

export default useKeyboardNavigation;
