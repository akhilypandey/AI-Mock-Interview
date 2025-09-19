# AI Voice Interview App

This is a **Voice-Based AI Mock Interviewer** built with React.  
It simulates an **Excel-related interview**, asks questions via **text-to-speech**, listens to the candidate's **voice responses**, and dynamically adapts questions.

---

## 🚀 Features
- 🎤 **Voice Interview Mode** – No typing, full speech-based interaction.
- ⏸️ **Interrupt Detection** – Candidate can interrupt anytime; the interviewer stops and listens.
- 🔄 **Follow-up Questions** – Generates new questions dynamically based on answers.
- 🛠️ **Developer Transcript Control** – Add new transcripts/questions in a separate `transcripts.js` file.
- 📊 **Interview Report** – Provides structured evaluation at the end.

---

## 📂 Project Structure
```
AI_Voice_Interview_App/
│── App.js            # Main React app
│── transcripts.js    # Add/edit interview transcripts
│── App.css           # UI styling
│── README.md         # Documentation
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the app
```bash
npm start
```

This will launch the app at **http://localhost:3000**

---

## 🛠️ Developer Guide

### ➕ Adding New Questions
Open `transcripts.js` and add your new transcript/question like this:

```javascript
const transcripts = {
  excel: [
    { question: "What is a VLOOKUP and when would you use it?" },
    { question: "Explain the difference between Absolute and Relative cell references." },
    // Add your new ones here 👇
    { question: "What is Power Query in Excel and how is it useful?" }
  ]
};

export default transcripts;
```

The system will automatically pick up new questions.

---

## 🎯 Future Enhancements
- Add scoring logic for answers
- Export interview reports as PDF
- Support multiple domains (SQL, Python, ML)

---

Made with ❤️ using React + Web Speech API
