-- 1. Create the Roles Master Table
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL -- 'Fleet Manager', 'Despatcher', etc.
);

-- 2. Create the Users Table linking to Roles
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,                          -- Connects the user to a specific role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    max_load_capacity DECIMAL(10, 2) NOT NULL, -- Stored in kg or lbs
    odometer DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    acquisition_cost DECIMAL(15, 2) NOT NULL,  -- Crucial for the Vehicle ROI calculation later
    status ENUM('Available', 'On Trip', 'In Shop', 'Retired') NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vehicles (registration_number, vehicle_name, vehicle_type, max_load_capacity, odometer, acquisition_cost, status) 
VALUES
    -- Available Vehicles (Ready for Dispatch)
    ('MH-04-AB-1234', 'Tata Ace Gold', 'Mini Truck', 750.00, 12500.00, 14500.00, 'Available'),
    ('MH-43-XY-9876', 'Tata LPT 1109', 'Heavy Truck', 7500.00, 45200.00, 120000.00, 'Available'),
    ('MH-46-CD-5678', 'Eicher Pro 2049', 'Light Truck', 2700.00, 34500.00, 45000.00, 'Available'),
    ('MH-01-EF-1010', 'Maruti Suzuki Eeco Cargo', 'Van', 500.00, 8500.00, 12000.00, 'Available'),
    ('MH-04-GH-2020', 'Tata Signa 2823.T', 'Heavy Truck', 20000.00, 112000.00, 350000.00, 'Available'),
    ('MH-43-JK-3030', 'Mahindra Bolero Maxi Truck', 'Pickup', 1200.00, 18400.00, 21000.00, 'Available'),

    -- In Shop Vehicles (To test that they are hidden from dispatch dropdowns)
    ('MH-04-MN-4567', 'Maruti Suzuki Super Carry', 'Mini Truck', 740.00, 9500.00, 15000.00, 'In Shop'),
    ('MH-46-LM-4040', 'Mahindra Furio 7', 'Light Truck', 4000.00, 56000.50, 60000.00, 'In Shop'),
    
    -- On Trip Vehicles (To test that they cannot be double-booked)
    ('MH-43-PQ-1122', 'Ashok Leyland Dost+', 'Pickup', 1500.00, 67800.25, 23500.00, 'On Trip'),
    ('MH-01-ST-7070', 'BharatBenz 1917R', 'Heavy Truck', 12000.00, 89000.00, 250000.00, 'On Trip'),
    
    -- Retired Vehicles (To test that they are permanently removed from active operations)
    ('MH-04-RS-9999', 'Mahindra Bolero Pik-Up', 'Pickup', 1000.00, 250000.00, 18000.00, 'Retired'),
    ('MH-46-UV-8080', 'Ashok Leyland Partner', 'Light Truck', 3800.00, 310500.00, 42000.00, 'Retired');

CREATE TABLE drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    trip_completion_pct DECIMAL(5, 2) DEFAULT 0.00,
    safety_score INT DEFAULT 100,
    status ENUM('Available', 'On Trip', 'Off Duty', 'Suspended') NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO drivers (driver_name, license_number, license_category, license_expiry, contact_number, trip_completion_pct, safety_score, status) 
VALUES
    -- Available Drivers (Ready for Dispatch)
    ('Alex', 'DL-88213', 'LMV', '2028-12-31', '9876500001', 96.00, 95, 'Available'),
    ('Ramesh', 'DL-55321', 'HMV', '2026-11-05', '9123400005', 92.50, 90, 'Available'),
    ('Anita', 'DL-11223', 'LMV', '2025-05-12', '9988700006', 100.00, 100, 'Available'),
    
    -- Suspended/Expired Drivers (To test that they are blocked from trip assignment)
    ('John', 'DL-44120', 'HMV', '2024-03-15', '9822000002', 81.00, 45, 'Suspended'),
    
    -- On Trip Drivers (To test that they cannot be double-booked)
    ('Priya', 'DL-77031', 'LMV', '2027-08-20', '9911000003', 99.00, 98, 'On Trip'),
    
    -- Off Duty Drivers (To test that they are excluded from active dispatch)
    ('Suresh', 'DL-90045', 'HMV', '2027-01-10', '9744000004', 88.00, 85, 'Off Duty');

CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_reference VARCHAR(20) UNIQUE NOT NULL, 
    source VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    vehicle_id INT DEFAULT NULL, 
    driver_id INT DEFAULT NULL,  
    cargo_weight DECIMAL(10, 2) NOT NULL,
    planned_distance DECIMAL(10, 2) NOT NULL,
    status ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
);

INSERT INTO trips (trip_reference, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) 
VALUES
    -- TR001: Active trip (Matches the 'On Trip' status of Vehicle 9 and Driver 5 from previous dummy data)
    ('TR001', 'Gandhinagar Depot', 'Ahmedabad Hub', 9, 5, 500.00, 45.00, 'Dispatched'),
    
    -- TR004: Draft trip awaiting a driver (Driver is NULL)
    ('TR004', 'Vatva Industrial Area', 'Sanand Warehouse', 1, NULL, 450.00, 25.00, 'Draft'),
    
    -- TR006: Cancelled trip (No vehicle or driver assigned anymore)
    ('TR006', 'Mansa', 'Kalol Depot', NULL, NULL, 1200.00, 60.00, 'Cancelled'),

    -- TR007: A completed historical trip for the analytics dashboard
    ('TR007', 'Surat Facility', 'Navsari Hub', 2, 1, 7000.00, 40.00, 'Completed');

CREATE TABLE maintenance_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    service_date DATE NOT NULL,
    status ENUM('Active', 'Completed') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
);

INSERT INTO maintenance_logs (vehicle_id, service_type, cost, service_date, status) 
VALUES
    -- Active records (These correspond to vehicles 7 and 8 which we previously set to 'In Shop')
    (7, 'Oil Change', 2500.00, '2026-07-07', 'Active'),
    (8, 'Tyre Replace', 6200.00, '2026-07-10', 'Active'),
    
    -- Completed historical record (Vehicle 1 is 'Available', this is just past history for reports)
    (1, 'Engine Repair', 18000.00, '2026-06-15', 'Completed');

CREATE TABLE fuel_logs (
    fuel_log_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    log_date DATE NOT NULL,
    liters DECIMAL(10, 2) NOT NULL,
    fuel_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
);

INSERT INTO fuel_logs (vehicle_id, log_date, liters, fuel_cost) VALUES
(4, '2026-07-05', 42.00, 3150.00),
(2, '2026-07-06', 110.00, 8400.00),
(1, '2026-07-06', 28.00, 2050.00);

CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT DEFAULT NULL,
    vehicle_id INT NOT NULL,
    toll_amount DECIMAL(10, 2) DEFAULT 0.00,
    other_amount DECIMAL(10, 2) DEFAULT 0.00,
    maintenance_log_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (maintenance_log_id) REFERENCES maintenance_logs(log_id) ON DELETE SET NULL
);

INSERT INTO expenses (trip_id, vehicle_id, toll_amount, other_amount, maintenance_log_id) VALUES
(1, 9, 120.00, 0.00, NULL),
(NULL, 2, 340.00, 150.00, 3);
