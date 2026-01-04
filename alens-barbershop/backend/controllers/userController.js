const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER - POST
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validacija
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Molimo unesite sva obavezna polja'
            });
        }

        // Provjera da li korisnik već postoji
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Korisnik sa ovim emailom već postoji'
            });
        }

        // Kreiranje korisnika
        const user = await User.create({ name, email, password, phone });

        res.status(201).json({
            success: true,
            message: 'Korisnik uspješno registrovan',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri registraciji',
            error: error.message
        });
    }
};

// LOGIN - POST
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacija
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Molimo unesite email i lozinku'
            });
        }

        // Pronalaženje korisnika
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Neispravni pristupni podaci'
            });
        }

        // Provjera lozinke
        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Neispravni pristupni podaci'
            });
        }

        // Generisanje JWT tokena
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Uspješna prijava',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri prijavi',
            error: error.message
        });
    }
};

// GET ALL USERS - GET
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};

// GET USER BY ID - GET
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};

// UPDATE USER - PUT
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        const updatedUser = await User.update(req.params.id, { name, email, phone });
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }

        res.json({
            success: true,
            message: 'Korisnik uspješno ažuriran',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri ažuriranju korisnika',
            error: error.message
        });
    }
};

// DELETE USER - DELETE
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }

        res.json({
            success: true,
            message: 'Korisnik uspješno obrisan'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri brisanju korisnika',
            error: error.message
        });
    }
};
