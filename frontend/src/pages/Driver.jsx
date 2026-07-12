import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const INITIAL_FORM = {
    driver_name: "",
    license_number: "",
    license_category: "LMV",
    license_expiry: "",
    contact_number: "",
    trip_completion_pct: "0",
    safety_score: "100",
    status: "Available",
};

function StatusPill({ label, className }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}

function Driver() {
    const [driverStats, setDriverStats] = useState([]);
    const [driverRows, setDriverRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState(INITIAL_FORM);

    useEffect(() => {
        let isMounted = true;

        const loadDrivers = async () => {
            try {
                const response = await api.get("/drivers");

                if (!isMounted) return;

                setDriverStats(response.data.driverStats || []);
                setDriverRows(response.data.driverRows || []);
                setError("");
            } catch (requestError) {
                if (!isMounted) return;

                setError(requestError.response?.data?.error || "Failed to load driver data.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDrivers();

        const intervalId = window.setInterval(loadDrivers, 30000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    const openForm = () => {
        setFormError("");
        setForm(INITIAL_FORM);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        if (submitting) return;
        setIsFormOpen(false);
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const submitDriver = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setFormError("");

            await api.post("/drivers", {
                ...form,
                trip_completion_pct: Number(form.trip_completion_pct),
                safety_score: Number(form.safety_score),
            });

            setIsFormOpen(false);
            await api.get("/drivers").then((response) => {
                setDriverStats(response.data.driverStats || []);
                setDriverRows(response.data.driverRows || []);
            });
        } catch (requestError) {
            setFormError(
                requestError.response?.data?.error || "Failed to create driver."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Drivers & Safety Profiles</h1>
                            <p className="mt-1 text-sm text-slate-500">Live driver data from the database.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white sm:w-72"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={openForm}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                            >
                                <Plus className="h-4 w-4" />
                                Add Driver
                            </button>
                        </div>
                    </div>
                </section>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                        Loading driver data...
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
                        <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Add Driver</h2>
                                    <p className="mt-1 text-sm text-slate-500">Create a new driver record directly in the database.</p>
                                </div>

                                <button type="button" onClick={closeForm} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
                                    Close
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={submitDriver} className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Driver Name</span>
                                    <input name="driver_name" value={form.driver_name} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">License Number</span>
                                    <input name="license_number" value={form.license_number} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">License Category</span>
                                    <select name="license_category" value={form.license_category} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400">
                                        <option value="LMV">LMV</option>
                                        <option value="HMV">HMV</option>
                                    </select>
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">License Expiry</span>
                                    <input type="date" name="license_expiry" value={form.license_expiry} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Contact Number</span>
                                    <input name="contact_number" value={form.contact_number} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Trip Completion %</span>
                                    <input type="number" min="0" max="100" name="trip_completion_pct" value={form.trip_completion_pct} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Safety Score</span>
                                    <input type="number" min="0" max="100" name="safety_score" value={form.safety_score} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Status</span>
                                    <select name="status" value={form.status} onChange={handleFieldChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-orange-400">
                                        <option value="Available">Available</option>
                                        <option value="On Trip">On Trip</option>
                                        <option value="Off Duty">Off Duty</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </label>

                                <div className="md:col-span-2 mt-2 flex justify-end gap-3">
                                    <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                                        {submitting ? "Saving..." : "Save Driver"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {driverStats.map((item) => (
                        <div key={item.label} className={`rounded-2xl px-5 py-4 shadow-sm ${item.className}`}>
                            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{item.label}</p>
                            <p className="mt-2 text-3xl font-bold">{item.value}</p>
                        </div>
                    ))}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <div className="grid grid-cols-7 gap-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Driver</span>
                            <span>License No.</span>
                            <span>Category</span>
                            <span>Expiry</span>
                            <span>Contact</span>
                            <span>Trip Compl.</span>
                            <span>Safety</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {driverRows.map((driver) => (
                            <div key={driver.license} className="grid grid-cols-7 gap-4 px-6 py-4 text-sm text-slate-700">
                                <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-slate-900">{driver.name}</span>
                                    <StatusPill label={driver.status} className={driver.statusClass} />
                                </div>
                                <span>{driver.license}</span>
                                <span>{driver.category}</span>
                                <span>{driver.expiry}</span>
                                <span>{driver.contact}</span>
                                <span className="font-medium text-slate-900">{driver.completion}</span>
                                <span className="font-medium text-slate-900">{driver.safety}%</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap gap-3">
                        <StatusPill label="Available" className="bg-emerald-500 text-white" />
                        <StatusPill label="On Trip" className="bg-blue-500 text-white" />
                        <StatusPill label="Off Duty" className="bg-slate-600 text-white" />
                        <StatusPill label="Suspended" className="bg-orange-500 text-white" />
                    </div>

                    <p className="mt-3 text-sm text-orange-500">
                        Note: expired or suspended drivers should be blocked from trip assignment.
                    </p>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default Driver;