interface AuthHeaders {
  Authorization: string;
  "Content-Type": string;
  accept: string;
}

export const authHeaders = (token: string): AuthHeaders => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  accept: "application/json",
});

export const headers = {
  "Content-Type": "application/json",
  accept: "application/json",
};
