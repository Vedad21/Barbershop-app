const Appointment = require('../models/Appointment');

// CREATE APPOINTMENT - POST
exports.createAppointment = async (req, res) => {
    try {
        const { user_id, service_id, appointment_date, appointment_time, notes } = req.body;

        if (!user_id || !service_id || !appointment_date || !appointment_time) {
            return res.status(400).json({
                success: false,
                message: 'Molimo unesite sva obavezna polja'
            });
        }

        const appointment = await Appointment.create({
            user_id, service_id, appointment_date, appointment_time, notes
        });

        res.status(201).json({
            success: true,
            message: 'Termin uspješno kreiran',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri kreiranju termina',
            error: error.message
        });
    }
};

// GET ALL APPOINTMENTS - GET
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        
        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju termina',
            error: error.message
        });
    }
};

// GET APPOINTMENT BY ID - GET
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Termin nije pronađen'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju termina',
            error: error.message
        });
    }
};

// GET APPOINTMENTS BY USER - GET
exports.getAppointmentsByUser = async (req, res) => {
    try {
        const appointments = await Appointment.findByUser(req.params.userId);
        
        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju termina',
            error: error.message
        });
    }
};

// UPDATE APPOINTMENT - PUT
exports.updateAppointment = async (req, res) => {
    try {
        const { appointment_date, appointment_time, status, notes } = req.body;
        
        const updatedAppointment = await Appointment.update(req.params.id, {
            appointment_date, appointment_time, status, notes
        });
        
        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Termin nije pronađen'
            });
        }

        res.json({
            success: true,
            message: 'Termin uspješno ažuriran',
            data: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri ažuriranju termina',
            error: error.message
        });
    }
};

// DELETE APPOINTMENT - DELETE
exports.deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Termin nije pronađen'
            });
        }

        res.json({
            success: true,
            message: 'Termin uspješno obrisan'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri brisanju termina',
            error: error.message
        });
    }
};