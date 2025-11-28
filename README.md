# ⚡ WeekFlow - Master Your Week

A professional, gamified to-do application built with React and Vite. WeekFlow helps you organize tasks by day of the week, earn XP for completing tasks, and maintain productivity with a beautiful black and grey UI theme.

## ✨ Features

### 📅 Weekly Task Organization
- Organize tasks by each day of the week (Sunday - Saturday)
- Visual day selector with task count for each day
- Automatic highlighting of the current day
- Independent task lists for each day

### 🎯 Priority System
- **Basic Priority** (○) - +100 XP
- **Need Priority** (◐) - +200 XP  
- **Important Priority** (●) - +300 XP

### 🏆 XP & Gamification
- Earn XP for completing tasks based on priority level
- Visual XP progress bar with animated effects
- Total XP tracking with persistent storage
- Satisfying XP notification animations

### 🔄 Smart Task Management
- Automatic daily reset - Previous day's tasks reset to incomplete when a new day begins
- Tasks persist in local storage
- Add, complete, and delete tasks easily
- Visual completion tracking

### 🎨 Professional UI
- Black and grey polished theme
- Smooth animations and transitions
- Responsive design for all screen sizes
- Modern glassmorphism effects
- Custom scrollbar styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd my-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icon library
- **Local Storage** - Data persistence
- **CSS3** - Advanced styling with custom properties

## 🎮 How to Use

1. **Select a Day**: Click on any day of the week to view or add tasks for that day
2. **Add a Task**: 
   - Enter your task description
   - Select priority level (Basic, Need, or Important)
   - Click "Add Task"
3. **Complete Tasks**: Check the checkbox next to a task to mark it complete and earn XP
4. **Track Progress**: Watch your XP grow as you complete tasks throughout the week
5. **Daily Reset**: Each new day automatically resets the previous day's tasks to incomplete

## 💾 Data Persistence

WeekFlow automatically saves:
- All tasks for each day of the week
- Total XP earned
- Last reset date for daily task management

All data is stored in browser's local storage, so your progress persists across sessions.

## 🎨 Customization

The app uses CSS custom properties for easy theming. You can customize colors by editing the variables in `src/index.css`:

```css
:root {
  --color-accent-primary: #3b82f6;
  --color-priority-basic: #10b981;
  --color-priority-need: #f59e0b;
  --color-priority-important: #ef4444;
  /* ... more variables */
}
```

## 📱 Responsive Design

WeekFlow is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🔮 Future Enhancements

Potential features for future versions:
- Weekly/monthly statistics and analytics
- Task streaks and achievements
- Export/import tasks functionality
- Dark/light theme toggle
- Recurring tasks
- Task categories and tags

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using React and Vite**

Enjoy organizing your week with WeekFlow! 🚀
