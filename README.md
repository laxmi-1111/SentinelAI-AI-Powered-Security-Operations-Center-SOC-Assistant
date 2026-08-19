# 🛡️ SentinelAI – AI-Powered SOC Assistant

## 📌 Overview

**SentinelAI** is an AI-powered Security Operations Center (SOC) assistant designed to monitor, analyze, and respond to cybersecurity threats in real time.

The system collects security logs, analyzes user and network activity, detects suspicious behavior using **rule-based detection and machine-learning-based anomaly detection**, assigns a **risk score**, generates alerts, and provides security analysts with an interactive dashboard for investigation and incident management.

### 🔄 System Workflow

```text
Security Logs
      ↓
Log Ingestion
      ↓
Log Parsing & Normalization
      ↓
Detection Engine
   ↙          ↘
Rules        ML Anomaly Detection
   ↘          ↙
Threat Classification
      ↓
Risk Scoring
      ↓
Alert Generation
      ↓
SOC Dashboard
      ↓
Incident Investigation & Management
```

---

## 🎯 Problem

Modern systems generate a huge number of security logs from servers, applications, authentication systems, and network devices.

Manually monitoring these logs makes it difficult for security analysts to:

* Identify threats quickly
* Detect repeated failed login attempts
* Recognize brute-force attacks
* Identify suspicious IP addresses
* Detect unusual user or network behavior
* Prioritize critical security events
* Track and manage incidents efficiently

A large number of logs can also result in **alert fatigue**, where important threats are buried among less important events.

---

## 💡 Solution

SentinelAI provides a centralized SOC platform that automatically processes security logs and identifies potentially malicious activity.

The project combines **deterministic security rules with machine-learning-based anomaly detection**.

For example:

```text
Multiple Failed Logins
          ↓
Detection Engine
          ↓
Brute-Force Detection
          ↓
Risk Score: 91/100
          ↓
Severity: CRITICAL
          ↓
🚨 Alert Generated
          ↓
Analyst Investigation
          ↓
Incident Created
```

The system helps analysts focus on the most important threats instead of manually examining every log.

---

## 🛠️ Technologies Used

### Frontend

* **React.js** – Interactive SOC dashboard
* **JavaScript** – Frontend functionality
* **Recharts** – Security analytics and visualization
* **Axios** – API communication
* **Lucide React** – Dashboard icons

### Backend

* **Python**
* **FastAPI** – REST API and backend services
* **Pydantic** – Data validation

### Database

* **MongoDB** – Storage for logs, alerts, incidents, and user information

### Security & Detection

* **Python** – Detection engine
* **Scikit-learn** – Machine-learning anomaly detection
* **Isolation Forest** – Behavioral anomaly detection
* **JWT** – Authentication
* **Role-Based Access Control (RBAC)** – User permissions

### Development Tools

* **VS Code**
* **Git**
* **GitHub**
* **Postman**

---

## ✨ Features

### 🔍 Real-Time Log Ingestion

Collects and processes security events from simulated or connected log sources.

### 🚨 Brute-Force Detection

Detects repeated failed login attempts from the same source IP within a defined time window.

### 🌐 Suspicious IP Detection

Identifies activity originating from IP addresses with suspicious or malicious reputation.

### 🔎 Port-Scan Detection

Detects unusual attempts to access multiple network ports in a short period.

### 🤖 AI-Based Anomaly Detection

Uses machine learning to identify behavior that deviates significantly from normal activity.

### 📊 Risk Scoring

Assigns each detected threat a score between **0–100** based on factors such as:

* Number of failed logins
* Suspicious IP activity
* Number of targeted accounts
* Network activity
* Previous suspicious behavior

### 🔴 Threat Severity Classification

Threats are categorized as:

```text
0–29    → LOW
30–59   → MEDIUM
60–79   → HIGH
80–100  → CRITICAL
```

### 🔔 Alert Management

Security alerts can be tracked through different states:

```text
OPEN
INVESTIGATING
RESOLVED
FALSE POSITIVE
```

### 📋 Security Log Explorer

Allows analysts to:

* Search logs
* Filter by IP
* Filter by event type
* Filter by severity
* Filter by date/time

### 📝 Incident Management

Analysts can convert important alerts into incidents and track their investigation.

### 📈 Attack Analytics

Dashboard provides visualizations for:

* Attack trends
* Threat severity
* Top attacking IPs
* Failed-login activity
* Incident statistics
* Anomaly trends

### ⚡ Real-Time Dashboard

Displays continuously updated security events, alerts, risk scores, and system status.

### 👤 Analyst Authentication

Supports authentication and role-based access for different SOC users.

### 🧾 Audit Logging

Records important analyst actions for accountability and investigation.

---

### Incident Management

```text
![Incident Management](screenshots/incidents.png)
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sentinelai.git
cd sentinelai
```

### 2. Set Up Backend

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do **not** upload `.env` to GitHub.

### 4. Start Backend

```bash
uvicorn main:app --reload
```

The API will run on:

```text
http://localhost:8000
```

### 5. Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React dashboard will then be available through the local development URL shown by Vite.

### 6. Generate Test Security Events

Run the log simulator:

```bash
python log_generator.py
```

The simulator generates events such as:

```text
Normal Login
Failed Login
Brute Force
Port Scan
Suspicious IP Activity
Anomalous Behavior
```

These events are processed by the detection engine and displayed on the SOC dashboard.

---

## 🚀 Future Improvements

* Integration with real SIEM platforms
* Integration with real security log sources
* Threat-intelligence API integration
* Automated IP blocking
* Email and notification alerts
* Advanced ML threat classification
* MITRE ATT&CK technique mapping
* Automated incident response playbooks
* LLM-powered security investigation assistant
* Cloud deployment
* Kubernetes-based deployment
* Multi-tenant SOC support
* Advanced threat hunting
* Endpoint detection and response integration

---

## 🎓 Learning Outcomes

Through this project, the developer gains practical experience with:

* Security Operations Center workflows
* SIEM concepts
* Log analysis
* Intrusion detection
* Threat classification
* Anomaly detection
* Machine learning
* REST APIs
* Full-stack development
* MongoDB
* Authentication and authorization
* Incident response
* Cybersecurity analytics

---

## 👨‍💻 Author

**Laxmi**

**BE CSE – Cyber Security**

Interested in **Cybersecurity, AI/ML, Full-Stack Development, and Security Operations**.

---

## ⭐ Project Goal

> **Build a practical mini-SOC that transforms raw security logs into actionable threat intelligence, helping analysts detect, prioritize, investigate, and manage cybersecurity incidents efficiently.**
