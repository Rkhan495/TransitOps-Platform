import { Bell, Search } from "lucide-react";

function DashboardNavbar() {
  /**
   * Temporary user object.
   * Replace with Auth Context later.
   */

  const currentUser = {
    name: "Raven Kumar",
    role: "Fleet Manager",
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">Today's fleet overview</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}

        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white"
          />
        </div>

        {/* Notification */}

        <button
          className="relative rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100"
          type="button"
        >
          <Bell size={20} className="text-slate-600" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500"></span>
        </button>

        {/* User */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-semibold text-white">
            RK
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-slate-800">
              {currentUser.name}
            </p>

            <p className="text-xs text-slate-500">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
