import { useMemo, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import VehicleHeader from "../components/vehicles/VehicleHeader";
import VehicleToolbar from "../components/vehicles/VehicleToolbar";
import VehicleTable from "../components/vehicles/VehicleTable";
import AddVehicleModal from "../components/vehicles/AddVehicleModal";

import { vehicleData } from "../data/vehicleData";

function Vehicles() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [regNo, setRegNo] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [vehicles, setVehicles] = useState(vehicleData);

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newVehicle,
      },
    ]);

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