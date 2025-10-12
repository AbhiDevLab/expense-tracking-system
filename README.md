# Expense Tracker

A comprehensive, modern expense tracking application built with Next.js 14, NextUI, and Firebase. Manage your complete financial picture with income and expense tracking, categorization, analytics, and more.

## ✨ Features

### Core Financial Management

- 💰 **Income & Expense Tracking** - Separate tracking for both income and expenses
- 📊 **Real-time Dashboard** - Comprehensive financial overview with key metrics
- 🏷️ **Smart Categorization** - Predefined categories for both income and expenses
- 📈 **Financial Analytics** - Total income, expenses, and net income calculations
- 📅 **Date Management** - Track transactions by date with full calendar support

### User Experience

- 🎨 **Modern UI/UX** - Beautiful, intuitive interface using NextUI components
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🌙 **Dark/Light Theme** - Toggle between themes for comfortable viewing
- ♿ **Accessibility First** - Built with screen readers and keyboard navigation in mind
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed

### Advanced Features

- 🔍 **Smart Filtering** - Filter transactions by type, category, date, or search terms
- 📊 **Data Visualization** - Interactive pie charts showing expense and income distribution
- ✏️ **Edit Transactions** - Modify existing transactions with full validation
- 💾 **Data Management** - Export/import transactions in JSON or CSV formats
- 🔄 **Real-time Sync** - Firebase integration with real-time updates across devices
- 💿 **Offline Support** - Local storage backup for offline access

### Data & Analytics

- 📈 **Financial Summary** - Track total income, expenses, and net income
- 🎯 **Category Insights** - Detailed breakdown of spending and income by category
- 📊 **Visual Analytics** - Pie charts and progress bars for better understanding
- 📋 **Transaction History** - Complete searchable history with advanced filters

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [NextUI v2](https://nextui.org/) - Modern React UI library
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service for data storage
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Git installed

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbhiDevLab/expense-tracking-system.git
   cd expense-tracking-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.
   Homepage:
   <img width="1140" height="677" alt="image" src="https://github.com/user-attachments/assets/cff9e57b-3faa-40ae-9389-b5fa29417cbc" />

   Simple demo:
   <img width="921" height="679" alt="image" src="https://github.com/user-attachments/assets/6e54bf05-e4ad-41ef-ac81-5dd32d50c1a9" />
   <img width="925" height="682" alt="image" src="https://github.com/user-attachments/assets/8349f7cf-3794-49c9-990b-a6dbfa2f87a5" />
   <img width="925" height="681" alt="image" src="https://github.com/user-attachments/assets/2a440f82-a723-4156-b1e1-2d0b291b3dc6" />
   <img width="949" height="682" alt="image" src="https://github.com/user-attachments/assets/9b6f011c-24c1-487e-bb72-b65097b19fab" />


## 🚀 Usage Guide

### Dashboard Overview

1. **Financial Summary**: View your total income, expenses, and net income at a glance
2. **Visual Analytics**: See pie charts showing your expense distribution and income sources
3. **Quick Insights**: Get category breakdowns with percentages and transaction counts

### Adding Transactions

1. **Navigate to "Add Transaction"** tab
2. **Choose Transaction Type**: Select between Income (💰) or Expense (💸)
3. **Fill in Details**:
   - Description: What was this transaction for?
   - Amount: How much money (in ₹)?
   - Category: Select from predefined categories
   - Date: When did this transaction occur?
4. **Submit**: Click the add button to save your transaction

### Managing Transactions

1. **View All Transactions**: Go to the "Transactions" tab
2. **Search & Filter**: Use the search bar and filters to find specific transactions
3. **Edit Transactions**: Click the edit (✏️) button to modify any transaction
4. **Delete Transactions**: Click the delete (🗑️) button to remove transactions
5. **Filter Options**:
   - By type (All, Income, Expenses)
   - By category (dropdown with all your categories)
   - By search term (description or category)

### Data Management

1. **Export Data**:
   - Go to "Data" tab
   - Choose "Export Data" → Select JSON or CSV format
   - Download your complete transaction history
2. **Import Data**:
   - Click "Import Data"
   - Select a previously exported JSON or CSV file
   - Your transactions will be restored

### Categories Available

**Income Categories:**

- Salary, Freelance, Business, Investment, Gift, Bonus, Other

**Expense Categories:**

- Food & Dining, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Education, Travel, Groceries, Other

### Theme & Accessibility

- **Theme Toggle**: Use the theme switcher in the navigation
- **Responsive Design**: Works on all screen sizes
- **Keyboard Navigation**: Fully accessible with keyboard
- **Screen Reader Support**: Optimized for assistive technologies

## 📁 Project Structure

```
expense-tracking-system/
├── app/                           # Next.js 14 App Router
│   ├── firebase.js               # Firebase configuration
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Main expense tracker application
│   └── providers.tsx             # Theme and UI providers
├── components/                    # Reusable UI components
│   ├── data-management.tsx       # Export/Import functionality
│   ├── navbar.tsx               # Navigation component
│   ├── pie-chart.tsx            # Data visualization component
│   ├── theme-switch.tsx         # Theme toggle component
│   ├── transaction-form.tsx     # Add/Edit transaction form
│   ├── transaction-list.tsx     # Transaction history with filters
│   └── transaction-summary.tsx  # Financial dashboard
├── lib/                          # Utility functions
│   └── utils.ts                 # Helper functions for calculations, storage, etc.
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Transaction and component types
├── config/                       # Configuration files
│   └── site.ts                  # Site configuration
└── styles/                       # Global styles
    └── globals.css              # Tailwind CSS imports
```

## 🔧 Key Components

### Core Components

- **TransactionForm**: Handles adding new income/expense transactions
- **TransactionList**: Displays, filters, and manages existing transactions
- **TransactionSummary**: Shows financial overview and analytics
- **PieChart**: Visualizes category distribution for expenses and income
- **DataManagement**: Handles export/import functionality

### Utility Functions

- **Local Storage**: Automatic backup of transactions for offline access
- **Validation**: Input validation and error handling
- **Calculations**: Financial summaries and category analysis
- **Data Processing**: Export/import in JSON and CSV formats

## 🔄 Migration & Compatibility

This enhanced version is **fully backward compatible** with existing expense data. The application automatically:

- **Migrates Legacy Data**: Existing expense records are converted to the new transaction format
- **Preserves Data**: All your existing expenses remain intact and accessible
- **Seamless Upgrade**: No data loss or manual migration required
- **Firebase Integration**: Continues to use the same Firebase collections with enhanced schema

### What's New in This Version

✅ **Income Tracking** - Now track both income and expenses  
✅ **Advanced Categories** - Predefined categories for better organization  
✅ **Financial Dashboard** - Complete overview of your financial health  
✅ **Data Visualization** - Interactive pie charts and analytics  
✅ **Enhanced Filtering** - Search and filter by multiple criteria  
✅ **Edit Transactions** - Modify existing records with validation  
✅ **Export/Import** - Backup and restore your data in multiple formats  
✅ **Local Storage Backup** - Offline access and data redundancy  
✅ **Responsive Design** - Optimized for all devices  
✅ **Improved UX** - Modern tabbed interface with better navigation

## 🛠️ Technical Details

### Database Schema

The application supports both legacy and new data formats:

**Legacy Format (Expenses Only):**

```javascript
{
  name: "Coffee",
  price: 150
}
```

**New Format (Income & Expenses):**

```javascript
{
  type: "expense" | "income",
  description: "Coffee at Starbucks",
  amount: 150,
  category: "Food & Dining",
  date: "2024-01-15",
  createdAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [NextUI](https://nextui.org/) for the beautiful UI components
- Powered by [Firebase](https://firebase.google.com/) for real-time data storage
- Inspired by modern expense tracking applications
