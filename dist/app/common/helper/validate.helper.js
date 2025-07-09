"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.errors,
        });
    }
};
exports.validate = validate;
