// src/context/EmployeeContext.js
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

// إنشاء السياق
export const EmployeeContext = createContext();

// تعريف الإجراءات
const ACTIONS = {
    FETCH_EMPLOYEES: 'FETCH_EMPLOYEES',
    ADD_EMPLOYEE: 'ADD_EMPLOYEE',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    FETCH_EMPLOYEE_BY_ID: 'FETCH_EMPLOYEE_BY_ID',
    FETCH_EMPLOYEES_BY_HIRE_PERIOD: 'FETCH_EMPLOYEES_BY_HIRE_PERIOD',
    CALCULATE_WEEKLY_SALARY: 'CALCULATE_WEEKLY_SALARY',
};

// وظيفة الـ reducer
const employeeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_EMPLOYEES:
            return { ...state, employees: action.payload, loading: false, error: null };
        case ACTIONS.ADD_EMPLOYEE:
            return { ...state, employees: [...state.employees, action.payload] };
        case ACTIONS.UPDATE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.map(emp => emp.id === action.payload.id ? action.payload : emp),
            };
        case ACTIONS.DELETE_EMPLOYEE:
            return { ...state, employees: state.employees.filter(emp => emp._id !== action.payload) };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: true, error: null };
        case ACTIONS.SET_ERROR:
            return { ...state, loading: false, error: action.payload };
        case ACTIONS.FETCH_EMPLOYEE_BY_ID:
            return { ...state, selectedEmployee: action.payload, loading: false, error: null };
        case ACTIONS.FETCH_EMPLOYEES_BY_HIRE_PERIOD:
            return { ...state, employees: action.payload, loading: false, error: null };
        case ACTIONS.CALCULATE_WEEKLY_SALARY:
            return { ...state, weeklySalary: action.payload, loading: false, error: null };
        default:
            return state;
    }
};

// مزود السياق
export const EmployeeProvider = ({ children }) => {
    const initialState = {
        employees: [],
        loading: true,
        error: null,
        selectedEmployee: null,
        weeklySalary: null,
    };

    const [state, dispatch] = useReducer(employeeReducer, initialState);
    const API_URL = `${process.env.REACT_APP_API_URL}/employees`;

    // جلب جميع الموظفين مع استخدام useCallback
    const fetchEmployees = useCallback(async () => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(API_URL);
            dispatch({ type: ACTIONS.FETCH_EMPLOYEES, payload: response.data });
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    }, [API_URL]);

    // إضافة موظف
    const createEmployee = async (employeeData) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            // إنشاء FormData وإضافة جميع البيانات
            const formData = new FormData();
            formData.append('firstName', employeeData.firstName);
            formData.append('lastName', employeeData.lastName);
            formData.append('fingerprint', employeeData.fingerprint);
            formData.append('contractStartDate', employeeData.contractStartDate);
            formData.append('contractEndDate', employeeData.contractEndDate);
            formData.append('hourlyRate', employeeData.hourlyRate);

            // إضافة الصورة إذا كانت موجودة
            if (employeeData.image) {
                formData.append('image', employeeData.image);
            }

            // إرسال الطلب مع تهيئة Content-Type
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // تحديث الحالة بعد إضافة الموظف بنجاح
            dispatch({ type: ACTIONS.ADD_EMPLOYEE, payload: response.data });
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    };


    const updateEmployee = async (id, employeeData) => {
        dispatch({ type: ACTIONS.SET_LOADING });

        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });

        try {
            const response = await axios.put(`${API_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({ type: ACTIONS.UPDATE_EMPLOYEE, payload: response.data.employee });
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير معروف';
            dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
        }
    };

    // حذف موظف
    const deleteEmployee = async (id) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            await axios.delete(`${API_URL}/${id}`);
            dispatch({ type: ACTIONS.DELETE_EMPLOYEE, payload: id });
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    };

    // جلب موظف بواسطة ID
    const fetchEmployeeById = async (id) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            dispatch({ type: ACTIONS.FETCH_EMPLOYEE_BY_ID, payload: response.data });
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    };

    // جلب الموظفين حسب فترة التعيين
    const fetchEmployeesByHirePeriod = async (startDate, endDate) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/hirePeriod`, { params: { startDate, endDate } });
            dispatch({ type: ACTIONS.FETCH_EMPLOYEES_BY_HIRE_PERIOD, payload: response.data });
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    };

    // حساب الراتب الأسبوعي
    const calculateWeeklySalary = async (id) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/${id}/salary`);
            dispatch({ type: ACTIONS.CALCULATE_WEEKLY_SALARY, payload: response.data });
            return response.data; // إرجاع الراتب الأسبوعي
        } catch (err) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return (
        <EmployeeContext.Provider value={{
            employees: state.employees,
            loading: state.loading,
            error: state.error,
            selectedEmployee: state.selectedEmployee,
            weeklySalary: state.weeklySalary,
            fetchEmployees,
            createEmployee,
            updateEmployee,
            deleteEmployee,
            fetchEmployeeById,
            fetchEmployeesByHirePeriod,
            calculateWeeklySalary,
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};
