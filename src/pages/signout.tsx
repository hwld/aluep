import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

function signout() {
  const router = useRouter();
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div>サインアウトしますか？</div>
      <button onClick={handleSignOut}>yes</button>
    </>
  );
}

export default signout;
