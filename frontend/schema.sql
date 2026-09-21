CREATE DATABASE IF NOT EXISTS loanplus_db;
USE loanplus_db;

CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    uid_number VARCHAR(20) NOT NULL,
    pan_number VARCHAR(10) NOT NULL,
    cibil_score INT NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
