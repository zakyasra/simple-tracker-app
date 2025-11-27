import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const FinancialSummaryCards = ({ totalIncome, totalExpense, balance }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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

            {/* Net Balance Card */}
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
    );
};

export default FinancialSummaryCards;