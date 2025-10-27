import { redirect } from 'next/navigation';

export default function VendorRootPage() {
  // Redirect to vendor overview - let the auth context handle authentication
  redirect('/vendor/overview');
}