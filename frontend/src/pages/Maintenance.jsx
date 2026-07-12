import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const INITIAL_FORM = {
    vehicle_id: "",
    service_type: "",
    cost: "",
    service_date: "",
    status: "Active",
};

function StatusPill({ label, className }) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}

function Maintenance() {
    const [maintenanceStats, setMaintenanceStats] = useState([]);
    const [maintenanceRows, setMaintenanceRows] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);

    useEffect(() => {
        let isMounted = true;

        const loadMaintenance = async () => {
            try {
                const response = await api.get("/maintenance");

                if (!isMounted) return;

                setMaintenanceStats(response.data.maintenanceStats || []);
                setMaintenanceRows(response.data.maintenanceRows || []);
                setVehicles(response.data.vehicles || []);
                setError("");
            } catch (requestError) {
                if (!isMounted) return;

                const status = requestError.response?.status;
                setError(
                    status === 403
                        ? "You are not authorized to access maintenance."
                        : requestError.response?.data?.error || "Failed to load maintenance data."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadMaintenance();
        const intervalId = window.setInterval(loadMaintenance, 30000);

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

        try {
            setSubmitting(true);
            setFormError("");

            await api.post("/maintenance", {
                ...form,
                vehicle_id: Number(form.vehicle_id),
                cost: Number(form.cost),
            });

            setForm(INITIAL_FORM);
            setIsFormOpen(false);

            const response = await api.get("/maintenance");
            setMaintenanceStats(response.data.maintenanceStats || []);
            setMaintenanceRows(response.data.maintenanceRows || []);
            setVehicles(response.data.vehicles || []);
        } catch (requestError) {
            setFormError(
                requestError.response?.data?.error || "Failed to create maintenance log."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                                Maintenance Logs
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Live maintenance records from MySQL. Only authorized roles can access this page.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsFormOpen(true)}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                        >
                            Add Maintenance Log
                        </button>
                    </div>
                </section>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                        Loading maintenance data...
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {maintenanceStats.map((item) => (
                        <div key={item.label} className={`rounded-2xl px-5 py-4 shadow-sm ${item.className}`}>
                            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{item.label}</p>
                            <p className="mt-2 text-3xl font-bold">{item.value}</p>
                        </div>
                    ))}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-800">Maintenance Records</h2>
                        <p className="mt-1 text-sm text-slate-500">Latest logs, synced with the database.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {maintenanceRows.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{log.vehicle}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{log.serviceType}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{log.cost}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{log.serviceDate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <StatusPill label={log.status} className={log.statusClass} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
                        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Add Maintenance Log</h2>
                                    <p className="mt-1 text-sm text-slate-500">Create a live maintenance record in MySQL.</p>
                                </div>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
                                    Close
                                </button>
                            </div>

                            {formError && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Vehicle</span>
                                    <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white">
                                        <option value="">Select vehicle</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                                {vehicle.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Service Type</span>
                                    <input name="service_type" value={form.service_type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Cost</span>
                                    <input type="number" min="0" name="cost" value={form.cost} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white" />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Service Date</span>
                                    <input type="date" name="service_date" value={form.service_date} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white" />
                                </label>

                                <label className="space-y-2 md:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">Status</span>
                                    <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-orange-400 focus:bg-white">
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </label>

                                <div className="md:col-span-2 mt-2 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                                        {submitting ? "Saving..." : "Save Log"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Maintenance;