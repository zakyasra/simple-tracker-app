"use client";
import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import 'chart.js/auto'; const PieChart = ({ transaction, pieChartFilter, setPieChartFilter }) => {
    const categoryChartRef = useRef(null);

    useEffect(() => {
        if (!categoryChartRef.current) return;

        // Destroy existing chart if any
        Chart.getChart(categoryChartRef.current)?.destroy();

        // Filter transactions based on selected type
        const filteredTransactions = transaction?.filter(item => {
            if (pieChartFilter === 'Pemasukan') return item.type === 'Pemasukan';
            if (pieChartFilter === 'Pengeluaran') return item.type === 'Pengeluaran';
            return true;
        }) || [];

        // Aggregate by category
        const categoryData = {};
        filteredTransactions.forEach(item => {
            const category = item.category || 'Uncategorized';
            categoryData[category] = (categoryData[category] || 0) + Math.abs(item.amount);
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
                                            text: `${label} (${value.toFixed(1)}%)`,
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
                                const value = context.parsed || 0;
                                return `${label}: ${value.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [transaction, pieChartFilter]);

    return (
        <div className='bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col w-full'>
            <div className='mb-6'>
                <div>
                    <h3 className='text-xl font-bold text-gray-900'>Category Distribution</h3>
                    <p className='text-sm text-gray-500 mt-1'>Top 5 spending categories</p>
                </div>
                <div className='mt-4'>
                    <select
                        value={pieChartFilter}
                        onChange={(e) => setPieChartFilter(e.target.value)}
                        className='w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-200'
                    >
                        <option value="Pengeluaran">Expense Only</option>
                        <option value="Pemasukan">Income Only</option>
                    </select>
                </div>
            </div>
            <div className='flex-1 min-h-0'>
                <canvas ref={categoryChartRef}></canvas>
            </div>
        </div>
    );
};

export default PieChart;
