import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import VehicleHeader from "../components/vehicles/VehicleHeader";
import VehicleToolbar from "../components/vehicles/VehicleToolbar";
import VehicleTable from "../components/vehicles/VehicleTable";
import AddVehicleModal from "../components/vehicles/AddVehicleModal";

import api from "../services/api";

function Vehicles() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [regNo, setRegNo] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        const response = await api.get("/vehicles");

        if (!isMounted) return;

        setVehicles(response.data.vehicles || []);
        setVehicleStats(response.data.vehicleStats || []);
        setError("");
      } catch (requestError) {
        if (!isMounted) return;

        setError(requestError.response?.data?.error || "Failed to load vehicle data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVehicles();
    const intervalId = window.setInterval(loadVehicles, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleAddVehicle = async (newVehicle) => {
    await api.post("/vehicles", {
      registration_number: newVehicle.regNo,
      vehicle_name: newVehicle.vehicle,
      vehicle_type: newVehicle.type,
      max_load_capacity: Number(newVehicle.capacity),
      odometer: Number(newVehicle.odometer),
      acquisition_cost: Number(newVehicle.acquisitionCost),
      status: newVehicle.status,
    });

    const response = await api.get("/vehicles");
    setVehicles(response.data.vehicles || []);
    setVehicleStats(response.data.vehicleStats || []);

    setIsAddModalOpen(false);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.regNo.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "" || vehicle.type === type;

      const matchesStatus = status === "" || vehicle.status === status;

      const matchesRegNo = vehicle.regNo
        .toLowerCase()
        .includes(regNo.toLowerCase());

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesRegNo
      );
    });
  }, [vehicles, search, type, status, regNo]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <VehicleHeader />

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            Loading vehicle data...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vehicleStats.map((item) => (
            <div key={item.label} className={`rounded-2xl px-5 py-4 shadow-sm ${item.className}`}>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <VehicleToolbar
          search={search}
          type={type}
          status={status}
          regNo={regNo}
          onSearchChange={setSearch}
          onTypeChange={setType}
          onStatusChange={setStatus}
          onRegNoChange={setRegNo}
          onAddVehicle={() => setIsAddModalOpen(true)}
        />

        <AddVehicleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddVehicle}
        />

        <VehicleTable data={filteredVehicles} />
      </div>
    </DashboardLayout>
  );
}

export default Vehicles;