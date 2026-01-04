const db = require('../config/database');

class Service {
    // CREATE
    static async create(serviceData) {
        try {
            const { name, description, price, duration, image_url } = serviceData;
            
            const [result] = await db.query(
                'INSERT INTO services (name, description, price, duration, image_url) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, duration, image_url]
            );
            
            return { id: result.insertId, ...serviceData };
        } catch (error) {
            throw error;
        }
    }

    // READ ALL
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM services ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // READ BY ID
    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // UPDATE
    static async update(id, serviceData) {
        try {
            const { name, description, price, duration, image_url } = serviceData;
            
            await db.query(
                'UPDATE services SET name = ?, description = ?, price = ?, duration = ?, image_url = ? WHERE id = ?',
                [name, description, price, duration, image_url, id]
            );
            
            return this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // DELETE
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service;