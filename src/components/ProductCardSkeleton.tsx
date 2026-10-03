import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-40 sm:h-44 bg-stone-100 rounded-xl mb-3 w-full" />

      {/* Info Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/3" />
      </div>

      {/* Footer Skeleton */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="h-5 bg-stone-100 rounded w-14" />
        <div className="h-8 bg-stone-100 rounded-full w-16" />
      </div>
    </div>
  );
};
