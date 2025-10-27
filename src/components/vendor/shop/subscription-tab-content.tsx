"use client";

import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/vendor/ui/card";
import { useSubcription } from "@/hooks/vendor/useSubcription";
import { useSubscriptionPayment } from "@/hooks/vendor/useSubscriptionPayment";
import { Loader2 } from "lucide-react";

export default function SubscriptionTabContent() {
  const { data: subscriptions, isLoading } = useSubcription();
  const subscriptionPaymentMutation = useSubscriptionPayment();
  const [processingPayment, setProcessingPayment] = useState(false);

  const handlePayment = async (subscriptionData: any) => {
    setProcessingPayment(true);
    try {
      await subscriptionPaymentMutation.mutateAsync(subscriptionData);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions && subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{subscription.plan_name || "Subscription Plan"}</h3>
                      <p className="text-sm text-gray-600">{subscription.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${subscription.amount}</p>
                      <p className="text-sm text-gray-600">{subscription.interval}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>

                  {subscription.status !== 'active' && (
                    <Button
                      onClick={() => handlePayment(subscription)}
                      disabled={processingPayment}
                      className="bg-[#F28C0D] hover:bg-[#F28C0D] text-white"
                    >
                      {processingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process Payment"
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No subscriptions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}