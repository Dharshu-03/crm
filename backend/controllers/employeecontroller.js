import Employee from "../models/employee.js";

export const addEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        console.log("ERROR:", err);

        if (err.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: err.message });
    }
};