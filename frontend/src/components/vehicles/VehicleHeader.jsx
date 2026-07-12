function VehicleHeader() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-800">
        Vehicle Registry
      </h1>

      <p className="text-slate-500">
        Manage and monitor all registered fleet vehicles.
      </p>
    </section>
  );
}

export default VehicleHeader;