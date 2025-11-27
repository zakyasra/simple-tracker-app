"use client";
import { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, LineController } from 'chart.js';
import 'chart.js/auto'; const LineChart = ({ transaction }) => {
    const lineChartRef = useRef(null);

    useEffect(() => {
        if (!lineChartRef.current) return;

        // Get daily expense data for the last 7 days
        const dailyData = {};
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Initialize all 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayKey = date.toISOString().split('T')[0];
            dailyData[dayKey] = 0;
        }

        transaction?.forEach(item => {
            const date = new Date(item.date);
            if (date >= sevenDaysAgo && item.type === 'Pengeluaran') {
                const dayKey = date.toISOString().split('T')[0];
                if (dailyData.hasOwnProperty(dayKey)) {
                    dailyData[dayKey] += Math.abs(item.amount);
                }
            }
        });

        // Sort by date
        const sortedDays = Object.keys(dailyData).sort();
        const labels = sortedDays.map(key => {
            const date = new Date(key);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        });
        const data = sortedDays.map(key => dailyData[key]);

        // Find the highest value index
        const maxValue = Math.max(...data);
        const maxIndex = data.indexOf(maxValue);

        // Create point radius array with larger point for max value
        const pointRadiusArray = data.map((_, index) => index === maxIndex ? 8 : 5);
        const pointHoverRadiusArray = data.map((_, index) => index === maxIndex ? 10 : 7);

        const chart = new Chart(lineChartRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Pengeluaran',
                        data: data,
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
                            gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.15)');
                            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
                            return gradient;
                        },
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: pointRadiusArray,
                        pointHoverRadius: pointHoverRadiusArray,
                        pointBackgroundColor: (context) => {
                            return context.dataIndex === maxIndex ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)';
                        },
                        pointBorderColor: (context) => {
                            return context.dataIndex === maxIndex ? 'rgba(239, 68, 68, 1)' : '#fff';
                        },
                        pointBorderWidth: (context) => {
                            return context.dataIndex === maxIndex ? 0 : 3;
                        },
                        pointHoverBorderWidth: 4,
                        pointStyle: (context) => {
                            if (context.dataIndex === maxIndex) {
                                // Create a custom circle with badge effect
                                const img = new Image(16, 16);
                                return 'circle';
                            }
                            return 'circle';
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                let label = 'Rp ' + context.parsed.y.toLocaleString();
                                if (context.dataIndex === maxIndex) {
                                    label += ' (Highest)';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            padding: 10,
                            font: {
                                size: 11
                            },
                            callback: function (value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [transaction]);

    return (
        <div className='bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h3 className='text-xl font-bold text-gray-900'>7-Day Trend</h3>
                    <p className='text-sm text-gray-500 mt-1'>Daily transaction monitoring</p>
                </div>
            </div>
            <div className='h-[320px]'>
                <canvas ref={lineChartRef}></canvas>
            </div>
        </div>
    );
};

export default LineChart;
