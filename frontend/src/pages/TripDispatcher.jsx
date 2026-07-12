import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const INITIAL_FORM = {
    source: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    planned_distance: "",
    status: "Draft",
};

const lifecycleSteps = ["Draft", "Dispatched", "Completed", "Cancelled"];

function StatusPill({ label, className }) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}

function TripDispatcher() {
    const [tripStats, setTripStats] = useState([]);
    const [tripRows, setTripRows] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);

    const selectedVehicle = useMemo(
        () => vehicles.find((vehicle) => String(vehicle.vehicle_id) === String(form.vehicle_id)),
        [vehicles, form.vehicle_id]
    );

    const capacityExceeded =
        selectedVehicle && form.cargo_weight && Number(form.cargo_weight) > Number(selectedVehicle.capacity);

    useEffect(() => {
        let isMounted = true;

        const loadTrips = async () => {
            try {
                const response = await api.get("/trips");

                if (!isMounted) return;

                setTripStats(response.data.tripStats || []);
                setTripRows(response.data.tripRows || []);
                setVehicles(response.data.vehicles || []);
                setDrivers(response.data.drivers || []);
                setError("");
            } catch (requestError) {
                if (!isMounted) return;

                setError(requestError.response?.data?.error || "Failed to load trip data.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTrips();

        const intervalId = window.setInterval(loadTrips, 30000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedVehicle && capacityExceeded) {
            setFormError(
                `Cargo weight exceeds vehicle capacity of ${selectedVehicle.capacity} kg.`
            );
            return;
        }

        if (form.status === "Dispatched") {
            if (!form.vehicle_id || !form.driver_id) {
                setFormError("Vehicle and driver are required for dispatched trips.");
                return;
            }
        }

        try {
            setSubmitting(true);
            setFormError("");

            await api.post("/trips", {
                ...form,
                vehicle_id: form.vehicle_id ? Number(form.vehicle_id) : null,
                driver_id: form.driver_id ? Number(form.driver_id) : null,
                cargo_weight: Number(form.cargo_weight),
                planned_distance: Number(form.planned_distance),
            });

            setForm(INITIAL_FORM);

            const response = await api.get("/trips");
            setTripStats(response.data.tripStats || []);
            setTripRows(response.data.tripRows || []);
            setVehicles(response.data.vehicles || []);
            setDrivers(response.data.drivers || []);
        } catch (requestError) {
            setFormError(
                requestError.response?.data?.error || "Failed to create trip."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Trip Lifecycle
                            </p>

                            <div className="mt-4 flex flex-wrap gap-4">
                                {lifecycleSteps.map((step, index) => {
                                    const dotClass =
                                        index === 0
                                            ? "bg-emerald-500"
                                            : index === 1
                                                ? "bg-blue-500"
                                                : index === 2
                                                    ? "bg-slate-300"
                                                    : "bg-slate-400";

                                    return (
                                        <div key={step} className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${dotClass}`} />
                                            <span className="text-sm font-medium text-slate-600">
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-800">
                                Trip Dispatcher
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Create live trips, dispatch them to available vehicles and
                                drivers, and keep the board synced to the database.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:w-[560px]">
                            {tripStats.map((item) => (
                                <div
                                    key={item.label}
                                    className={`rounded-2xl px-5 py-4 shadow-sm ${item.className}`}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                        Loading trip data...
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-slate-800">Create Trip</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Pick route, vehicle and driver, then save the record to MySQL.
                        </p>

                        {formError && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formError}
                            </div>
                        )}

                        <div className="mt-5 space-y-4">
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Source
                                </span>
                                <input
                                    name="source"
                                    value={form.source}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                    placeholder="Gandhinagar Depot"
                                />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Destination
                                </span>
                                <input
                                    name="destination"
                                    value={form.destination}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                    placeholder="Ahmedabad Hub"
                                />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Vehicle
                                </span>
                                <select
                                    name="vehicle_id"
                                    value={form.vehicle_id}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                >
                                    <option value="">Select vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                            {vehicle.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Driver
                                </span>
                                <select
                                    name="driver_id"
                                    value={form.driver_id}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                >
                                    <option value="">Select driver</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.driver_id} value={driver.driver_id}>
                                            {driver.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Cargo Weight (kg)
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        name="cargo_weight"
                                        value={form.cargo_weight}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                        placeholder="700"
                                    />
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Planned Distance (km)
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        name="planned_distance"
                                        value={form.planned_distance}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                        placeholder="38"
                                    />
                                </label>
                            </div>

                            {selectedVehicle && (
                                <div
                                    className={`rounded-xl border px-4 py-3 text-sm ${capacityExceeded
                                        ? "border-red-200 bg-red-50 text-red-700"
                                        : "border-slate-200 bg-slate-50 text-slate-700"
                                        }`}
                                >
                                    <div>Vehicle capacity: {selectedVehicle.capacity} kg</div>
                                    <div>Cargo weight: {form.cargo_weight || 0} kg</div>
                                    {capacityExceeded && (
                                        <div className="mt-1 font-semibold">
                                            Capacity exceeded. Dispatch blocked.
                                        </div>
                                    )}
                                </div>
                            )}

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Status
                                </span>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </label>

                            {form.status === "Dispatched" && (
                                <p className="text-xs text-slate-500">
                                    Dispatching will mark the selected vehicle and driver as On
                                    Trip.
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? "Saving..." : "Create Trip"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm(INITIAL_FORM)}
                                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Live Board
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Fresh from the trips table.
                                </p>
                            </div>
                            <StatusPill label="Live" className="bg-emerald-500 text-white" />
                        </div>

                        <div className="mt-5 space-y-4">
                            {tripRows.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                                    No trips found yet.
                                </div>
                            ) : (
                                tripRows.map((trip) => (
                                    <div
                                        key={trip.tripReference}
                                        className="rounded-2xl border border-dashed border-slate-200 px-4 py-4"
                                    >
                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {trip.tripReference}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {trip.source} → {trip.destination}
                                                </p>
                                                <div className="mt-3">
                                                    <StatusPill
                                                        label={trip.status}
                                                        className={trip.statusClass}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-right text-sm text-slate-500">
                                                <p>
                                                    {trip.registrationNumber} / {trip.driverName}
                                                </p>
                                                <p className="mt-1">
                                                    {trip.cargoWeight} kg • {trip.plannedDistance} km
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {trip.note}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default TripDispatcher;