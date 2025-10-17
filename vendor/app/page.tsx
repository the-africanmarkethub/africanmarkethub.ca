import AuthFlowComponent from "@/components/AuthFlowComponent";
import SignInForm from "@/components/forms/SignInForm";
import { AuthChecker } from "@/components/auth-checker";

export default function RegisterPage() {
  return (
    <>
      <AuthChecker />
      <AuthFlowComponent>
        <SignInForm />
      </AuthFlowComponent>
    </>
  );
}
