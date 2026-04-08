import Employee from "../models/employee.js";
import Lead from "../models/leads.js";
import logActivity from "../utils/logActivity.js";


export const addEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);

        // 🔥 assign all unassigned leads
        await Lead.updateMany(
            {
                language: { $regex: `^${employee.language}$`, $options: "i" },
                employeeId: null
            },
            {
                $set: { employeeId: employee._id }
            }
        );
        await logActivity("employee_created", `Employee ${employee.fname} ${employee.lname} was added`);
        res.status(201).json(employee);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add employee" });
    }
};