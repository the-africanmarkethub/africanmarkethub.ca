"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type PaymentMethod = "bank" | "stripe" | "paypal";

interface PaymentDetailsProps {
  onBack: () => void;
  onNext: () => void;
}

export default function PaymentDetails({
  onBack,
  onNext,
}: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
        className="mb-6"
      >
        <div className="font-medium mb-2">Pay With</div>
        <div className="flex items-center space-x-4 rounded-lg border bg-gray-50 p-4">
          <RadioGroupItem value="bank" id="bank" />
          <Label htmlFor="bank">Direct bank transfer</Label>
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe">Stripe</Label>
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal">PayPal</Label>
        </div>
      </RadioGroup>

      {paymentMethod === "bank" && (
        <div className="border-t pt-6">
          <p className="text-gray-600 mb-4">
            Direct bank transfer, also known as a wire transfer, is a method for
            moving funds between bank accounts.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-sm text-gray-500">Transfer 400.50 CAD</p>
            <p className="text-lg font-semibold my-1">Swiss Bank</p>
            <p className="text-2xl font-bold tracking-wider text-primary">
              10100300300
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "stripe" && (
        <div className="border-t pt-6 space-y-4">
          <div className="grid grid-cols-1">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" placeholder="01/24" />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="save-card" />
            <Label htmlFor="save-card">Save card details</Label>
          </div>
        </div>
      )}

      <div className="border-t mt-6 pt-6">
        <p className="text-xs text-gray-500 mb-4">
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our{" "}
          <a href="/privacy-policy" className="text-primary hover:underline">
            privacy policy.
          </a>
        </p>
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox id="terms" />
          <Label htmlFor="terms">
            I have read and agree to the website terms and conditions
          </Label>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            Back to Shipping
          </Button>
          <Button onClick={onNext}>
            {paymentMethod === "bank" ? "Confirm Payment" : "Pay 400.50"}
          </Button>
        </div>
      </div>
    </div>
  );
}
