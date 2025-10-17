import APICall from "@/utils/ApiCall";

export interface ReferralCodeResponse {
  status: string;
  referral_code: string;
}

export async function getReferralCode(): Promise<ReferralCodeResponse> {
  const response = await APICall("/customer/referrals/code", "GET");
  return response;
}