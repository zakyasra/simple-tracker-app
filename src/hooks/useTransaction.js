import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTransaction = create(
    persist(
        (set) => ({
            transaction: [],
            addTransaction: (transaction) => set((state) => ({
                transaction: [...state.transaction, transaction]
            })),
            deleteTransaction: (index) => set((state) => ({
                transaction: state.transaction.filter((_) => _.id !== index)
            })),
            updateTransaction: (index, updatedTransaction) => set((state) => ({
                transaction: state.transaction.map((t) =>
                    t.id === index ? { ...t, ...updatedTransaction } : t
                )
            })),
        }),
        {
            name: 'transaction-storage', // unique name for the storage
            getStorage: () => localStorage, // use localStorage as the storage
        }
    )
)

export const useTransactionStore = useTransaction