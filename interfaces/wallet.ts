export interface Wallet {
  available_to_withdraw: number;
  pending_clearance: number;
  instant_cashout: number;
  reserved_for_refunds: number;
  currency: string;
}
