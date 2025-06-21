"use client";

import { useTransactionStore } from '@/hooks/useTransaction';
import { CategoryScale, Chart, LinearScale, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Register components needed for Pie chart
Chart.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PieController
);

const Page = () => {
  const { transaction, addTransaction, deleteTransaction, updateTransaction } = useTransactionStore();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    type: 'Pemasukan',
    category: '',
    amount: '',
    date: ''
  })
  const [editId, setEditId] = useState(null);
  const canvasRef = useRef(null);

  const toggleModal = () => {
    if (editId) {
      setFormData({
        description: '',
        type: 'Pemasukan',
        category: '',
        amount: '',
        date: ''
      });
      setEditId(null);
    }
    setIsOpenModal(!isOpenModal);
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
    toggleModal();
  }

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success("Transaction deleted successfully!", {
      position: "top-center",
    });
  }

  const handleEdit = (id) => {
    const transactionToEdit = transaction.find(item => item.id === id);
    if (transactionToEdit) {
      setFormData({
        description: transactionToEdit.description,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        amount: Math.abs(transactionToEdit.amount).toString(), // Convert to string for input
        date: new Date(transactionToEdit.date).toISOString().split('T')[0] // Format date for input
      });
      setEditId(id);
      toggleModal();
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const reducedData = transaction?.reduce((acc, item) => {
      const existing = acc.find(i => i.category === item.category);
      if (existing) {
        existing.amount += item.amount;
      } else {
        acc.push({ category: item.category, amount: item.amount });
      }
      return acc; // Ini yang paling penting!
    }, []); // Inisialisasi dengan array kosong


    const chart = new Chart(
      canvasRef.current,
      {
        type: 'pie',
        data: {
          labels: reducedData.length ? reducedData?.map(item => item.category) : ["No Data"],
          datasets: [{
            data: reducedData.length ? reducedData?.map(item => item.amount) : [100],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          }
        }
      }
    );

    return () => {
      chart.destroy();
    }
  }, [transaction]);

  return (
    <div className="bg-blue-50 pt-10 pb-20">
      <div className="flex justify-center">
        <h1 className="text-4xl font-semibold text-blue-900">Tracking Your Money</h1>
      </div>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl mb-10 flex justify-center">
          <canvas
            ref={canvasRef}
            style={{ width: '80%', height: '80%' }}
          />
        </div>
      </div>
      <div className="mt-4 max-w-6xl md:mx-auto mx-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">Daftar Transaksi</h2>
          <button className="text-white cursor-pointer bg-blue-600 py-2 px-4 rounded" onClick={toggleModal}>Add New</button>
        </div>
        <div className="overflow-x-auto">
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='bg-blue-100 text-blue-900'>
              <tr className='border-b'>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-left">Jenis</th>
                <th className="px-4 py-2 text-left">Asal/Tujuan</th>
                <th className="px-4 py-2 text-left">Jumlah</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaction?.length ? (
                transaction?.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2"><span>{item.type}</span></td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">Rp {item.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button className="text-white cursor-pointer bg-blue-600 py-2 px-4 rounded" onClick={() => handleEdit(item.id)}>Edit</button>
                      <button className="text-white cursor-pointer ml-2 bg-red-600 py-2 px-4 rounded" onClick={() => handleDelete(item.id)}>Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">Tidak ada transaksi</td>
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

          <div className="relative flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
              <h2 className="text-2xl font-semibold mb-4">Tambah Transaksi Baru</h2>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <input
                  type="text"
                  name="description"
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Jenis</label>
                <select
                  name="type"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Pemasukan">Pemasukan</option>
                  <option value="Pengeluaran">Pengeluaran</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Asal/Tujuan</label>
                <input
                  type="text"
                  name="category"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Jumlah</label>
                <input
                  type="text"
                  name="amount"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded cusor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded cusor-pointer"
                  onClick={handleSubmit}
                >
                  Simpan
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