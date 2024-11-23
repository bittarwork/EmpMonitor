const fs = require('fs');
const xml2js = require('xml2js');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const moment = require('moment');
const uploadAttendance = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const xmlData = fs.readFileSync(filePath, 'utf8');

        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(xmlData);

        if (!parsedData.DATAPACKET || !parsedData.DATAPACKET.ROWDATA || !parsedData.DATAPACKET.ROWDATA.ROW) {
            return res.status(400).json({ message: 'Invalid XML structure: Missing ROW data' });
        }

        const rows = parsedData.DATAPACKET.ROWDATA.ROW;
        const attendanceRecords = Array.isArray(rows) ? rows : [rows];
        let addedRecordsCount = 0;

        for (const row of attendanceRecords) {
            const { Name, PIN, CHECKTIME } = row.$ || {};

            if (!PIN) {
                continue;
            }

            const employee = await Employee.findOne({ fingerprint: String(PIN).trim() });
            if (!employee) {
                continue;
            }

            // Convert the CHECKTIME to a valid date format
            const checkTime = moment(CHECKTIME, 'DD/MM/YYYY h:mm a').toDate();

            if (isNaN(checkTime.getTime())) {
                continue;
            }

            const existingAttendance = await Attendance.findOne({
                employee: employee._id,
                checkTime,
            });

            if (!existingAttendance) {
                const attendance = new Attendance({
                    employee: employee._id,
                    checkTime,
                    sourceData: JSON.stringify(row),
                });

                await attendance.save();
                addedRecordsCount++;
            }
        }

        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'Attendance records processed successfully',
            addedRecordsCount,
        });
    } catch (error) {
        console.error('Error processing attendance:', error);
        res.status(500).json({ message: 'An error occurred while processing the file', error: error.message });
    }
};


// جلب جميع السجلات
const getAllAttendances = async (req, res) => {
    try {
        const attendances = await Attendance.find().populate('employee', 'firstName lastName');
        res.status(200).json({
            message: 'Attendance records fetched successfully',
            attendances,
        });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'An error occurred while fetching attendance records', error: error.message });
    }
};

module.exports = {
    uploadAttendance,
    getAllAttendances,
};
