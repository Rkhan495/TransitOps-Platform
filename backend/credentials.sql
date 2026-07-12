CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    role ENUM('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst') NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);