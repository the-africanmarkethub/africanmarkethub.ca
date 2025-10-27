"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";

export default function SignInSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <Image
              src="/img/African Market Hub.svg"
              alt="African Market Hub"
              width={180}
              height={45}
              className="h-auto"
            />
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Africa&apos;s
              <span className="text-[#F28C0D] block">Leading Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you&apos;d like to experience our platform - shop for authentic African products or sell your own
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer Card */}
            <Link href="/customer/sign-in" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#F28C0D]/30 h-full">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F28C0D] to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">I&apos;m a Customer</h2>
                    <p className="text-gray-600 mb-6">
                      Discover authentic African products, from fashion and crafts to fresh produce and electronics
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#F28C0D] rounded-full"></div>
                        <span>Browse thousands of products</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#F28C0D] rounded-full"></div>
                        <span>Secure payments & delivery</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#F28C0D] rounded-full"></div>
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-[#F28C0D] hover:bg-orange-600 text-white font-semibold py-3 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                    Sign in as Customer
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* Vendor Card */}
            <Link href="/vendor/sign-in" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#F28C0D]/30 h-full">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#9C5432] to-amber-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">I&apos;m a Vendor</h2>
                    <p className="text-gray-600 mb-6">
                      Start selling your products to customers across Africa and grow your business with us
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#9C5432] rounded-full"></div>
                        <span>Create your online store</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#9C5432] rounded-full"></div>
                        <span>Reach millions of customers</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1 h-1 bg-[#9C5432] rounded-full"></div>
                        <span>Analytics & sales tools</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-[#9C5432] hover:bg-amber-800 text-white font-semibold py-3 rounded-xl transition-colors duration-300">
                    Sign in as Vendor
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link 
                href="/sign-up" 
                className="text-[#F28C0D] hover:text-orange-600 font-semibold hover:underline transition-colors duration-300"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}