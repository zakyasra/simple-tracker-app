"use client";

import { useTransactionStore } from '@/hooks/useTransaction';
import { CategoryScale, Chart, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, BarController, LineController, PieController } from 'chart.js';
import * as XLSX from 'xlsx';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiBarChart2, FiPieChart, FiActivity, FiInbox, FiDownload, FiUpload, FiChevronDown, FiCheck, FiFilm, FiMusic } from 'react-icons/fi';
import {
  FaMoneyBillWave, FaBriefcase, FaLaptopCode, FaChartLine, FaBitcoin,
  FaUtensils, FaCoffee, FaCookie, FaShoppingCart,
  FaCar, FaGasPump, FaBus, FaParking, FaRoad, FaWrench,
  FaFileInvoiceDollar, FaWifi, FaMobileAlt, FaBolt, FaTint,
  FaShoppingBag, FaTshirt, FaGem, FaMobileAlt as FaGadget, FaTv,
  FaHeartbeat, FaPills, FaStethoscope, FaVial, FaDumbbell,
  FaGamepad, FaFutbol, FaTableTennis, FaBasketballBall, FaVolleyballBall, FaPlane,
  FaSpa, FaCut, FaSprayCan,
  FaGift, FaTwitch, FaHeart, FaHandHoldingHeart,
  FaEllipsisH, FaCode, FaBullhorn, FaMoneyCheck, FaCreditCard,
  FaChartPie,
  FaPiggyBank
} from 'react-icons/fa';

// Register components needed for Bar and Line charts
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController
);

// Categories data structure
const CATEGORIES = [
  {
    name: 'Income',
    icon: FaMoneyBillWave,
    subcategories: [
      { name: 'Monthly Salary', icon: FaBriefcase },
      { name: 'Overtime Pay', icon: FaBriefcase },
      { name: 'Freelance', icon: FaLaptopCode },
      { name: 'Affiliate', icon: FaChartLine },
      { name: 'Stock Profit', icon: FaChartLine },
      { name: 'Stock Dividend', icon: FaChartLine },
      { name: 'Crypto Profit', icon: FaBitcoin }
    ]
  },
  {
    name: 'Investment',
    icon: FaChartLine,
    subcategories: [
      { name: 'Gold', icon: FaGem },
      { name: 'Crypto', icon: FaBitcoin },
      { name: 'Stocks', icon: FaChartLine },
      { name: 'Mutual Funds', icon: FaChartPie },
      { name: 'Retirement Funds', icon: FaPiggyBank },
      { name: 'Bonds', icon: FaFileInvoiceDollar },
    ]
  },
  {
    name: 'Food & Drinks',
    icon: FaUtensils,
    subcategories: [
      { name: 'Meals', icon: FaUtensils },
      { name: 'Coffee & Beverages', icon: FaCoffee },
      { name: 'Snacks', icon: FaCookie },
      { name: 'Groceries', icon: FaShoppingCart }
    ]
  },
  {
    name: 'Transportation',
    icon: FaCar,
    subcategories: [
      { name: 'Fuel', icon: FaGasPump },
      { name: 'Public Transport', icon: FaBus },
      { name: 'Parking', icon: FaParking },
      { name: 'Toll', icon: FaRoad },
      { name: 'Vehicle Service', icon: FaWrench }
    ]
  },
  {
    name: 'Bills',
    icon: FaFileInvoiceDollar,
    subcategories: [
      { name: 'Internet / WiFi', icon: FaWifi },
      { name: 'Mobile Credit', icon: FaMobileAlt },
      { name: 'Electricity', icon: FaBolt },
      { name: 'Water', icon: FaTint },
      { name: 'Netflix / Movie Streaming', icon: FiFilm },
      { name: 'Spotify / Music Streaming', icon: FiMusic }
    ]
  },
  {
    name: 'Shopping',
    icon: FaShoppingBag,
    subcategories: [
      { name: 'Clothes', icon: FaTshirt },
      { name: 'Pants', icon: FaTshirt },
      { name: 'Gadgets', icon: FaGadget },
      { name: 'Electronics', icon: FaTv }
    ]
  },
  {
    name: 'Health',
    icon: FaHeartbeat,
    subcategories: [
      { name: 'Medicine / Treatment', icon: FaPills },
      { name: 'Doctor Consultation', icon: FaStethoscope },
      { name: 'Vitamins / Supplements', icon: FaVial },
      { name: 'Gym Support', icon: FaDumbbell }
    ]
  },
  {
    name: 'Hobby',
    icon: FaGamepad,
    subcategories: [
      { name: 'Gym', icon: FaDumbbell },
      { name: 'Futsal', icon: FaFutbol },
      { name: 'Badminton', icon: FaTableTennis },
      { name: 'Basketball', icon: FaBasketballBall },
      { name: 'Volleyball', icon: FaVolleyballBall },
      { name: 'Travelling', icon: FaPlane }
    ]
  },
  {
    name: 'Self Care',
    icon: FaSpa,
    subcategories: [
      { name: 'Barber', icon: FaCut },
      { name: 'Salon', icon: FaCut },
      { name: 'Skincare', icon: FaSprayCan },
      { name: 'Spa / Massage', icon: FaSpa }
    ]
  },
  {
    name: 'Gift',
    icon: FaGift,
    subcategories: [
      { name: 'Gift for Streamers', icon: FaTwitch },
      { name: 'Charity', icon: FaHeart },
      { name: 'Family Support', icon: FaHandHoldingHeart }
    ]
  },
  {
    name: 'Others',
    icon: FaEllipsisH,
    subcategories: [
      { name: 'Software Subscription', icon: FaCode },
      { name: 'Social Media Ads', icon: FaBullhorn },
      { name: 'Loan', icon: FaMoneyCheck },
      { name: 'Online Loan', icon: FaCreditCard }
    ]
  }
];

const Page = () => {
  const { transaction, addTransaction, deleteTransaction, updateTransaction, importTransactions } = useTransactionStore();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    type: 'Pemasukan',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [editId, setEditId] = useState(null);
  const [filterType, setFilterType] = useState('Semua');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const exportDropdownRef = useRef(null);

  const toggleModal = () => {
    // Only clear form data when closing modal (not opening for edit)
    if (isOpenModal) {
      setFormData({
        description: '',
        type: 'Pemasukan',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditId(null);
      setSelectedCategoryIcon(null);
      setIsCategoryOpen(false);
    }
    setIsOpenModal(!isOpenModal);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryName, icon) => {
    setFormData({ ...formData, category: categoryName });
    setSelectedCategoryIcon(icon);
    setIsCategoryOpen(false);
  };

  const getCategoryIcon = (categoryName) => {
    for (const cat of CATEGORIES) {
      if (cat.name === categoryName) return cat.icon;
      const subcat = cat.subcategories.find(sub => sub.name === categoryName);
      if (subcat) return subcat.icon;
    }
    return FaEllipsisH;
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000
  }

  const handleSubmit = () => {
    if (!formData.description || !formData.category || !formData.amount || !formData.date) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
      });
      return;
    }
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount.", {
        position: "top-center",
      });
      return;
    }
    const newTransaction = {
      ...formData,
      id: getRandomNumber(), // Generate a random ID
      amount: formData.type === "Pengeluaran" ? -parseFloat(formData.amount) : parseFloat(formData.amount) // Convert amount to a number and handle negative for expenses
    };
    editId ? updateTransaction(editId, newTransaction) : addTransaction(newTransaction);
    toast.success(editId ? "Transaction updated successfully!" : "Transaction added successfully!", {
      position: "top-center",
    });

    // Clear form data
    setFormData({
      description: '',
      type: 'Pemasukan',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditId(null);

    toggleModal();
  }

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteTransaction(deleteConfirmId);
      toast.success("Transaction deleted successfully!", {
        position: "top-center",
      });
      setDeleteConfirmId(null);
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  }

  const handleEdit = (id) => {
    const transactionToEdit = transaction.find(item => item.id === id);
    if (transactionToEdit) {
      setEditId(id);
      setFormData({
        description: transactionToEdit.description,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        amount: Math.abs(transactionToEdit.amount).toString(), // Convert to string for input
        date: new Date(transactionToEdit.date).toISOString().split('T')[0] // Format date for input
      });
      setSelectedCategoryIcon(getCategoryIcon(transactionToEdit.category));
      setIsOpenModal(true);
    }
  }

  const exportToExcel = (filteredData, filename) => {
    if (!filteredData || filteredData.length === 0) {
      toast.error("No transactions to export!", {
        position: "top-center",
      });
      return;
    }

    // Prepare data for Excel
    const excelData = filteredData.map((item, index) => ({
      'No': index + 1,
      'Description': item.description,
      'Type': item.type,
      'Category': item.category,
      'Amount': Math.abs(item.amount),
      'Date': item.date
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 30 }, // Description
      { wch: 15 }, // Type
      { wch: 20 }, // Category
      { wch: 15 }, // Amount
      { wch: 15 }  // Date
    ];

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Generate Excel file and download
    XLSX.writeFile(wb, filename);

    toast.success(`${filteredData.length} transactions exported successfully!`, {
      position: "top-center",
    });
    setIsExportDropdownOpen(false);
  };

  const handleExportLast7Days = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const filtered = transaction.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= sevenDaysAgo && itemDate <= now;
    });
    exportToExcel(filtered, `transactions-last-7-days-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportLast30Days = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const filtered = transaction.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= thirtyDaysAgo && itemDate <= now;
    });
    exportToExcel(filtered, `transactions-last-30-days-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportCustomRange = () => {
    if (!customDateRange.start || !customDateRange.end) {
      toast.error("Please select both start and end dates!", {
        position: "top-center",
      });
      return;
    }
    const startDate = new Date(customDateRange.start);
    const endDate = new Date(customDateRange.end);
    if (startDate > endDate) {
      toast.error("Start date must be before end date!", {
        position: "top-center",
      });
      return;
    }
    const filtered = transaction.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
    exportToExcel(filtered, `transactions-${customDateRange.start}-to-${customDateRange.end}.xlsx`);
    setIsCustomRangeOpen(false);
    setCustomDateRange({ start: '', end: '' });
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Accept both Excel and JSON files
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'json'].includes(fileExt)) {
      toast.error("Please upload a valid Excel (.xlsx, .xls) or JSON file!", {
        position: "top-center",
      });
      return;
    }

    const reader = new FileReader();

    if (fileExt === 'json') {
      // Handle JSON import (legacy support)
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          if (!Array.isArray(importedData)) {
            toast.error("Invalid data format!", {
              position: "top-center",
            });
            return;
          }

          // Generate new IDs for imported data to avoid conflicts
          const dataWithNewIds = importedData.map(item => ({
            ...item,
            id: Date.now() + Math.floor(Math.random() * 10000)
          }));

          // Merge with existing transactions
          const mergedData = [...transaction, ...dataWithNewIds];
          importTransactions(mergedData);

          toast.success(`${importedData.length} transactions imported successfully!`, {
            position: "top-center",
          });
        } catch (error) {
          toast.error("Error parsing JSON file!", {
            position: "top-center",
          });
        }
      };
      reader.readAsText(file);
    } else {
      // Handle Excel import
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get first worksheet
          const wsname = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsname];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(ws);

          if (!jsonData || jsonData.length === 0) {
            toast.error("No data found in Excel file!", {
              position: "top-center",
            });
            return;
          }

          // Transform Excel data to transaction format
          const transformedData = jsonData.map(row => {
            // Parse date with better error handling
            let parsedDate;
            try {
              if (row.Date) {
                // Handle Excel serial date (number)
                if (typeof row.Date === 'number') {
                  // Excel serial date conversion
                  const excelEpoch = new Date(1899, 11, 30);
                  const days = Math.floor(row.Date);
                  const date = new Date(excelEpoch.getTime() + days * 86400000);
                  parsedDate = date.toISOString().split('T')[0];
                } else {
                  // Try parsing string date
                  // Handle Indonesian date format: "24/11/2025" or "24 Nov 2025"
                  let dateStr = row.Date.toString();

                  // Try direct parse first
                  let date = new Date(dateStr);

                  // If invalid, try parsing Indonesian format
                  if (isNaN(date.getTime())) {
                    // Try parsing "24/11/2025" format
                    const parts = dateStr.split('/');
                    if (parts.length === 3) {
                      date = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                  }

                  if (!isNaN(date.getTime())) {
                    parsedDate = date.toISOString().split('T')[0];
                  } else {
                    parsedDate = new Date().toISOString().split('T')[0];
                  }
                }
              } else {
                parsedDate = new Date().toISOString().split('T')[0];
              }
            } catch (error) {
              console.error('Date parsing error:', error);
              parsedDate = new Date().toISOString().split('T')[0];
            }

            return {
              id: Date.now() + Math.floor(Math.random() * 10000),
              description: row.Description || '',
              type: row.Type || 'Pengeluaran',
              category: row.Category || 'Others',
              amount: row.Type === 'Pengeluaran' ? -Math.abs(Number(row.Amount) || 0) : Math.abs(Number(row.Amount) || 0),
              date: parsedDate
            };
          });

          // Merge with existing transactions
          const mergedData = [...transaction, ...transformedData];
          importTransactions(mergedData);

          toast.success(`${transformedData.length} transactions imported from Excel successfully!`, {
            position: "top-center",
          });
        } catch (error) {
          console.error('Import error:', error);
          toast.error("Error reading Excel file!", {
            position: "top-center",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }

    // Reset input
    event.target.value = '';
  }

  // Bar Chart: Income vs Expense per Month (last 12 months)
  useEffect(() => {
    if (!barChartRef.current) return;

    // Get monthly data for the last 12 months
    const monthlyData = {};
    const now = new Date();

    transaction?.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (item.type === 'Pemasukan') {
        monthlyData[monthKey].income += item.amount;
      } else {
        monthlyData[monthKey].expense += Math.abs(item.amount);
      }
    });

    // Sort by date and get labels
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(key => {
      const [year, month] = key.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    });

    const incomeData = sortedMonths.map(key => monthlyData[key].income);
    const expenseData = sortedMonths.map(key => monthlyData[key].expense);

    const chart = new Chart(barChartRef.current, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          {
            label: 'Pengeluaran',
            data: expenseData.length ? expenseData : [0],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Pemasukan',
            data: incomeData.length ? incomeData : [0],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [transaction]);

  // Line Chart: Daily Expense Trend (last 30 days)
  useEffect(() => {
    if (!lineChartRef.current) return;

    // Get daily expense data for the last 30 days
    const dailyData = {};
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    transaction?.forEach(item => {
      const date = new Date(item.date);
      if (date >= thirtyDaysAgo && item.type === 'Pengeluaran') {
        const dayKey = date.toISOString().split('T')[0];
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = 0;
        }
        dailyData[dayKey] += Math.abs(item.amount);
      }
    });

    // Sort by date
    const sortedDays = Object.keys(dailyData).sort();
    const labels = sortedDays.map(key => {
      const date = new Date(key);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    const data = sortedDays.map(key => dailyData[key]);

    const chart = new Chart(lineChartRef.current, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          {
            label: 'Pengeluaran',
            data: data.length ? data : [0],
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Pemasukan',
            data: data.length ? data.map(() => 0) : [0],
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [transaction]);

  // Pie Chart: Top 5 Categories
  useEffect(() => {
    if (!categoryChartRef.current) return;

    // Destroy existing chart if any
    Chart.getChart(categoryChartRef.current)?.destroy();

    // Aggregate by category
    const categoryData = {};
    transaction?.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = 0;
      }
      categoryData[item.category] += Math.abs(item.amount);
    });

    // Calculate total
    const total = Object.values(categoryData).reduce((sum, val) => sum + val, 0);

    // Sort and get top 5
    const sortedCategories = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const labels = sortedCategories.map(([category]) => category);
    const percentages = sortedCategories.map(([, amount]) => total > 0 ? (amount / total) * 100 : 0);

    const chart = new Chart(categoryChartRef.current, {
      type: 'pie',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          {
            data: percentages.length ? percentages : [100],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(139, 92, 246, 1)'
            ],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value.toFixed(1)}%`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value.toFixed(1)}%`;
              }
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [transaction]);

  // Calculate financial summary
  const totalIncome = transaction
    ?.filter(item => item.type === 'Pemasukan')
    .reduce((sum, item) => sum + item.amount, 0) || 0;

  const totalExpense = transaction
    ?.filter(item => item.type === 'Pengeluaran')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0) || 0;

  const balance = totalIncome - totalExpense;

  // Filter transactions based on selected type
  const filteredTransactions = transaction?.filter(item => {
    if (filterType === 'Semua') return true;
    if (filterType === 'Masuk') return item.type === 'Pemasukan';
    if (filterType === 'Keluar') return item.type === 'Pengeluaran';
    return true;
  }) || [];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 min-h-[100dvh] pt-8 md:pt-12 pb-20">
      <div className="max-w-7xl md:mx-auto mx-4 mb-2">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight text-left md:text-center">Private Money Tracker</h1>
      </div>
      <div className="max-w-7xl md:mx-auto mx-4">
        <p className="text-gray-500 text-base text-left md:text-center">Your Money. Your Device. Zero Cloud Storage.</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="max-w-7xl md:mx-auto mx-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Income</p>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-white text-xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">Rp {totalIncome.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Revenue</span>
            </div>
          </div>

          {/* Total Expense Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Expense</p>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <FiTrendingDown className="text-white text-xl" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">Rp {totalExpense.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Spending</span>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-xs uppercase tracking-wider font-medium">Net Balance</p>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FiDollarSign className="text-gray-900 text-xl" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-2 text-white">
              Rp {balance.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-white text-gray-900 text-xs rounded-full font-medium">
                {balance >= 0 ? 'Profit' : 'Loss'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl md:mx-auto mx-4 mt-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart: Income vs Expense - Takes 2 columns */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 lg:col-span-2 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Profit Analysis</h3>
                <p className="text-sm text-gray-500">Comparison of capital and sales per item</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <FiBarChart2 className="text-gray-900 text-2xl" />
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          {/* Pie Chart: Distribution - Takes 1 column */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Distribution</h3>
                <p className="text-sm text-gray-500">Transaction breakdown</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <FiPieChart className="text-gray-900 text-2xl" />
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </div>

          {/* Line Chart: Daily Trend - Takes full width */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 lg:col-span-3 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">7-Day Trend</h3>
                <p className="text-sm text-gray-500">Daily transaction monitoring</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <FiActivity className="text-gray-900 text-2xl" />
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-7xl md:mx-auto mx-4 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Transaction History</h2>
            <p className="text-sm text-gray-500">Manage your financial records</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                className="text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 py-2.5 md:py-3 px-4 md:px-5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              >
                <FiDownload className="text-base md:text-lg" />
                <span className="hidden sm:inline">Export</span>
                <FiChevronDown className={`text-sm transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportDropdownOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl min-w-[200px] overflow-hidden">
                  <button
                    onClick={handleExportLast7Days}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-sm text-gray-700 border-b border-gray-100 cursor-pointer"
                  >
                    <span>Last 7 Days</span>
                  </button>
                  <button
                    onClick={handleExportLast30Days}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-sm text-gray-700 border-b border-gray-100 cursor-pointer"
                  >
                    <span>Last 30 Days</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCustomRangeOpen(true);
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
                  >
                    <span>Custom Range</span>
                  </button>
                </div>
              )}
            </div>

            <label className="text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 py-2.5 md:py-3 px-4 md:px-5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
              <FiUpload className="text-base md:text-lg" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".xlsx,.xls,.json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button className="text-white cursor-pointer bg-gray-900 hover:bg-gray-800 py-2.5 md:py-3 px-4 md:px-6 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-none" onClick={toggleModal}>
              <span className="">+ Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-xl w-full md:w-fit border border-gray-200">
          <button
            onClick={() => setFilterType('Semua')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg transition-all duration-200 text-xs md:text-sm font-semibold ${filterType === 'Semua'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Masuk')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg transition-all duration-200 text-xs md:text-sm font-semibold ${filterType === 'Masuk'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType('Keluar')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg transition-all duration-200 text-xs md:text-sm font-semibold ${filterType === 'Keluar'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            Expense
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.length ? (
                filteredTransactions?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.description}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${item.type === 'Pemasukan'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-900 text-white'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'Pemasukan' ? 'bg-gray-900' : 'bg-white'
                          }`}></span>
                        {item.type === 'Pemasukan' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.category}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">Rp {Math.abs(item.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-xs font-medium transition-colors duration-200" onClick={() => handleEdit(item.id)}>Edit</button>
                        <button className="text-white cursor-pointer bg-gray-900 hover:bg-gray-800 py-2 px-4 rounded-lg text-xs font-medium transition-colors duration-200" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FiInbox className="text-5xl mb-3 text-gray-400" />
                      <p className="font-medium">No transactions yet</p>
                      <p className="text-sm">Start by adding your first transaction</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-75"
            onClick={toggleModal}
          ></div>

          <div className="relative flex items-center justify-center h-full px-4 py-8 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl my-auto">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">New Transaction</h2>
              <p className="text-sm text-gray-500 mb-6">Add a new financial record</p>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Description</label>
                <input
                  type="text"
                  name="description"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Enter description (e.g., Salary, Groceries, Checkout, etc.)"
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Type</label>
                <select
                  name="type"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Pemasukan">Income</option>
                  <option value="Pengeluaran">Expense</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Category</label>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                        {formData.category || 'Select category'}
                      </span>
                    </span>
                    <FiChevronDown className={`text-gray-600 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[35dvh] overflow-y-auto">
                      {CATEGORIES.map((category, idx) => (
                        <div key={idx}>
                          {/* Main Category */}
                          <button
                            type="button"
                            onClick={() => handleCategorySelect(category.name, category.icon)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100"
                          >
                            <category.icon className="text-gray-900 text-lg flex-shrink-0" />
                            <span className="font-semibold text-gray-900">{category.name}</span>
                            {formData.category === category.name && (
                              <FiCheck className="ml-auto text-gray-900" />
                            )}
                          </button>

                          {/* Subcategories */}
                          {category.subcategories.map((sub, subIdx) => (
                            <button
                              key={subIdx}
                              type="button"
                              onClick={() => handleCategorySelect(sub.name, sub.icon)}
                              className="w-full px-4 py-2.5 pl-12 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-sm"
                            >
                              <sub.icon className="text-gray-600 flex-shrink-0" />
                              <span className="text-gray-700">{sub.name}</span>
                              {formData.category === sub.name && (
                                <FiCheck className="ml-auto text-gray-900" />
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Amount</label>
                <input
                  type="text"
                  name="amount"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount (e.g., 50000, 150000, etc.)"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-lg"
                  onClick={handleSubmit}
                >
                  Save Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-75"
            onClick={cancelDelete}
          ></div>

          <div className="relative flex items-center justify-center h-full px-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Transaction?</h3>
                <p className="text-gray-500 text-sm">This action cannot be undone. Are you sure you want to delete this transaction?</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Date Range Modal */}
      {isCustomRangeOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-75"
            onClick={() => setIsCustomRangeOpen(false)}
          ></div>

          <div className="relative flex items-center justify-center h-full px-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Date Range</h3>
              <p className="text-sm text-gray-500 mb-6">Select the date range for export</p>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">Start Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold text-sm">End Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomRangeOpen(false);
                    setCustomDateRange({ start: '', end: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExportCustomRange}
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page;