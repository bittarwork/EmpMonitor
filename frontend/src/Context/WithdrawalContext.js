// src/context/WithdrawalContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// إعداد رابط API
const API_URL = process.env.REACT_APP_API_URL;

// إعداد الـ Context
const WithdrawalContext = createContext();

// تحديد الإجراءات
const ACTIONS = {
    FETCH_WITHDRAWALS: 'FETCH_WITHDRAWALS',
    ADD_WITHDRAWAL: 'ADD_WITHDRAWAL',
    UPDATE_WITHDRAWAL: 'UPDATE_WITHDRAWAL',
    DELETE_WITHDRAWAL: 'DELETE_WITHDRAWAL',
    FETCH_WITHDRAWALS_BY_EMPLOYEE: 'FETCH_WITHDRAWALS_BY_EMPLOYEE',
};

// إعداد الـ Reducer
const withdrawalReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_WITHDRAWALS:
            return { ...state, withdrawals: action.payload };
        case ACTIONS.ADD_WITHDRAWAL:
            return { ...state, withdrawals: [...state.withdrawals, action.payload] };
        case ACTIONS.UPDATE_WITHDRAWAL:
            return {
                ...state,
                withdrawals: state.withdrawals.map((withdrawal) =>
                    withdrawal._id === action.payload._id ? action.payload : withdrawal
                ),
            };
        case ACTIONS.DELETE_WITHDRAWAL:
            return {
                ...state,
                withdrawals: state.withdrawals.filter((withdrawal) => withdrawal._id !== action.payload),
            };
        case ACTIONS.FETCH_WITHDRAWALS_BY_EMPLOYEE:
            return { ...state, withdrawals: action.payload };
        default:
            return state;
    }
};

// إعداد Provider
export const WithdrawalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(withdrawalReducer, { withdrawals: [] });

    // جلب جميع السحوبات
    const fetchWithdrawals = async () => {
        try {
            const response = await axios.get(`${API_URL}/withdrawals`);
            dispatch({ type: ACTIONS.FETCH_WITHDRAWALS, payload: response.data });
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        }
    };

    // إضافة سحب جديد
    const addWithdrawal = async (withdrawal) => {
        try {
            const response = await axios.post(`${API_URL}/withdrawals`, withdrawal);
            dispatch({ type: ACTIONS.ADD_WITHDRAWAL, payload: response.data });
        } catch (error) {
            console.error('Error adding withdrawal:', error);
        }
    };

    // تحديث سحب
    const updateWithdrawal = async (id, withdrawal) => {
        try {
            const response = await axios.put(`${API_URL}/withdrawals/${id}`, withdrawal);
            dispatch({ type: ACTIONS.UPDATE_WITHDRAWAL, payload: response.data });
        } catch (error) {
            console.error('Error updating withdrawal:', error);
        }
    };

    // حذف سحب
    const deleteWithdrawal = async (id) => {
        try {
            await axios.delete(`${API_URL}/withdrawals/${id}`);
            dispatch({ type: ACTIONS.DELETE_WITHDRAWAL, payload: id });
        } catch (error) {
            console.error('Error deleting withdrawal:', error);
        }
    };

    // جلب السحوبات لموظف معين
    const fetchWithdrawalsByEmployee = async (employeeId) => {
        try {
            const response = await axios.get(`${API_URL}/withdrawals/employee/${employeeId}`);
            dispatch({ type: ACTIONS.FETCH_WITHDRAWALS_BY_EMPLOYEE, payload: response.data });
        } catch (error) {
            console.error('Error fetching withdrawals by employee:', error);
        }
    };

    // استخدام useEffect لجلب السحوبات عند تحميل التطبيق
    useEffect(() => {
        fetchWithdrawals(); // يمكنك استدعاء هذا بناءً على احتياجات التطبيق
    }, []);

    return (
        <WithdrawalContext.Provider value={{
            withdrawals: state.withdrawals,
            fetchWithdrawals,
            addWithdrawal,
            updateWithdrawal,
            deleteWithdrawal,
            fetchWithdrawalsByEmployee,
        }}>
            {children}
        </WithdrawalContext.Provider>
    );
};

// تصدير الـ Context
export const useWithdrawalContext = () => {
    return React.useContext(WithdrawalContext);
};
