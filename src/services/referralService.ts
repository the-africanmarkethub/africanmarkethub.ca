import APICall from "@/utils/ApiCall";

export interface ReferralCodeResponse {
  status: string;
  referral_code: string;
}

export interface ApplyReferralCodeRequest {
  referral_code: string;
}

export interface ApplyReferralCodeResponse {
  status: string;
  message: string;
  data?: any;
}

export async function getReferralCode(): Promise<ReferralCodeResponse> {
  const response = await APICall("/customer/referrals/code", "GET");
  return response;
}

export async function applyReferralCode(data: ApplyReferralCodeRequest): Promise<ApplyReferralCodeResponse> {
  const response = await APICall("/customer/referrals/apply-code", "POST", data);
  return response;
}