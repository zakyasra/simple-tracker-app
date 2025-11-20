# 💰 Tracking Your Money

A modern, elegant, and fully client-side personal finance management application built with Next.js. Track your income and expenses with beautiful visualizations, all while keeping your data 100% private on your device.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)
![Zustand](https://img.shields.io/badge/Zustand-5.0.5-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 📊 Financial Overview
- **Summary Cards**: Real-time display of total income, total expense, and net balance
- **Visual Analytics**: Three interactive charts powered by Chart.js
  - **Bar Chart**: Monthly income vs expense comparison (last 12 months)
  - **Line Chart**: Daily expense trend tracking (last 30 days)
  - **Pie Chart**: Top 5 spending categories with percentage breakdown

### 💳 Transaction Management
- **CRUD Operations**: Add, edit, delete transactions with confirmation dialogs
- **Smart Filtering**: Filter transactions by type (All, Income, Expense)
- **Detailed Records**: Track description, type, category, amount, and date for each transaction
- **Responsive Table**: Clean and organized transaction history display

### 🔒 Privacy & Data Control
- **100% Local Storage**: All data stored in browser's localStorage - no external servers
- **No Data Collection**: Your financial information never leaves your device
- **Offline-First**: Works completely offline after initial load
- **Export/Import**: Backup and restore your data as JSON files anytime

### 🎨 Modern UI/UX
- **Elegant Design**: Premium black-white theme with smooth transitions
- **Mobile Responsive**: Optimized for all screen sizes (desktop, tablet, mobile)
- **Interactive Charts**: Powered by Chart.js with responsive animations
- **Toast Notifications**: Real-time feedback for all user actions
- **Plus Jakarta Sans**: Modern, professional typography

## 🚀 Quick Start

Simply visit the app and start tracking your finances immediately - no installation, no signup, no credit card required!

**[🔗 Try it now](https://simple-tracker-app.vercel.app)**

The app runs entirely in your browser, so your data stays 100% private on your device.

## 📁 Project Structure

This is a modern web application built with cutting-edge technologies to ensure the best user experience while maintaining complete privacy.

## 💡 How to Use

### Getting Started
Simply open the app in your browser - no account creation needed! Start by adding your first transaction.

### Adding a Transaction

1. Click the **"+ Add Transaction"** button
2. Fill in the transaction details:
   - **Description**: e.g., "Monthly Salary", "Grocery Shopping"
   - **Type**: Select Income or Expense
   - **Category**: e.g., "Salary", "Food", "Transport"
   - **Amount**: Enter the amount (numbers only)
   - **Date**: Select transaction date
3. Click **"Save Transaction"**

### Managing Transactions

**Edit:**
1. Find the transaction in the table
2. Click the **"Edit"** button
3. Modify the details and save

**Delete:**
1. Click the **"Delete"** button on any transaction
2. Confirm deletion in the popup dialog

**Filter:**
- Use the **All/Income/Expense** tabs to filter your view

### Backup & Restore Your Data

**Export (Backup):**
- Click the **"Export"** button
- A JSON file will be downloaded automatically
- Save this file in a secure location

**Import (Restore):**
- Click the **"Import"** button
- Select a previously exported JSON file
- Your data will be restored and merged with existing transactions

### 💡 Pro Tips
- **Regular Backups**: Export your data weekly to avoid data loss
- **Multiple Devices**: Export from one device, import to another
- **Data Safety**: Keep your export files secure - they contain your financial data
- **Browser Storage**: Don't clear browser data if you want to keep your transactions

## 🛠️ Technologies Used

### Core Framework
- **[Next.js 15.3.4](https://nextjs.org/)** - React framework with App Router
- **[React 19.0.0](https://react.dev/)** - UI library

### State Management
- **[Zustand 5.0.5](https://github.com/pmndrs/zustand)** - Lightweight state management with persistence

### Data Visualization
- **[Chart.js 4.5.0](https://www.chartjs.org/)** - Beautiful, responsive charts (Bar, Line, Pie)

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)** - Modern Google Font

### UI Components
- **[React Icons (Feather Icons)](https://react-icons.github.io/react-icons/)** - Beautiful icon library
- **[React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🔐 Privacy & Security Features

### Why This App is Safe

1. **No Backend Required**: 
   - No server-side processing
   - No database connections
   - No API calls to external services

2. **Local-Only Storage**:
   - All data stored in browser's `localStorage`
   - Data persists only on your device
   - No cloud sync or external storage

3. **No Data Collection**:
   - No analytics tracking
   - No cookies for tracking
   - No personal information required

4. **Full User Control**:
   - Export data anytime
   - Import data from backups
   - Clear data by clearing browser storage

5. **Open Source**:
   - Code is publicly available
   - Can be self-hosted
   - Transparent operations

## ⚙️ Configuration

### Environment Variables

This project does not require any environment variables. All functionality works out of the box.

### Customization

You can customize the app by modifying:

- **Colors**: Edit Tailwind classes in `src/app/page.js`
- **Font**: Change font in `src/app/layout.js`
- **Chart Settings**: Modify chart configurations in `src/app/page.js` (useEffect hooks)
- **Storage Key**: Update storage name in `src/hooks/useTransaction.js`

## 📱 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Requires localStorage support (available in all modern browsers)

## 🤝 Support & Feedback

Found this app helpful? Have suggestions or feature requests?

- ⭐ **Star this project** on [GitHub](https://github.com/zakyasra/simple-tracker-app)
- 💬 **Open an issue** for bug reports or feature requests
- 📧 **Contact**: [your-email@example.com](mailto:your-email@example.com)

## 📄 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

**Zaky Asra**
- GitHub: [@zakyasra](https://github.com/zakyasra)
- Repository: [simple-tracker-app](https://github.com/zakyasra/simple-tracker-app)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Zustand for lightweight state management
- Chart.js for beautiful visualizations
- Tailwind CSS for utility-first styling
- React Icons for the icon library

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

**Made with ❤️ using Next.js and React**
