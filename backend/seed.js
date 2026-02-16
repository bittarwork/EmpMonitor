/**
 * Database seed script for EmpMonitor
 * Populates MongoDB with sample data for development and testing
 * Usage: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const Material = require('./models/Material');
const Withdrawal = require('./models/Withdrawal');
const Salary = require('./models/Salary');

// MongoDB connection URI
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/rqt-123';

/**
 * Clear all collections before seeding (optional - set to false to append data)
 */
const CLEAR_BEFORE_SEED = true;

/**
 * Seed admin and test users
 */
async function seedUsers() {
    // Use create() instead of insertMany to trigger pre-save password hashing
    const users = [
        {
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+491234567890',
            email: 'admin@empmonitor.com',
            password: 'Admin123!',
        },
        {
            username: 'manager',
            firstName: 'Manager',
            lastName: 'User',
            phone: '+491234567891',
            email: 'manager@empmonitor.com',
            password: 'Manager123!',
        },
    ];
    const created = await User.create(users);
    console.log(`  ✓ Seeded ${created.length} users`);
    return created;
}

/**
 * Seed materials (inventory items used for withdrawals)
 */
async function seedMaterials() {
    const materials = [
        { name: 'Safety Helmet', price: 15, quantity: 50 },
        { name: 'Work Gloves', price: 5, quantity: 100 },
        { name: 'Safety Boots', price: 45, quantity: 30 },
        { name: 'Uniform Set', price: 35, quantity: 40 },
    ];
    const created = await Material.insertMany(materials);
    console.log(`  ✓ Seeded ${created.length} materials`);
    return created;
}

/**
 * Seed employees with sample contract and rate data
 */
async function seedEmployees() {
    const now = new Date();
    const contractStart = new Date(now.getFullYear(), 0, 1); // Jan 1 current year
    const contractEnd = new Date(now.getFullYear(), 11, 31);   // Dec 31 current year

    const employees = [
        {
            firstName: 'John',
            lastName: 'Smith',
            fingerprint: 'FP001',
            contractStartDate: contractStart,
            contractEndDate: contractEnd,
            hourlyRate: 12.5,
            weeklySalary: 500,
            status: 'active',
        },
        {
            firstName: 'Maria',
            lastName: 'Garcia',
            fingerprint: 'FP002',
            contractStartDate: contractStart,
            contractEndDate: contractEnd,
            hourlyRate: 14,
            weeklySalary: 560,
            status: 'active',
        },
        {
            firstName: 'Ahmed',
            lastName: 'Hassan',
            fingerprint: 'FP003',
            contractStartDate: contractStart,
            contractEndDate: contractEnd,
            hourlyRate: 11,
            weeklySalary: 440,
            status: 'active',
        },
        {
            firstName: 'Anna',
            lastName: 'Mueller',
            fingerprint: 'FP004',
            contractStartDate: contractStart,
            contractEndDate: new Date(now.getFullYear() - 1, 11, 31), // Expired
            hourlyRate: 13,
            weeklySalary: 520,
            status: 'expired',
        },
    ];
    const created = await Employee.insertMany(employees);
    console.log(`  ✓ Seeded ${created.length} employees`);
    return created;
}

/**
 * Seed attendance records (check-in/check-out pairs for salary calculation)
 * ZKTeco stores each check as separate record - pairs form work sessions
 */
async function seedAttendance(employees) {
    const attendances = [];
    const today = new Date();

    // Create 5 days of attendance for first 3 employees
    for (let e = 0; e < Math.min(3, employees.length); e++) {
        const emp = employees[e];
        for (let d = 5; d >= 1; d--) {
            const date = new Date(today);
            date.setDate(date.getDate() - d);
            date.setHours(8, 0, 0, 0);
            const checkIn = new Date(date);
            date.setHours(17, 0, 0, 0);
            const checkOut = new Date(date);

            attendances.push(
                { employee: emp._id, checkTime: checkIn, sourceData: 'ZKTeco-Sync' },
                { employee: emp._id, checkTime: checkOut, sourceData: 'ZKTeco-Sync' }
            );
        }
    }

    const created = await Attendance.insertMany(attendances);
    console.log(`  ✓ Seeded ${created.length} attendance records`);
    return created;
}

/**
 * Seed withdrawals (materials taken by employees)
 */
async function seedWithdrawals(employees, materials) {
    const withdrawals = [
        { employee: employees[0]._id, material: materials[0]._id, quantity: 1, note: 'New helmet' },
        { employee: employees[0]._id, material: materials[1]._id, quantity: 2, note: 'Replacement gloves' },
        { employee: employees[1]._id, material: materials[1]._id, quantity: 1, note: 'Standard issue' },
        { employee: employees[2]._id, material: materials[3]._id, quantity: 1, note: 'Uniform' },
    ];
    const created = await Withdrawal.insertMany(withdrawals);
    console.log(`  ✓ Seeded ${created.length} withdrawals`);
    return created;
}

/**
 * Seed one sample salary record (others are auto-calculated by SalariesScheduler)
 */
async function seedSalary(employees) {
    const emp = employees[0];
    const startDate = new Date(emp.contractStartDate);
    const endDate = new Date(emp.contractEndDate);
    const totalWorkedHours = 45; // 5 days * 9 hours
    const totalSalary = totalWorkedHours * emp.hourlyRate;
    const totalWithdrawals = 25; // 15 + 10
    const finalSalary = totalSalary - totalWithdrawals;

    const salary = await Salary.create({
        employee: emp._id,
        startDate,
        endDate,
        totalWorkedHours,
        hourlyRate: emp.hourlyRate,
        totalSalary,
        totalWithdrawals,
        finalSalary,
        withdrawals: [],
        salaryDate: new Date(),
        paidAmount: 0,
        remainingAmount: finalSalary,
        salarySettled: false,
    });
    console.log(`  ✓ Seeded 1 salary record`);
    return salary;
}

/**
 * Clear all seeded collections
 */
async function clearCollections() {
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Material.deleteMany({});
    await Withdrawal.deleteMany({});
    await Salary.deleteMany({});
    console.log('  ✓ Cleared existing data');
}

/**
 * Main seed runner
 */
async function runSeed() {
    try {
        console.log('\n🌱 EmpMonitor database seed starting...\n');
        await mongoose.connect(DB_URI);

        if (CLEAR_BEFORE_SEED) {
            await clearCollections();
        }

        const users = await seedUsers();
        const materials = await seedMaterials();
        const employees = await seedEmployees();
        await seedAttendance(employees);
        await seedWithdrawals(employees, materials);
        await seedSalary(employees);

        console.log('\n✅ Seed completed successfully!\n');
        console.log('Sample login: admin / Admin123!');
    } catch (err) {
        console.error('\n❌ Seed failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

runSeed();
