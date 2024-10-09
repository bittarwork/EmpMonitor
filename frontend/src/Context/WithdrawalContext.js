import React, { createContext, useContext, useReducer } from 'react';

// تعريف أنواع الإجراءات
const ACTIONS = {
    SET_WITHDRAWALS: 'SET_WITHDRAWALS',
    ADD_WITHDRAWAL: 'ADD_WITHDRAWAL',
    UPDATE_WITHDRAWAL: 'UPDATE_WITHDRAWAL',
    DELETE_WITHDRAWAL: 'DELETE_WITHDRAWAL',
    SET_WITHDRAWAL: 'SET_WITHDRAWAL',
};

// تعريف الحالة الأولية
const initialState = {
    withdrawals: [],
    currentWithdrawal: null,
};

// دالة reducer
const withdrawalReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_WITHDRAWALS:
            return { ...state, withdrawals: action.payload };
        case ACTIONS.ADD_WITHDRAWAL:
            return { ...state, withdrawals: [...state.withdrawals, action.payload] };
        case ACTIONS.UPDATE_WITHDRAWAL:
            return {
                ...state,
                withdrawals: state.withdrawals.map((withdrawal) =>
                    withdrawal.id === action.payload.id ? action.payload : withdrawal
                ),
            };
        case ACTIONS.DELETE_WITHDRAWAL:
            return {
                ...state,
                withdrawals: state.withdrawals.filter((withdrawal) => withdrawal.id !== action.payload),
            };
        case ACTIONS.SET_WITHDRAWAL:
            return { ...state, currentWithdrawal: action.payload };
        default:
            return state; // يجب أن يكون هناك default للحفاظ على الحالة الحالية
    }
};

// إنشاء السياق
const WithdrawalContext = createContext();

// مكون موفر السياق
export const WithdrawalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(withdrawalReducer, initialState);
    const apiUrl = process.env.REACT_APP_API_URL;

    // دالة لجلب جميع السحوبات مجمعة حسب الموظف
    const fetchWithdrawalsGroupedByEmployee = async () => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // معالجة الأخطاء في حالة عدم نجاح الاستجابة
            }
            const data = await response.json();
            dispatch({ type: ACTIONS.SET_WITHDRAWALS, payload: data });
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
        }
    };

    // دالة لإنشاء سحب جديد
    const createWithdrawal = async (withdrawalData) => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(withdrawalData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newWithdrawal = await response.json();
            dispatch({ type: ACTIONS.ADD_WITHDRAWAL, payload: newWithdrawal });
        } catch (error) {
            console.error("Error creating withdrawal:", error);
        }
    };

    // دالة لتحديث سحب موجود
    const updateWithdrawal = async (withdrawalId, updatedData) => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals/${withdrawalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedWithdrawal = await response.json();
            dispatch({ type: ACTIONS.UPDATE_WITHDRAWAL, payload: updatedWithdrawal });
        } catch (error) {
            console.error("Error updating withdrawal:", error);
        }
    };

    // دالة لجلب سحب بواسطة ID
    const fetchWithdrawalById = async (withdrawalId) => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals/${withdrawalId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dispatch({ type: ACTIONS.SET_WITHDRAWAL, payload: data });
        } catch (error) {
            console.error("Error fetching withdrawal:", error);
        }
    };

    // دالة لحذف سحب
    const deleteWithdrawal = async (withdrawalId) => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals/${withdrawalId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            dispatch({ type: ACTIONS.DELETE_WITHDRAWAL, payload: withdrawalId });
        } catch (error) {
            console.error("Error deleting withdrawal:", error);
        }
    };

    // دالة لحذف جميع السحوبات الخاصة بموظف معين
    const deleteWithdrawalsByEmployeeId = async (employeeId) => {
        try {
            const response = await fetch(`${apiUrl}/withdrawals/employee/${employeeId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            dispatch({
                type: ACTIONS.SET_WITHDRAWALS,
                payload: state.withdrawals.filter(withdrawal => withdrawal.employeeId !== employeeId),
            });
        } catch (error) {
            console.error("Error deleting withdrawals by employee:", error);
        }
    };

    return (
        <WithdrawalContext.Provider
            value={{
                withdrawals: state.withdrawals,
                currentWithdrawal: state.currentWithdrawal,
                fetchWithdrawalsGroupedByEmployee,
                createWithdrawal,
                updateWithdrawal,
                fetchWithdrawalById,
                deleteWithdrawal,
                deleteWithdrawalsByEmployeeId,
            }}
        >
            {children}
        </WithdrawalContext.Provider>
    );
};

// دالة لاستخدام السياق
export const useWithdrawals = () => {
    return useContext(WithdrawalContext);
};
