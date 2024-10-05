import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// إعداد المتغير API_URL
const API_URL = process.env.REACT_APP_API_URL;

// إنشاء الكونتيكست
export const EmployeeContext = createContext();

// إعداد الحالات
const initialState = {
    employees: [],
    loading: true,
    error: null,
    selectedEmployee: null, // إضافة الحالة selectedEmployee
    weeklySalary: null, // إضافة الحالة weeklySalary
};

// تحديد الأنواع
const ACTIONS = {
    FETCH_EMPLOYEES: 'FETCH_EMPLOYEES',
    ADD_EMPLOYEE: 'ADD_EMPLOYEE',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
    FETCH_EMPLOYEE_BY_ID: 'FETCH_EMPLOYEE_BY_ID',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    FETCH_EMPLOYEES_BY_HIRE_PERIOD: 'FETCH_EMPLOYEES_BY_HIRE_PERIOD',
    CALCULATE_WEEKLY_SALARY: 'CALCULATE_WEEKLY_SALARY',
};

// إعداد الـ Reducer
const employeeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_EMPLOYEES:
            return { ...state, employees: action.payload, loading: false };
        case ACTIONS.ADD_EMPLOYEE:
            return { ...state, employees: [...state.employees, action.payload] };
        case ACTIONS.UPDATE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.map(emp =>
                    emp._id === action.payload._id ? action.payload : emp
                ),
            };
        case ACTIONS.DELETE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.filter(emp => emp._id !== action.payload),
            };
        case ACTIONS.FETCH_EMPLOYEE_BY_ID:
            return {
                ...state,
                selectedEmployee: action.payload,
            };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: true };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
        case ACTIONS.FETCH_EMPLOYEES_BY_HIRE_PERIOD:
            return { ...state, employees: action.payload };
        case ACTIONS.CALCULATE_WEEKLY_SALARY:
            return {
                ...state,
                weeklySalary: action.payload,
            };
        default:
            return state;
    }
};

const EmployeeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(employeeReducer, initialState);

    // دالة لجلب جميع الموظفين
    const fetchEmployees = async () => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/employees`);
            dispatch({ type: ACTIONS.FETCH_EMPLOYEES, payload: response.data });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لإنشاء موظف جديد
    const createEmployee = async (employeeData, image) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(`${API_URL}/employees`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({ type: ACTIONS.ADD_EMPLOYEE, payload: response.data.employee });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لتحديث بيانات الموظف
    const updateEmployee = async (id, employeeData, image) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            formData.append(key, employeeData[key]);
        });
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`${API_URL}/employees/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({ type: ACTIONS.UPDATE_EMPLOYEE, payload: response.data.employee });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لحذف موظف
    const deleteEmployee = async (id) => {
        try {
            await axios.delete(`${API_URL}/employees/${id}`);
            dispatch({ type: ACTIONS.DELETE_EMPLOYEE, payload: id });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لجلب موظف بواسطة ID
    const fetchEmployeeById = async (id) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/employees/${id}`);
            dispatch({ type: ACTIONS.FETCH_EMPLOYEE_BY_ID, payload: response.data });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لجلب الموظفين الذين تم تعيينهم في فترة معينة
    const fetchEmployeesByHirePeriod = async (startDate, endDate) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/employees/hirePeriod`, {
                params: { startDate, endDate },
            });
            dispatch({ type: ACTIONS.FETCH_EMPLOYEES_BY_HIRE_PERIOD, payload: response.data });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // دالة لحساب الراتب الأسبوعي للموظف
    const calculateWeeklySalary = async (id) => {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
            const response = await axios.get(`${API_URL}/employees/${id}/salary`);
            dispatch({ type: ACTIONS.CALCULATE_WEEKLY_SALARY, payload: response.data.salary });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // استخدام useEffect لجلب الموظفين عند تحميل المكون فقط
    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <EmployeeContext.Provider value={{
            state,
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

export default EmployeeProvider; // تصدير EmployeeProvider كإفتراضي
