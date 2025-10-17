"use client";

import { useState } from "react";
import { useReferralCode } from "@/hooks/useReferralCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Copy, 
  Share2, 
  Users, 
  Gift, 
  DollarSign,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export default function ReferPage() {
  const { data: referralData, isLoading, error } = useReferralCode();
  const [copied, setCopied] = useState(false);

  const referralCode = referralData?.referral_code || "";
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/sign-up?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: string) => {
    const message = `Join Africa Market Hub and get amazing deals on authentic African products! Use my referral code: ${referralCode}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedLink = encodeURIComponent(referralLink);

    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedMessage}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedLink}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Join Africa Market Hub&body=${encodedMessage}%0A%0A${encodedLink}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">
          <Gift size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to load referral code
        </h2>
        <p className="text-gray-600">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer & Earn</h1>
        <p className="text-gray-600">
          Share the love and earn rewards when your friends join Africa Market Hub!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Friends Referred</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users size={32} className="text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Earned</p>
                <p className="text-2xl font-bold">₦0</p>
              </div>
              <DollarSign size={32} className="text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Pending Rewards</p>
                <p className="text-2xl font-bold">₦0</p>
              </div>
              <Gift size={32} className="text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-primary" size={24} />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 border-2 border-dashed border-primary rounded-lg p-6 text-center">
            <div className="text-3xl font-mono font-bold text-primary mb-4">
              {referralCode}
            </div>
            <Button 
              onClick={handleCopyCode}
              className="bg-primary hover:bg-primary/90"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-gray-600">
            <p className="mb-2">Or share your referral link:</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="text-primary" size={24} />
            Share & Invite Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => handleShare("whatsapp")}
              className="flex flex-col items-center gap-2 p-6 h-auto hover:bg-green-50 hover:border-green-500"
            >
              <MessageCircle className="text-green-600" size={32} />
              <span className="text-sm">WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("facebook")}
              className="flex flex-col items-center gap-2 p-6 h-auto hover:bg-blue-50 hover:border-blue-500"
            >
              <Facebook className="text-blue-600" size={32} />
              <span className="text-sm">Facebook</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("twitter")}
              className="flex flex-col items-center gap-2 p-6 h-auto hover:bg-sky-50 hover:border-sky-500"
            >
              <Twitter className="text-sky-600" size={32} />
              <span className="text-sm">Twitter</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("email")}
              className="flex flex-col items-center gap-2 p-6 h-auto hover:bg-gray-50 hover:border-gray-500"
            >
              <Mail className="text-gray-600" size={32} />
              <span className="text-sm">Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                1
              </div>
              <h3 className="font-semibold mb-2">Share Your Code</h3>
              <p className="text-gray-600 text-sm">
                Share your unique referral code with friends and family
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                2
              </div>
              <h3 className="font-semibold mb-2">Friend Signs Up</h3>
              <p className="text-gray-600 text-sm">
                Your friend creates an account using your referral code
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                3
              </div>
              <h3 className="font-semibold mb-2">You Both Earn</h3>
              <p className="text-gray-600 text-sm">
                Both you and your friend receive exclusive rewards and bonuses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Referral rewards are credited after your friend makes their first purchase</li>
            <li>There is no limit to the number of friends you can refer</li>
            <li>Referred friends must be new users to Africa Market Hub</li>
            <li>Rewards may take up to 7 business days to be processed</li>
            <li>Africa Market Hub reserves the right to modify the referral program at any time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
