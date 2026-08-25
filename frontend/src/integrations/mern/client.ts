// Client-side local storage MERN simulator
// Completely removes backend dependencies, executing all queries and authentication locally in-memory and in localStorage.

export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  raw_user_meta_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// Global hook to trigger query refreshes via window events
function triggerLocalSocketNotification(notif: { title: string; message: string }) {
  const event = new CustomEvent("mock-socket-notification", { detail: notif });
  window.dispatchEvent(event);
}

// Helpers for UUID generation
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to get session from localStorage
function getSessionSync(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("mock_session");
  return raw ? JSON.parse(raw) : null;
}

// Initial seed data
const initialSeedData: Record<string, any[]> = {
  users: [
    {
      id: "user-admin-uuid",
      email: "admin@pgc.edu",
      password: "admin",
      name: "Administrator",
      raw_user_meta_data: { role: "admin" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user-teacher-uuid",
      email: "teacher@pgc.edu",
      password: "teacher",
      name: "Dr. Muhammad Ali",
      raw_user_meta_data: { role: "teacher" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user-student-uuid",
      email: "student@pgc.edu",
      password: "student",
      name: "Haris Ahmed",
      raw_user_meta_data: { role: "student" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user-student-2-uuid",
      email: "zainab@pgc.edu",
      password: "student",
      name: "Zainab Fatima",
      raw_user_meta_data: { role: "student" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  user_roles: [
    { id: "role-1", user_id: "user-admin-uuid", role: "admin" },
    { id: "role-2", user_id: "user-teacher-uuid", role: "teacher" },
    { id: "role-3", user_id: "user-student-uuid", role: "student" },
    { id: "role-4", user_id: "user-student-2-uuid", role: "student" },
  ],
  departments: [
    { id: "dept-cs-uuid", name: "Computer Science", code: "CS" },
    { id: "dept-se-uuid", name: "Software Engineering", code: "SE" },
    { id: "dept-it-uuid", name: "Information Technology", code: "IT" },
  ],
  degrees: [
    { id: "deg-1", code: "BSCS", name: "BS Computer Science", level: "Bachelor", duration_years: 4 },
    { id: "deg-2", code: "BSSE", name: "BS Software Engineering", level: "Bachelor", duration_years: 4 },
    { id: "deg-3", code: "BSIT", name: "BS Information Technology", level: "Bachelor", duration_years: 4 },
  ],
  teachers: [
    {
      id: "teacher-1-uuid",
      user_id: "user-teacher-uuid",
      employee_id: "EMP001",
      full_name: "Dr. Muhammad Ali",
      email: "teacher@pgc.edu",
      phone: "+92 300 1234567",
      department_id: "dept-cs-uuid",
      qualification: "Ph.D. in Computer Science",
      salary: 150000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "teacher-2-uuid",
      user_id: null,
      employee_id: "EMP002",
      full_name: "Prof. Ayesha Khan",
      email: "ayesha@pgc.edu",
      phone: "+92 321 7654321",
      department_id: "dept-se-uuid",
      qualification: "MS in Software Engineering",
      salary: 120000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  students: [
    {
      id: "student-1-uuid",
      user_id: "user-student-uuid",
      roll_number: "CS-2023-01",
      full_name: "Haris Ahmed",
      email: "student@pgc.edu",
      phone: "+92 333 9876543",
      department_id: "dept-cs-uuid",
      degree: "BS Computer Science",
      semester: 6,
      address: "123 Main Canal Road, Lahore",
      image_url: "",
      courses: ["CS-301", "CS-302"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "student-2-uuid",
      user_id: "user-student-2-uuid",
      roll_number: "SE-2023-02",
      full_name: "Zainab Fatima",
      email: "zainab@pgc.edu",
      phone: "+92 345 1122334",
      department_id: "dept-se-uuid",
      degree: "BS Software Engineering",
      semester: 6,
      address: "Model Town, Lahore",
      image_url: "",
      courses: ["CS-301"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  courses: [
    {
      id: "course-cs301-uuid",
      code: "CS-301",
      title: "Software Engineering",
      credit_hours: 3,
      semester: 6,
      degree: "BSCS",
      department_id: "dept-cs-uuid",
      teacher_id: "teacher-1-uuid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "course-cs302-uuid",
      code: "CS-302",
      title: "Web Development",
      credit_hours: 3,
      semester: 6,
      degree: "BSCS",
      department_id: "dept-cs-uuid",
      teacher_id: "teacher-1-uuid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "course-cs303-uuid",
      code: "CS-303",
      title: "Final Year Project - I",
      credit_hours: 3,
      semester: 7,
      degree: "BSCS",
      department_id: "dept-cs-uuid",
      teacher_id: "teacher-1-uuid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  attendance: [
    { id: "att-1", date: "2026-08-24", student_id: "student-1-uuid", course_id: "CS-301", status: "present" },
    { id: "att-2", date: "2026-08-24", student_id: "student-1-uuid", course_id: "CS-302", status: "present" },
    { id: "att-3", date: "2026-08-25", student_id: "student-1-uuid", course_id: "CS-301", status: "late" },
    { id: "att-4", date: "2026-08-25", student_id: "student-1-uuid", course_id: "CS-302", status: "absent" },
  ],
  timetables: [
    {
      id: "timetable-1",
      day: "Monday",
      slot: "09:00 - 10:30",
      room: "Lab 3",
      course_id: "CS-301",
      teacher_id: "teacher-1-uuid",
      department_id: "dept-cs-uuid",
    },
    {
      id: "timetable-2",
      day: "Tuesday",
      slot: "11:00 - 12:30",
      room: "Room 102",
      course_id: "CS-302",
      teacher_id: "teacher-1-uuid",
      department_id: "dept-cs-uuid",
    },
    {
      id: "timetable-3",
      day: "Wednesday",
      slot: "09:00 - 10:30",
      room: "Lab 3",
      course_id: "CS-301",
      teacher_id: "teacher-1-uuid",
      department_id: "dept-cs-uuid",
    },
  ],
  fees: [
    {
      id: "fee-1",
      student_id: "student-1-uuid",
      amount: 45000,
      status: "paid",
      due_date: "2026-09-01",
      paid_date: "2026-08-15",
      description: "Semester 6 Tuition Fee",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fee-2",
      student_id: "student-2-uuid",
      amount: 45000,
      status: "pending",
      due_date: "2026-09-01",
      description: "Semester 6 Tuition Fee",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  complaints: [
    {
      id: "complaint-1",
      student_id: "student-1-uuid",
      title: "Lab AC Not Working",
      category: "Infrastructure",
      description: "The air conditioner in CS Lab 3 has been out of order for 3 days. It gets very hot during morning lectures.",
      status: "pending",
      reply: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  fyp_groups: [
    {
      id: "fyp-group-1",
      group_name: "Web Portal for PGC",
      title: "Automated College Management System Web Portal",
      abstract: "Designing and developing a unified React and PHP MERN portal to handle college registries, timetables, FYP supervision, and student notifications.",
      supervisor_id: "teacher-1-uuid",
      members: ["Haris Ahmed", "Zainab Fatima"],
      status: "approved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  fyp_submissions: [
    {
      id: "fyp-sub-1",
      group_id: "fyp-group-1",
      title: "FYP Proposal Document",
      file_name: "proposal_document.pdf",
      file_path: "/uploads/mock_proposal.pdf",
      github_link: "https://github.com/haris-ahmed/pgc-portal-fyp",
      submitted_at: "2026-08-20",
      grade: "A",
      comments: "Excellent system architecture diagram and timeline scheduling.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  notifications: [
    {
      id: "notif-1",
      user_id: "student@pgc.edu",
      title: "Fee Payment Received",
      message: "Your payment of Rs. 45,000 for Semester 6 Tuition Fee has been approved.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "notif-2",
      user_id: "teacher@pgc.edu",
      title: "New FYP Submission Uploaded",
      message: "Group 'Web Portal for PGC' has uploaded proposal_document.pdf for review.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "notif-3",
      user_id: "admin@pgc.edu",
      title: "New Complaint Ticket Received",
      message: "Haris Ahmed submitted a complaint ticket: 'Lab AC Not Working'.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Initialize localStorage if empty
function initializeMockDatabase() {
  if (typeof window === "undefined") return;
  const isInitialized = localStorage.getItem("mock_db_initialized");
  if (!isInitialized) {
    Object.keys(initialSeedData).forEach((table) => {
      localStorage.setItem(`mock_db_${table}`, JSON.stringify(initialSeedData[table]));
    });
    localStorage.setItem("mock_db_initialized", "true");
  }
}
initializeMockDatabase();

// Internal helpers to access table data
export function getTableData(table: string): any[] {
  initializeMockDatabase();
  const raw = localStorage.getItem(`mock_db_${table}`);
  return raw ? JSON.parse(raw) : [];
}

export function setTableData(table: string, data: any[]) {
  localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));
}

// Query builder for local mock data
class MockQueryBuilder {
  private table: string;
  private filterParams: Record<string, any> = {};
  private selectColumns: string | null = null;
  private selectOptions?: { count?: string; head?: boolean };
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitCount: number | null = null;
  private operationPromise: (() => Promise<any>) | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string, options?: { count?: string; head?: boolean }) {
    this.selectColumns = columns ?? "*";
    this.selectOptions = options;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }

  eq(column: string, value: any) {
    this.filterParams[column] = value;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  insert(data: any) {
    this.operationPromise = async () => {
      try {
        const tableData = getTableData(this.table);
        const newRecord = {
          id: data.id || generateUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tableData.push(newRecord);
        setTableData(this.table, tableData);

        // If insert notification, trigger event
        if (this.table === "notifications") {
          triggerLocalSocketNotification({
            title: newRecord.title || "Notification",
            message: newRecord.message || "",
          });
        }

        return { data: newRecord, error: null, count: 1 };
      } catch (error: any) {
        return { data: null, error: { message: error.message }, count: null };
      }
    };
    return this;
  }

  update(data: any) {
    this.operationPromise = async () => {
      try {
        const tableData = getTableData(this.table);
        let updatedCount = 0;
        const updatedRecords: any[] = [];

        const nextData = tableData.map((item) => {
          let matches = true;
          for (const [col, val] of Object.entries(this.filterParams)) {
            if (String(item[col] ?? "").toLowerCase() !== String(val ?? "").toLowerCase()) {
              matches = false;
              break;
            }
          }
          if (matches) {
            updatedCount++;
            const updated = {
              ...item,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            updatedRecords.push(updated);
            return updated;
          }
          return item;
        });

        setTableData(this.table, nextData);

        return {
          data: updatedRecords.length === 1 ? updatedRecords[0] : updatedRecords,
          error: null,
          count: updatedCount,
        };
      } catch (error: any) {
        return { data: null, error: { message: error.message }, count: null };
      }
    };
    return this;
  }

  delete() {
    this.operationPromise = async () => {
      try {
        const tableData = getTableData(this.table);
        let deletedCount = 0;

        const nextData = tableData.filter((item) => {
          let matches = true;
          for (const [col, val] of Object.entries(this.filterParams)) {
            if (String(item[col] ?? "").toLowerCase() !== String(val ?? "").toLowerCase()) {
              matches = false;
              break;
            }
          }
          if (matches) {
            deletedCount++;
            return false; // exclude
          }
          return true; // keep
        });

        setTableData(this.table, nextData);
        return { data: null, error: null, count: deletedCount };
      } catch (error: any) {
        return { data: null, error: { message: error.message }, count: null };
      }
    };
    return this;
  }

  then(onfulfilled?: (value: any) => any) {
    if (this.operationPromise) {
      return this.operationPromise().then(onfulfilled);
    }

    const runQuery = async () => {
      try {
        let items = getTableData(this.table);

        // Apply filters
        items = items.filter((item) => {
          for (const [col, val] of Object.entries(this.filterParams)) {
            const itemVal = item[col];
            if (Array.isArray(itemVal) && typeof val === "string") {
              // Array overlap or contains check
              if (!itemVal.includes(val)) return false;
            } else if (String(itemVal ?? "").toLowerCase() !== String(val ?? "").toLowerCase()) {
              return false;
            }
          }
          return true;
        });

        // Apply ordering
        if (this.orderCol) {
          const col = this.orderCol;
          const asc = this.orderAsc;
          items.sort((a, b) => {
            const valA = a[col];
            const valB = b[col];
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
          });
        }

        // Apply limit
        if (this.limitCount !== null) {
          items = items.slice(0, this.limitCount);
        }

        // Select specific columns if selectColumns is not *
        if (this.selectColumns && this.selectColumns !== "*") {
          const cols = this.selectColumns.split(",").map((c) => c.trim());
          items = items.map((item) => {
            const obj: any = {};
            cols.forEach((col) => {
              obj[col] = item[col];
            });
            return obj;
          });
        }

        return { data: items, error: null, count: items.length };
      } catch (error: any) {
        console.error(`Error querying ${this.table}:`, error);
        return { data: [], count: 0, error: { message: error.message } };
      }
    };

    return runQuery().then(onfulfilled);
  }
}

export const authCallbacks: Array<(event: string, session: Session | null) => void> = [];

export const mern = {
  auth: {
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
      authCallbacks.push(callback);
      const session = getSessionSync();
      setTimeout(() => {
        callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);
      }, 0);
      return {
        data: {
          subscription: {
            unsubscribe() {
              const idx = authCallbacks.indexOf(callback);
              if (idx !== -1) authCallbacks.splice(idx, 1);
            },
          },
        },
      };
    },

    async getSession() {
      return { data: { session: getSessionSync() }, error: null };
    },

    setSession(token: string) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window.atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        const session: Session = {
          access_token: token,
          token_type: "bearer",
          expires_in: 604800,
          user: {
            id: payload.id || payload.sub || "mock-user-id",
            email: payload.email,
            raw_user_meta_data: {
              ...(payload.user_metadata || {}),
              role: payload.role,
            },
          },
        };
        localStorage.setItem("mock_session", JSON.stringify(session));
        authCallbacks.forEach((cb) => cb("SIGNED_IN", session));
      } catch (e) {
        console.error("Failed to set session from token:", e);
      }
    },

    async signUp({ email, password, options }: any) {
      try {
        const users = getTableData("users");
        const userRoles = getTableData("user_roles");

        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return {
            data: { user: null, session: null },
            error: { message: "An account with this email already exists" },
          };
        }

        const userId = generateUUID();
        const role = options?.data?.role || "student";

        const newUser = {
          id: userId,
          email,
          password,
          name: options?.data?.full_name || email.split("@")[0],
          raw_user_meta_data: { role, ...options?.data },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        setTableData("users", users);

        const newRole = {
          id: generateUUID(),
          user_id: userId,
          role,
        };
        userRoles.push(newRole);
        setTableData("user_roles", userRoles);

        // Populate student or teacher table based on role
        if (role === "student") {
          const students = getTableData("students");
          students.push({
            id: generateUUID(),
            user_id: userId,
            roll_number: options?.data?.roll_number || `ST-${Math.floor(1000 + Math.random() * 9000)}`,
            full_name: options?.data?.full_name || newUser.name,
            email: email,
            phone: options?.data?.phone || "",
            department_id: options?.data?.department_id || "dept-cs-uuid",
            degree: options?.data?.degree || "BS Computer Science",
            semester: 1,
            courses: [],
          });
          setTableData("students", students);
        } else if (role === "teacher") {
          const teachers = getTableData("teachers");
          teachers.push({
            id: generateUUID(),
            user_id: userId,
            employee_id: options?.data?.employee_id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
            full_name: options?.data?.full_name || newUser.name,
            email: email,
            phone: options?.data?.phone || "",
            department_id: options?.data?.department_id || "dept-cs-uuid",
            qualification: options?.data?.qualification || "",
            salary: 80000,
          });
          setTableData("teachers", teachers);
        }

        const session: Session = {
          access_token: `mock-jwt-token-for-${userId}`,
          token_type: "bearer",
          expires_in: 604800,
          user: {
            id: userId,
            email: newUser.email,
            raw_user_meta_data: newUser.raw_user_meta_data,
          },
        };

        localStorage.setItem("mock_session", JSON.stringify(session));
        authCallbacks.forEach((cb) => cb("SIGNED_IN", session));

        return { data: { user: newUser, session }, error: null };
      } catch (error: any) {
        return { data: { user: null, session: null }, error: { message: error.message } };
      }
    },

    async signInWithPassword({ email, password }: any) {
      try {
        let users = getTableData("users");
        let user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          // Auto-create user on the fly!
          const userId = generateUUID();
          let role = "student";
          if (email.toLowerCase().includes("admin")) {
            role = "admin";
          } else if (email.toLowerCase().includes("teacher")) {
            role = "teacher";
          }

          const userName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
          user = {
            id: userId,
            email: email,
            password: password || "password",
            name: userName,
            raw_user_meta_data: { role },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          users.push(user);
          setTableData("users", users);

          // Create user_role
          const userRoles = getTableData("user_roles");
          userRoles.push({
            id: generateUUID(),
            user_id: userId,
            role,
          });
          setTableData("user_roles", userRoles);

          // Create profile
          if (role === "student") {
            const students = getTableData("students");
            students.push({
              id: generateUUID(),
              user_id: userId,
              roll_number: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
              full_name: userName,
              email: email,
              phone: "+92 300 0000000",
              department_id: "dept-cs-uuid",
              degree: "BS Computer Science",
              semester: 6, // default to semester 6 to show stats
              address: "PGC Campus, Lahore",
              image_url: "",
              courses: ["CS-301", "CS-302"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setTableData("students", students);
          } else if (role === "teacher") {
            const teachers = getTableData("teachers");
            teachers.push({
              id: generateUUID(),
              user_id: userId,
              employee_id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
              full_name: userName,
              email: email,
              phone: "+92 300 0000000",
              department_id: "dept-cs-uuid",
              qualification: "Ph.D. in Computer Science",
              salary: 100000,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setTableData("teachers", teachers);
          }
        }

        const session: Session = {
          access_token: `mock-jwt-token-for-${user.id}`,
          token_type: "bearer",
          expires_in: 604800,
          user: {
            id: user.id,
            email: user.email,
            raw_user_meta_data: user.raw_user_meta_data,
          },
        };

        localStorage.setItem("mock_session", JSON.stringify(session));
        authCallbacks.forEach((cb) => cb("SIGNED_IN", session));

        return { data: { session, user }, error: null };
      } catch (error: any) {
        return { data: { session: null, user: null }, error: { message: error.message } };
      }
    },

    async changePassword({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) {
      try {
        const session = getSessionSync();
        if (!session) return { data: null, error: { message: "Not authenticated" } };

        const users = getTableData("users");
        const userIdx = users.findIndex((u) => u.id === session.user.id);
        if (userIdx === -1) return { data: null, error: { message: "User not found" } };

        if (users[userIdx].password !== oldPassword) {
          return { data: null, error: { message: "Incorrect current password" } };
        }

        users[userIdx].password = newPassword;
        users[userIdx].updatedAt = new Date().toISOString();
        setTableData("users", users);

        return { data: { success: true }, error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },

    async resetPassword({ email, newPassword }: any) {
      try {
        const users = getTableData("users");
        const userIdx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
        if (userIdx === -1) {
          return { data: null, error: { message: "No account found with this email" } };
        }

        users[userIdx].password = newPassword || "123456"; // Default or user new password
        users[userIdx].updatedAt = new Date().toISOString();
        setTableData("users", users);

        return { data: { success: true }, error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },

    async signOut() {
      localStorage.removeItem("mock_session");
      authCallbacks.forEach((cb) => cb("SIGNED_OUT", null));
      return { error: null };
    },
  },

  from(table: string) {
    return new MockQueryBuilder(table);
  },
};
