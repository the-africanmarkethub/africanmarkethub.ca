import api from "../axios";

export async function saveShop(formData: FormData) {
  const response = await api.post("/shop/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function subscriptionCheckout(priceId: string) {
  const response = await api.post("/vendor/subscription/checkout", {
    price_id: priceId,
  });
  return response.data;
}

export const verifySubscriptionCheckout = async (sessionId: string) => {
  const response = await api.get(
    `/vendor/subscription/checkout/verify?session_id=${sessionId}`
  );
  return response.data;
};

export const verifyOnboardingStatus = async (sessionId: string) => {
  const response = await api.get(
    `/vendor/subscription/onboarding/verify?session_id=${sessionId}`
  );
  return response.data;
};

export async function updateShopLogo(shopId: number, file: File) {
  const formData = new FormData();
  formData.append("shop_id", String(shopId));
  formData.append("logo", file);

  const response = await api.post(
    `/vendor/shop/logo/update/${shopId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

export async function updateShopBanner(shopId: number, file: File) {
  const formData = new FormData();
  formData.append("shop_id", String(shopId));
  formData.append("banner", file);

  const response = await api.post(
    `/vendor/shop/banner/update/${shopId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

export async function getMyShop() {
  const response = await api.get("/vendor/shop");
  return response.data;
}
