import React from 'react';
import {
  Package,
  Award,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  Instagram,
  Ruler,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setIsTrackingOpen, setIsLoyaltyOpen, setIsSizeGuideOpen, setViewMode } = useStore();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-14 pb-10 border-t border-neutral-800">
      {/* Value Proposition Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                ৬৪ জেলায় হোম ডেলিভারি এবং পার্সেল খুলে দেখে মূল্য পরিশোধের সুবিধা
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">ডোরস্টেপ সাইজ পরিবর্তন</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                সাইজ না মিললে কোনো ঝামেলা ছাড়াই সরাসরি রাইডারের মাধ্যমে সাইজ এক্সচেঞ্জ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">দ্রুততম কুরিয়ার শিপমেন্ট</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                ঢাকায় ২৪ ঘণ্টায় এবং ঢাকার বাইরে ৪৮-৭২ ঘণ্টায় স্টেডফাস্ট ও পাঠাও এক্সপ্রেসের মাধ্যমে ডেলিভারি
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">অসাম ক্লাব রিওয়ার্ডস</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                প্রতিটি অর্ডারে পয়েন্ট অর্জন করুন এবং পরবর্তী অর্ডারে নগদ ছাড় উপভোগ করুন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-black text-sm">
                <span className="text-amber-400 mr-0.5">A</span>P
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-wider text-white">
                  Awesome Point
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
                  অসাম পয়েন্ট • প্রিমিয়াম মেনস ফ্যাশন
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              দৈনন্দিন প্রিমিয়াম লাইফস্টাইল, ভাইরাল কন্ট্রাস্ট কলার পোলো এবং সেরা ড্রপ শোল্ডার টি-শার্ট। বাংলাদেশের তরুণদের পছন্দের ফ্যাশন ব্র্যান্ড।
            </p>

            {/* Social media connections */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider block">
                অফিসিয়াল সোশ্যাল চ্যানেল
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/awesomepoint420"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-500" />
                  <span>ফেসবুক (@awesomepoint420)</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Customer Service & Help */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              গ্রাহক সেবা ও সহায়তা
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <span>অর্ডার ট্র্যাক করুন</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    লাইভ
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsLoyaltyOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>অসাম ক্লাব রিওয়ার্ডস</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>ইন্টারঅ্যাক্টিভ সাইজ চার্ট</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-faq-scroll-btn"
                  onClick={() => {
                    setViewMode('store');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>সচরাচর জিজ্ঞাসা (FAQ)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('admin')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>মার্চেন্ট ইনভেন্টরি অ্যাডমিন</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              কালেকশনসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>ভাইরাল কন্ট্রাস্ট পোলো</li>
              <li>উইন্টার বোম্বার জ্যাকেট</li>
              <li>২৪০ জিএসএম বক্সি টি-শার্ট</li>
              <li>সেমি ব্যাগি ডেনিম জিন্স</li>
              <li>অক্সফোর্ড ক্যাজুয়াল শার্ট</li>
              <li>ইউটিলিটি কার্গো প্যান্ট</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3 text-xs text-neutral-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              যোগাযোগ ও কাস্টমার কেয়ার
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>+৮৮০ ১৭১১-৪২০৪২০ (হোয়াটসঅ্যাপ / কল)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>support@awesomepoint.com</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              কুরিয়ার পার্টনার: স্টেডফাস্ট এক্সপ্রেস • পাঠাও কুরিয়ার • পেপারফ্লাই
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Awesome Point (অসাম পয়েন্ট). সর্বস্বত্ব সংরক্ষিত।</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>ক্যাশ অন ডেলিভারি</span>
          <span>•</span>
          <span>বিকাশ</span>
          <span>•</span>
          <span>নগদ</span>
          <span>•</span>
          <span>বাংলা কিউআর</span>
        </div>
      </div>
    </footer>
  );
};
