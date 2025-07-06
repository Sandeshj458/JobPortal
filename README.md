# 🧑‍💼 Job Portal - MERN Stack Project

A full-stack **Job Portal Web Application** built using the **MERN Stack** with key features like:
- 🔐 Email-based OTP Authentication
- 🧠 ATS / Manual Resume Screening
- ☁️ Cloud Storage for Resumes & Images
- 🤖 Chatbot Integration via Chatbase
- 🔍 Role-based system: Job Seeker & Recruiter (Admin actions via database)

---

## 🚀 Tech Stack

| Component        | Technology                         |
|-------------|-------------------------------------|
| Frontend     | React.js, Tailwind CSS              |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB Atlas (Cloud)               |
| File Upload  | Cloudinary (resume/image uploads)   |
| Auth         | Email OTP, JWT                      |
| Chatbot      | Chatbase (custom-trained bot)       |

---

## 📌 Live Demo

🔗 [Live Preview](https://jobportal-0nuc.onrender.com/)

---

## 🧩 Key Features

### 🔐 OTP Authentication
- OTP via email for Login, Register, Delete Account, Forgot Password
- OTP expires after 60 seconds
- Max 5 requests in 15 minutes

### 👨‍🎓 Job Seeker
- Profile creation with resume upload
- View and apply to active jobs
- Email alerts for:
  - Job matches
  - Application status
- Account deletion with email notification

### 🧑‍💼 Recruiter
- Register with OTP (admin approval required)
- Post jobs with:
  - Manual screening
  - ATS keyword-based scoring
- Accept/Reject applications (email sent to jobseeker)
- Delete account and all data
- Chatbot support 24/7

### 🛠 Admin (MongoDB Atlas)
- No frontend dashboard
- Manages:
  - Recruiter access approval/block
  - Monitor user/job deletions
- Email alerts on user actions
- Deletion logs stored in `DeletionLog`

### 🤖 Chatbot (Chatbase)
- Trained with FAQs (registration, ATS, posting, etc.)
- Accessible by jobseekers and recruiters

---

## 📥 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sandeshj458/JobPortal1.git
cd JobPortal1


#2 Create a .env file in root directory using this template:

# MongoDB
MONGO_URL=your_mongo_uri
PORT=your_port_number

# JWT Secret
SECRET_KEY=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email for OTP
ADMIN_EMAIL_USER=your_email@gmail.com
ADMIN_EMAIL_PASS=your_app_password

# Chatbase
CHATBASE_SECRET_KEY=your_chatbase_secret_key
VITE_CHATBASE_ID=your_chatbase_id

# Frontend Env
VITE_ADMIN_EMAIL_USER=your_email@gmail.com



# 3. Build and install all dependencies (backend + frontend)
npm run build


# 4. Run in Production Mode (backend + built frontend)
npm run start


# 5. Open any Browser and type

# 🧑‍💼 Job Portal - MERN Stack Project

A full-stack **Job Portal Web Application** built using the **MERN Stack** with key features like:
- 🔐 Email-based OTP Authentication
- 🧠 ATS / Manual Resume Screening
- ☁️ Cloud Storage for Resumes & Images
- 🤖 Chatbot Integration via Chatbase
- 🔍 Role-based system: Job Seeker & Recruiter (Admin actions via database)

---

## 🚀 Tech Stack

| Component        | Technology                         |
|-------------|-------------------------------------|
| Frontend     | React.js, Tailwind CSS              |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB Atlas (Cloud)               |
| File Upload  | Cloudinary (resume/image uploads)   |
| Auth         | Email OTP, JWT                      |
| Chatbot      | Chatbase (custom-trained bot)       |

---

## 📌 Live Demo

🔗 [Live Preview](https://your-live-url.com)

---

## 🧩 Key Features

### 🔐 OTP Authentication
- OTP via email for Login, Register, Delete Account, Forgot Password
- OTP expires after 60 seconds
- Max 5 requests in 15 minutes

### 👨‍🎓 Job Seeker
- Profile creation with resume upload
- View and apply to active jobs
- Email alerts for:
  - Job matches
  - Application status
- Account deletion with email notification

### 🧑‍💼 Recruiter
- Register with OTP (admin approval required)
- Post jobs with:
  - Manual screening
  - ATS keyword-based scoring
- Accept/Reject applications (email sent to jobseeker)
- Delete account and all data
- Chatbot support 24/7

### 🛠 Admin (MongoDB Atlas)
- No frontend dashboard
- Manages:
  - Recruiter access approval/block
  - Monitor user/job deletions
- Email alerts on user actions
- Deletion logs stored in `DeletionLog`

### 🤖 Chatbot (Chatbase)
- Trained with FAQs (registration, ATS, posting, etc.)
- Accessible by jobseekers and recruiters

---

## 📥 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sandeshj458/JobPortal.git
cd JobPortal


#2 Create a .env file in root directory using this template:

# MongoDB
MONGO_URL=your_mongo_uri
PORT=your_port_number

# JWT Secret
SECRET_KEY=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email for OTP
ADMIN_EMAIL_USER=your_email@gmail.com
ADMIN_EMAIL_PASS=your_app_password

# Chatbase
CHATBASE_SECRET_KEY=your_chatbase_secret_key
VITE_CHATBASE_ID=your_chatbase_id

# Frontend Env
VITE_ADMIN_EMAIL_USER=your_email@gmail.com



# 3. Build and install all dependencies (backend + frontend)
npm run build

# 4. Run in Development Mode (recommended while building)
npm run dev

OR

# Run in Production Mode (backend + built frontend)
npm run start



# 5. Open any Browser and type

https://jobportal-0nuc.onrender.com/

