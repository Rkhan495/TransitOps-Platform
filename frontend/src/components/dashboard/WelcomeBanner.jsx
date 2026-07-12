function WelcomeBanner() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = {
    firstName: storedUser.full_name?.split(" ")[0] || "User",
  };

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentHour = today.getHours();

  let greeting = "Welcome";

  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <section className="mb-8 flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center">
      {/* Left */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          {greeting}, {currentUser.firstName} 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Welcome back! Here's what's happening with your transport operations today.
        </p>
      </div>

      {/* Right */}
      <div className="rounded-xl bg-slate-50 px-5 py-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Today
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {formattedDate}
        </p>
      </div>
    </section>
  );
}

export default WelcomeBanner;