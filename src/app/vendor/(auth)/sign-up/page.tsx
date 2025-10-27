import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import RegisterForm from "@/components/vendor/forms/RegisterForm";
import { AuthChecker } from "@/components/vendor/auth-checker";

export default function VendorSignUpPage() {
  return (
    <>
      <AuthChecker />
      <AuthFlowComponent>
        <RegisterForm />
      </AuthFlowComponent>
    </>
  );
}