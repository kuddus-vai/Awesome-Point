import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  Gift,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  History,
  Copy,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AVAILABLE_REWARDS } from '../data/mockData';
import { LoyaltyReward } from '../types';

export const LoyaltyModal: React.FC = () => {
  const { isLoyaltyOpen, setIsLoyaltyOpen, loyalty, redeemLoyaltyReward } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isLoyaltyOpen) return null;

  const nextTierGoal = loyalty.tier === 'Member' ? 2000 : loyalty.tier === 'Silver' ? 5000 : 10000;
  const progressToNext = Math.min(100, Math.round((loyalty.totalSpent / nextTierGoal) * 100));

  const handleRedeem = (reward: LoyaltyReward) => {
    const res = redeemLoyaltyReward(reward);
    if (res.success && res.couponCode) {
      setCopiedCode(res.couponCode);
      setTimeout(() => setCopiedCode(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header with Dark Luxury Gradient */}
        <div className="relative p-6 sm:p-7 bg-neutral-950 text-white overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  এক্সক্লুসিভ রিওয়ার্ডস
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  অসাম ক্লাব রিওয়ার্ডস
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsLoyaltyOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Points & Tier Card */}
          <div className="mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs text-neutral-300">বর্তমান রিওয়ার্ড পয়েন্ট</span>
              <div className="text-3xl font-black text-amber-300 tracking-tight flex items-baseline gap-2">
                <span>{loyalty.points}</span>
                <span className="text-xs font-semibold text-neutral-300">ক্লাব পয়েন্ট</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                চেকআউটে প্রায় ৳{loyalty.points} সমমূল্যের ছাড় পাওয়া যাবে
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                বর্তমান মেম্বারশিপ টায়ার
              </span>
              <span className="inline-block px-3 py-1 mt-0.5 rounded-full text-xs font-black bg-amber-400 text-neutral-950 uppercase tracking-wider">
                ★ {loyalty.tier} মেম্বার
              </span>
              <p className="text-[10px] text-neutral-300 mt-1">
                সর্বমোট কেনাকাটা: ৳{loyalty.totalSpent.toLocaleString()} ({loyalty.ordersCount}টি অর্ডার)
              </p>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="mt-4 space-y-1 text-xs">
            <div className="flex justify-between text-[11px] text-neutral-300">
              <span>পরবর্তী টায়ার: {loyalty.tier === 'Silver' ? 'গোল্ড' : 'ব্ল্যাক মেম্বার'}</span>
              <span>
                আর ৳{Math.max(0, nextTierGoal - loyalty.totalSpent).toLocaleString()} কেনাকাটা করলেই আনলক
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* How to Earn Points Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <Sparkles className="w-4 h-4 text-neutral-800 mb-1" />
              <strong className="block text-neutral-900">কেনাকাটা ও পয়েন্ট লাভ</strong>
              <span className="text-neutral-500 text-[11px]">প্রতি ৳১০ খরচে ১টি ক্লাব পয়েন্ট অর্জন করুন</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <Gift className="w-4 h-4 text-neutral-800 mb-1" />
              <strong className="block text-neutral-900">ভাউচার রিডিম করুন</strong>
              <span className="text-neutral-500 text-[11px]">১০০ পয়েন্ট = ৳১০০ ডিসকাউন্ট কুপন ভাউচার</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <Award className="w-4 h-4 text-neutral-800 mb-1" />
              <strong className="block text-neutral-900">ভিআইপি সুবিধা</strong>
              <span className="text-neutral-500 text-[11px]">ফ্রি ডেলিভারি কুপন ও নতুন ড্রপের আগাম অ্যাক্সেস</span>
            </div>
          </div>

          {/* Redeemable Rewards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                পয়েন্ট দিয়ে রিওয়ার্ড ভাউচার নিন
              </h4>
              <span className="text-[11px] text-neutral-500">তাৎক্ষণিক কুপন তৈরি হবে</span>
            </div>

            <div className="space-y-2.5">
              {AVAILABLE_REWARDS.map((rew) => {
                const canAfford = loyalty.points >= rew.pointsCost;
                const isJustCopied = copiedCode === rew.code;

                return (
                  <div
                    key={rew.id}
                    className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                          {rew.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                          {rew.pointsCost} পয়েন্ট
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        ন্যূনতম অর্ডার ৳{rew.minOrder.toLocaleString()} • কুপন কোড: "{rew.code}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleRedeem(rew)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                        isJustCopied
                          ? 'bg-emerald-600 text-white'
                          : canAfford
                          ? 'bg-neutral-950 text-white hover:bg-neutral-800'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      {isJustCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>কোড কপি হয়েছে!</span>
                        </>
                      ) : (
                        <span>{canAfford ? 'ভাউচার সংগ্রহ করুন' : `আরও ${rew.pointsCost - loyalty.points} পয়েন্ট প্রয়োজন`}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity History */}
          <div className="space-y-3 pt-2 border-t border-neutral-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-neutral-600" />
              <span>পয়েন্ট লেনদেনের ইতিহাস</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {loyalty.history.map((hist) => (
                <div
                  key={hist.id}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-neutral-800 block">
                      {hist.description}
                    </span>
                    <span className="text-[10px] text-neutral-400">{hist.date}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      hist.type === 'earned' || hist.type === 'bonus'
                        ? 'text-emerald-600'
                        : 'text-neutral-500'
                    }`}
                  >
                    {hist.type === 'redeemed' ? `-${hist.points}` : `+${hist.points}`} পয়েন্ট
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={() => setIsLoyaltyOpen(false)}
            className="px-5 py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
