import { z } from "zod"

// Role definitions
export type Role = "candidate" | "employee" | "manager" | "hr" | "finance" | "admin"

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["candidate", "employee", "manager", "hr", "finance", "admin"]),
  avatar: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  employeeId: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

// Employee schema
export const EmployeeSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string(),
  department: z.string(),
  manager: z.string().optional(),
  hireDate: z.string(),
  salary: z.number(),
  status: z.enum(["active", "inactive", "terminated"]),
  avatar: z.string().optional(),
})

export type Employee = z.infer<typeof EmployeeSchema>

// Attendance schema
export const AttendanceRecordSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  date: z.string(),
  clockIn: z.string().optional(),
  clockOut: z.string().optional(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional(),
  totalHours: z.number().optional(),
  status: z.enum(["present", "absent", "late", "partial"]),
})

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>

// Leave request schema
export const LeaveRequestSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  type: z.enum(["vacation", "sick", "personal", "maternity", "paternity"]),
  startDate: z.string(),
  endDate: z.string(),
  days: z.number(),
  reason: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  createdAt: z.string(),
})

export type LeaveRequest = z.infer<typeof LeaveRequestSchema>

// Payroll schema
export const PayrollSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  period: z.string(),
  baseSalary: z.number(),
  overtime: z.number(),
  bonuses: z.number(),
  deductions: z.number(),
  netPay: z.number(),
  status: z.enum(["draft", "processed", "paid"]),
  processedAt: z.string().optional(),
})

export type Payroll = z.infer<typeof PayrollSchema>

// Notification schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(["info", "warning", "error", "success"]),
  read: z.boolean(),
  createdAt: z.string(),
})

export type Notification = z.infer<typeof NotificationSchema>
