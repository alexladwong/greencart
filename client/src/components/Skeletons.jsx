const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton rounded-2xl ${className}`}></div>
);

export const ProductsGridSkeleton = ({ count = 10 }) => (
  <div className="grid grid-cols-2 gap-3 md:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
      >
        <SkeletonBlock className="h-28 md:h-36 w-full" />
        <SkeletonBlock className="mt-4 h-3 w-20" />
        <SkeletonBlock className="mt-3 h-5 w-4/5" />
        <SkeletonBlock className="mt-4 h-4 w-24" />
        <div className="mt-5 flex items-center justify-between gap-3">
          <SkeletonBlock className="h-6 w-24" />
          <SkeletonBlock className="h-9 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="mt-8 md:mt-12">
    <SkeletonBlock className="h-4 w-52" />
    <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div className="grid grid-cols-4 gap-3 md:flex md:w-24 md:flex-col">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="aspect-square w-full" />
          ))}
        </div>
        <SkeletonBlock className="min-h-[340px] flex-1" />
      </div>
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <SkeletonBlock className="h-8 w-3/4" />
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <div className="grid gap-3 pt-4 sm:grid-cols-2">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const CartSkeleton = () => (
  <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-56" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[96px_1fr] gap-4 rounded-2xl border border-gray-200 bg-white p-4">
          <SkeletonBlock className="h-24 w-24" />
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
    <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <SkeletonBlock className="h-7 w-36" />
      <SkeletonBlock className="h-16 w-full" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-12 w-full" />
    </div>
  </div>
);

export const OrdersSkeleton = ({ count = 3 }) => (
  <div className="mt-6 space-y-5">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <SkeletonBlock className="h-5 w-56" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-20 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:mt-10">
    <SkeletonBlock className="h-[420px] w-full" />
  </div>
);

