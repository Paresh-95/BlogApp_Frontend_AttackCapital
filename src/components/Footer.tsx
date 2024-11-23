// components/Footer.tsx
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
      
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-white">Subscribe to Our Newsletter</h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex mb-4 gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-lg border-2 border-gray-700 bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button className="rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-2 transition-all">
                Subscribe
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              <div className="flex items-center justify-center mb-4 space-x-2">
                <Checkbox id="mailing-list" className="h-4 w-4 text-indigo-600" />
                <label htmlFor="mailing-list" className="text-sm">
                  I agree to opt-in to the mailing list*
                </label>
              </div>
              <p className="text-xs">
                By clicking &quot;Subscribe&quot;, you agree to our
                <Link href="#" className="underline text-indigo-500 hover:text-indigo-400">
                  Terms of Service
                </Link>
                and
                <Link href="#" className="underline text-indigo-500 hover:text-indigo-400">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
              <TwitterIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
              <YoutubeIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
              <InstagramIcon className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-300">
              <FacebookIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>© 2024 Paresh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
