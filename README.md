
## 🚀 Overview
This project is a **real-time chat application** built using **Node.js**, **Express**, **Socket.io**, and **React (Vite + Tailwind v4)**.  
It demonstrates **bidirectional communication** between the client and server, enabling users to send and receive messages instantly.  

The app includes features like:
- Global chat rooms
- Online/offline indicators
- Typing notifications (in progress)
- Message reactions
- Loading older messages (in progress)
- Responsive, modern UI using Tailwind CSS

---

## 🧠 Learning Objective
To understand and apply **real-time web communication concepts** using Socket.io, including:
- Event-based messaging
- Room and namespace management
- Broadcasting and private messaging
- Handling disconnections and reconnections

---

## 🏗️ Project Structure

```

socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main app entry
│   └── package.json        # Client dependencies
│
├── server/                 # Node.js back-end
│   ├── config/             # Config files (e.g. env setup)
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models (e.g. Message, User)
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Helper utilities
│   ├── server.js           # Main server entry point
│   └── package.json        # Server dependencies
│
└── README.md               # Project documentation

````

---

## ⚙️ Installation & Setup

### 🖥️ Prerequisites
- Node.js v18+ (recommended)
- npm or yarn

### 🔧 Steps

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/socketio-chat.git
cd socketio-chat
````

#### 2️⃣ Install server dependencies

```bash
cd server
npm install
```

#### 3️⃣ Install client dependencies

```bash
cd ../client
npm install
```

#### 4️⃣ Start both servers

**Server:**

```bash
cd ../server
npm run dev
```

**Client:**

```bash
cd ../client
npm run dev
```

Visit:
👉 **[http://localhost:5173](http://localhost:5173)** (Client)
👉 **[http://localhost:5000](http://localhost:5000)** (API/Socket Server)

---

## 💡 Core Features

| Feature                               | Description                                                     |
| ------------------------------------- | --------------------------------------------------------------- |
| 💬 Global Chat                        | All connected users can chat in a shared room                   |
| 👥 User Join/Leave Notifications      | Users are notified when someone joins or exits                  |
| 🔄 Real-Time Messaging                | Messages appear instantly without reload                        |
| ❤️ Message Reactions                  | Add emoji reactions to any message                              |
| ✍️ Typing Indicator *(in progress)*   | Displays “User is typing…” in real-time                         |
| ⏫ Load Older Messages *(in progress)* | Loads previous chats when user scrolls up or clicks “Load More” |
| 🟢 Online Users                       | Displays who’s currently active                                 |
| 📱 Responsive Design                  | Optimized for both desktop and mobile screens                   |

---

## 🧩 Technology Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| **Frontend**   | React + Vite + Tailwind CSS v4 |
| **Backend**    | Node.js + Express              |
| **Real-Time**  | Socket.io                      |
| **Styling**    | Tailwind CSS                   |
| **State Mgmt** | React Context API              |
| **Icons**      | Heroicons / Emoji              |

---

## 🧪 How It Works

1. Each client connects to the **Socket.io server**.
2. When a message is sent, the server emits it to **all clients** in the same room.
3. Events like `typing`, `message_reaction`, and `join_room` are handled via Socket.io listeners.
4. UI updates in real-time using React state hooks.

---
## 📸 Screenshots (Optional)

<img width="1219" height="716" alt="week5" src="https://github.com/user-attachments/assets/e2b73370-bcd2-4bc6-b3b0-b5b130992d7d" />



<img width="1289" height="560" alt="week5-2" src="https://github.com/user-attachments/assets/cad73ade-52bc-4eb7-b933-e65884f517ec" />



---

## 🧑‍💻 Author

**Sheila Christine**

Would you like me to include short code fixes imakes your submission look more professional.
```
