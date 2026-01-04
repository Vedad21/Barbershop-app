const Service = require('../models/Service');

// CREATE SERVICE - POST
exports.createService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url } = req.body;

        if (!name || !price || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Molimo unesite sva obavezna polja'
            });
        }

        const service = await Service.create({ name, description, price, duration, image_url });

        res.status(201).json({
            success: true,
            message: 'Usluga uspješno kreirana',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri kreiranju usluge',
            error: error.message
        });
    }
};

// GET ALL SERVICES - GET
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        
        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju usluga',
            error: error.message
        });
    }
};

// GET SERVICE BY ID - GET
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Usluga nije pronađena'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju usluge',
            error: error.message
        });
    }
};

// UPDATE SERVICE - PUT
exports.updateService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url } = req.body;
        
        const updatedService = await Service.update(req.params.id, {
            name, description, price, duration, image_url
        });
        
        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: 'Usluga nije pronađena'
            });
        }

        res.json({
            success: true,
            message: 'Usluga uspješno ažurirana',
            data: updatedService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri ažuriranju usluge',
            error: error.message
        });
    }
};

// DELETE SERVICE - DELETE
exports.deleteService = async (req, res) => {
    try {
        const deleted = await Service.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Usluga nije pronađena'
            });
        }

        res.json({
            success: true,
            message: 'Usluga uspješno obrisana'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Greška pri brisanju usluge',
            error: error.message
        });
    }
};