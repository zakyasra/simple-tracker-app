"use client";
import { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend, BarController } from 'chart.js';
import 'chart.js/auto'; const BarChart = ({ transaction }) => {
    const barChartRef = useRef(null);

    useEffect(() => {
        if (!barChartRef.current) return;

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
            return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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

    return (
        <div className='bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col w-full'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h3 className='text-xl font-bold text-gray-900'>Monthly Overview</h3>
                    <p className='text-sm text-gray-500 mt-1'>Income vs Expense comparison</p>
                </div>
            </div>
            <div className='flex-1 min-h-0'>
                <canvas ref={barChartRef}></canvas>
            </div>
        </div>
    );
};

export default BarChart;
