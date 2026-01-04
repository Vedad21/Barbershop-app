const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // CREATE
    static async create(userData) {
        try {
            const { name, email, password, phone } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, phone]
            );
            
            return { id: result.insertId, name, email, phone };
        } catch (error) {
            throw error;
        }
    }

    // READ ALL
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT id, name, email, phone, created_at FROM users');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // READ BY ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // READ BY EMAIL
    static async findByEmail(email) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // UPDATE
    static async update(id, userData) {
        try {
            const { name, email, phone } = userData;
            
            await db.query(
                'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
                [name, email, phone, id]
            );
            
            return this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    // DELETE
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // COMPARE PASSWORD
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;