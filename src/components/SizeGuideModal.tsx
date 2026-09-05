import React, { useState } from 'react';
import { X, Ruler, HelpCircle, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_SIZE_CHARTS } from '../data/mockData';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, activeSizeGuideId } = useStore();
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');

  if (!isSizeGuideOpen) return null;

  const currentChart =
    INITIAL_SIZE_CHARTS.find((chart) => chart.id === activeSizeGuideId) ||
    INITIAL_SIZE_CHARTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 leading-none">
                {currentChart.name} - সাইজ গাইড
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                স্ট্যান্ডার্ড পরিমাপ ও ফিটিং চার্ট
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Unit Toggle & Category Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              পোশাক পরিমাপ চার্ট
            </span>

            <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs font-semibold">
              <button
                onClick={() => setUnit('inch')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'inch' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                ইঞ্চি (Inches)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'cm' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                সেমি (CM)
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  {currentChart.columns.map((col, idx) => (
                    <th key={idx} className="p-3">
                      {col === 'Size' ? 'সাইজ' :
                       col === 'Chest' ? 'বুক (Chest)' :
                       col === 'Length' ? 'লম্বা (Length)' :
                       col === 'Waist' ? 'কোমর (Waist)' :
                       col === 'Thigh' ? 'রান (Thigh)' :
                       col === 'Leg Opening' ? 'পায়ের মোহরি' :
                       col === 'Shoulder' ? 'শোল্ডার' :
                       col === 'Sleeve' ? 'হাতা (Sleeve)' : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {currentChart.rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="p-3 font-bold text-neutral-900 bg-neutral-100/50">
                      {row.size}
                    </td>
                    {row.waist && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.waist}"` : `${Math.round(parseInt(row.waist) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.chest && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.chest}"` : `${Math.round(parseInt(row.chest) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.length && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.length}"` : `${Math.round(parseInt(row.length) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.thigh && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.thigh}"` : `${Math.round(parseInt(row.thigh) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.legOpening && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.legOpening}"` : `${Math.round(parseFloat(row.legOpening) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.shoulder && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.shoulder}"` : `${Math.round(parseFloat(row.shoulder) * 2.54)} সেমি`}
                      </td>
                    )}
                    {row.sleeve && (
                      <td className="p-3 text-neutral-700">
                        {unit === 'inch' ? `${row.sleeve}"` : `${Math.round(parseFloat(row.sleeve) * 2.54)} সেমি`}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fit Advice Box */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-neutral-700" />
              <span>পরিমাপ নির্দেশিকা ও ফিটিং পরামর্শ</span>
            </div>
            <ul className="text-xs text-neutral-600 space-y-1 pl-6 list-disc">
              <li>
                <strong>জিন্স ও প্যান্ট:</strong> স্বাভাবিক কোমরের মাপ অনুযায়ী সাইজ নির্বাচন করুন। আপনি যদি একটু ঢিলেঢালা (ব্যাগি) ফিট পছন্দ করেন, তবে এক সাইজ বড় নিতে পারেন।
              </li>
              <li>
                <strong>ড্রপ শোল্ডার টি-শার্ট:</strong> এগুলো আধুনিক ট্রেন্ডি বক্সি কাটিংয়ে তৈরি। সাধারণ রেগুলার ফিটিং চাইলে স্বাভাবিক সাইজের চেয়ে এক সাইজ ছোট নিতে পারেন।
              </li>
              <li>
                <strong>ডোরস্টেপ সাইজ এক্সচেঞ্জ:</strong> সাইজ নিয়ে কোনো সংশয় থাকলে নিশ্চিন্ত থাকুন—পণ্য ডেলিভারির সময় সাইজ পরিবর্তন করে নেওয়ার সুবিধা রয়েছে।
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
