import React from 'react';
import { Award, Check, Sparkles } from 'lucide-react';

export const OurStorySection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Text Block */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black tracking-widest uppercase">
            <span>EST. 2020</span>
            <span>•</span>
            <span>DHAKA, BANGLADESH</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 leading-tight">
            Our Story & Commitment to Authentic Quality
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Awesome Point (অসাম পয়েন্ট) যাত্রা শুরু করেছিল একটি স্পষ্ট উদ্দেশ্য নিয়ে—বাংলাদেশের তরুণ ও রুচিশীল পুরুষদের কাছে আন্তর্জাতিক মানের ফ্যাশন, প্রিমিয়াম ফেব্রিক ও নিখুঁত ফিটিং পৌঁছে দেওয়া মধ্যস্বত্বভোগীদের অতিরিক্ত মূল্য বৃদ্ধি ছাড়া।
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            আমাদের প্রতিটি কালেকশন—২২০ জিএসএম ইন্টারলক পিক পোলো থেকে শুরু করে ১৩.৫ আউন্স হেভি রিং-স্পান ডেনিম এবং উইন্টার ট্যাকটিক্যাল বম্বার—সর্বোচ্চ মানের স্টিচিং ও স্থায়িত্ব নিশ্চিত করে তৈরি করা হয়।
          </p>

          {/* Key Stats Counter */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-red-600">
                50,000+
              </span>
              <p className="text-xs font-bold text-neutral-800">
                Happy Customers
              </p>
              <p className="text-[11px] text-neutral-400">
                দেশব্যাপী বিশ্বস্ত গ্রাহক
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                500+
              </span>
              <p className="text-xs font-bold text-neutral-800">
                Premium Products Delivered
              </p>
              <p className="text-[11px] text-neutral-400">
                প্রিমিয়াম স্টাইল ও ড্রপস
              </p>
            </div>
          </div>
        </div>

        {/* Right Image Showcase with Floating Badge */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="/products/466966518_544520338287715_1158647771518592632_n.jpg"
              alt="Awesome Point Fashion Showcase"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                CRAFTED WITH CARE
              </span>
              <p className="text-sm font-bold">
                অসাম পয়েন্ট — আত্মবিশ্বাসী পুরুষের প্রতিদিনের প্রিমিয়াম সঙ্গী
              </p>
            </div>
          </div>

          {/* Floating Quality Badge */}
          <div className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-6 bg-white p-4 rounded-xl border border-neutral-200 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-neutral-900">
                100% Quality Guaranteed
              </span>
              <span className="block text-[10px] text-neutral-500">
                ওপেন-বক্স যাচাই করার সুবিধা
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
