# QRAT - QR Attendance System

A modern, full-stack QR Code-based Attendance System built with the MERN stack (MongoDB, Express, React, Node.js).  
Designed for educational institutions and organizations to streamline attendance with security, analytics, and a beautiful UI.

---

## 🚀 Features

- **QR Code Attendance:** Generate and scan QR codes for instant, secure attendance marking.
- **Role-Based Access:** Admin, Teacher, and Student roles with tailored dashboards.
- **Admin Dashboard:** Real-time analytics, animated charts, and leaderboards.
- **Geolocation & Face Recognition:** Optional location and face checks for secure attendance.
- **Offline Support:** Mark attendance offline and sync when online.
- **Gamification:** Streaks, badges, and leaderboards to boost engagement.
- **Bulk Import/Export:** Manage users and sessions via CSV, export data to CSV/Excel.
- **Google OAuth & 2FA:** Secure login with Google and two-factor authentication for admins.
- **Accessibility & i18n:** Dark/light mode, keyboard navigation, and multi-language support.
- **Audit Logs:** Track all critical actions for transparency and security.

---

## 🖥️ Tech Stack

- **Frontend:** React, Bootstrap, Chart.js, Bootstrap Icons
- **Backend:** Node.js, Express, MongoDB, JWT, Multer
- **Other:** Google OAuth, 2FA, PWA-ready

---

## 📸 Screenshots

> _Add screenshots or GIFs here to showcase the UI and features!_

---

## ⚙️ Setup & Installation

### 1. **Clone the repository**
```bash
git clone https://github.com/Kushagrashandilya647/QRAT.git
cd QRAT
```

### 2. **Backend Setup**
```bash
cd server
cp .env.example .env   # Create your .env file and fill in values
npm install
npm run dev
```

### 3. **Frontend Setup**
```bash
cd client
npm install
npm start
```

---

## 👤 Roles

- **Admin:** Create/manage sessions, view analytics, manage users, export data, review correction requests.
- **Teacher:** (If enabled) Manage sessions and attendance for their classes.
- **Student:** Scan QR, view attendance history, request corrections, earn badges.

---

## 📦 Folder Structure

```
QRAT/
├── client/   # React frontend
├── server/   # Express backend
├── README.md
├── .gitignore
└── ...
```

---

## 🛡️ Security

- JWT authentication
- Google OAuth login
- Two-factor authentication (2FA) for admins
- Audit logs for all critical actions

---

## 🌍 Accessibility & Internationalization

- Fully keyboard accessible
- High-contrast dark/light modes
- Multi-language support (i18n-ready)

---

## 📄 License

[MIT](LICENSE)

---

## 🙌 Contributions

Pull requests and feature suggestions are welcome!

---

## 📫 Contact

For questions or support, open an issue or contact [Kushagrashandilya647](https://github.com/Kushagrashandilya647).
