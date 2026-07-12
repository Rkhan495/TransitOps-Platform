import { useState } from "react";
import { X } from "lucide-react";

function AddVehicleModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    regNo: "",
    vehicle: "",
    type: "",
    capacity: "",
    odometer: "",
    acquisitionCost: "",
    status: "Available",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.regNo ||
      !formData.vehicle ||
      !formData.type ||
      !formData.capacity ||
      !formData.odometer ||
      !formData.acquisitionCost
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await onSave(formData);

      setFormData({
        regNo: "",
        vehicle: "",
        type: "",
        capacity: "",
        odometer: "",
        acquisitionCost: "",
        status: "Available",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Add New Vehicle
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter vehicle information below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Registration No.
              </label>

              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Make / Model
              </label>

              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              >
                <option value="">Select Type</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Pickup">Pickup</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Capacity
              </label>

              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Odometer
              </label>

              <input
                type="text"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Acquisition Cost
              </label>

              <input
                type="text"
                name="acquisitionCost"
                value={formData.acquisitionCost}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-2.5 font-medium text-white transition hover:bg-orange-600"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicleModal;