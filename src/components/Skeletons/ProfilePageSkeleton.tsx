import { ImprovedSkeleton } from "@/components/common/ImprovedSkeleton";

export const ProfilePageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ImprovedSkeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <ImprovedSkeleton className="h-8 w-48 mx-auto sm:mx-0" />
            <ImprovedSkeleton className="h-5 w-64 mx-auto sm:mx-0" />
            <div className="flex gap-2 justify-center sm:justify-start">
              <ImprovedSkeleton className="h-10 w-32 rounded-xl" />
              <ImprovedSkeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <ImprovedSkeleton className="h-10 w-10 rounded-full" />
            <ImprovedSkeleton className="h-8 w-16" />
            <ImprovedSkeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex gap-4 p-6 border-b border-border">
          {[1, 2, 3].map((i) => (
            <ImprovedSkeleton key={i} className="h-10 w-28 rounded-lg" />
          ))}
        </div>
        
        <div className="p-6 space-y-6">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border p-5 space-y-3">
                <ImprovedSkeleton className="h-12 w-12 rounded-full" />
                <ImprovedSkeleton className="h-5 w-32" />
                <ImprovedSkeleton className="h-4 w-full" />
              </div>
            ))}
          </div>

          {/* Child Profiles */}
          <div className="space-y-4">
            <ImprovedSkeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <ImprovedSkeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <ImprovedSkeleton className="h-5 w-32" />
                      <ImprovedSkeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ImprovedSkeleton className="h-10 rounded-lg" />
                    <ImprovedSkeleton className="h-10 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <ImprovedSkeleton className="h-6 w-40" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                  <ImprovedSkeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <ImprovedSkeleton className="h-4 w-full" />
                    <ImprovedSkeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
