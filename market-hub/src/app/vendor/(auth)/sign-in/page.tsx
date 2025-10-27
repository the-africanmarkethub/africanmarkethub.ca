import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import SignInForm from "@/components/vendor/forms/SignInForm";
import { AuthChecker } from "@/components/vendor/auth-checker";

export default function VendorSignInPage() {
  return (
    <>
      <AuthChecker />
      <AuthFlowComponent>
        <SignInForm />
      </AuthFlowComponent>
    </>
  );
}