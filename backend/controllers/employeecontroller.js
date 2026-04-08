import Employee from "../models/employee.js";
import Lead from "../models/leads.js";
import logActivity from "../utils/logActivity.js";
import bcrypt from "bcrypt";

export const addEmployee = async (req, res) => {
    try {
        const { fname, lname, email, location, language } = req.body;

        // 🔥 hash email as password
        const hashedPassword = await bcrypt.hash(email, 10);

        const employee = await Employee.create({
            fname,
            lname,
            email,
            location,
            language,
            password: hashedPassword
        });

        // assign leads
        await Lead.updateMany(
            {
                language: { $regex: `^${language}$`, $options: "i" },
                employeeId: null
            },
            {
                $set: { employeeId: employee._id }
            }
        );

        await logActivity(
            "employee_created",
            `Employee ${fname} ${lname} was added`
        );

        const { password, ...safeEmployee } = employee.toObject();
        res.status(201).json(safeEmployee);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add employee" });
    }
};