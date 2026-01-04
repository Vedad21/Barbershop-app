const db = require('../config/database');

class Appointment {
    // CREATE
    static async create(appointmentData) {
        try {
            const { user_id, service_id, appointment_date, appointment_time, notes } = appointmentData;
            
            const [result] = await db.query(
                'INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, notes) VALUES (?, ?, ?, ?, ?)',
                [user_id, service_id, appointment_date, appointment_time, notes]
            );
            
            return { id: result.insertId, ...appointmentData, status: 'pending' };
        } catch (error) {
            throw error;
        }
    }

    // READ ALL
    static async findAll() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.*,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone,
                    s.name as service_name,
                    s.price as service_price,
                    s.duration as service_duration
                FROM appointments a
                JOIN users u ON a.user_id = u.id
                JOIN services s ON a.service_id = s.id
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // READ BY ID
    static async findById(id) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.*,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone,
                    s.name as service_name,
                    s.price as service_price,
                    s.duration as service_duration
                FROM appointments a
                JOIN users u ON a.user_id = u.id
                JOIN services s ON a.service_id = s.id
                WHERE a.id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // READ BY USER
    static async findByUser(userId) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.*,
                    s.name as service_name,
                    s.price as service_price,
                    s.duration as service_duration
                FROM appointments a
                JOIN services s ON a.service_id = s.id
                WHERE a.user_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
            `, [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // UPDATE
    static async update(id, appointmentData) {
        try {
            const { appointment_date, appointment_time, status, notes } = appointmentData;
            
            await db.query(
                'UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ?, notes = ? WHERE id = ?',
                [appointment_date, appointment_time, status, notes, id]
            );
            
            return this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // DELETE
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Appointment;