import React, { createContext, useReducer, useEffect } from 'react';

// إعداد رابط API
const API_URL = process.env.REACT_APP_API_URL;

// إعداد الـ Context
const MaterialContext = createContext();

// تحديد الإجراءات
const ACTIONS = {
    FETCH_MATERIALS: 'FETCH_MATERIALS',
    ADD_MATERIAL: 'ADD_MATERIAL',
    UPDATE_MATERIAL: 'UPDATE_MATERIAL',
    DELETE_MATERIAL: 'DELETE_MATERIAL',
    SEARCH_MATERIALS: 'SEARCH_MATERIALS',
    TOTAL_INVENTORY_VALUE: 'TOTAL_INVENTORY_VALUE',
};

// إعداد الـ Reducer
const materialReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_MATERIALS:
            return { ...state, materials: action.payload };
        case ACTIONS.ADD_MATERIAL:
            return { ...state, materials: [...state.materials, action.payload] };
        case ACTIONS.UPDATE_MATERIAL:
            return {
                ...state,
                materials: state.materials.map((material) =>
                    material._id === action.payload._id ? action.payload : material
                ),
            };
        case ACTIONS.DELETE_MATERIAL:
            return {
                ...state,
                materials: state.materials.filter((material) => material._id !== action.payload),
            };
        case ACTIONS.SEARCH_MATERIALS:
            return { ...state, materials: action.payload };
        case ACTIONS.TOTAL_INVENTORY_VALUE:
            return { ...state, totalInventoryValue: action.payload };
        default:
            return state;
    }
};

// إعداد Provider
export const MaterialProvider = ({ children }) => {
    const [state, dispatch] = useReducer(materialReducer, { materials: [], totalInventoryValue: 0 });

    // جلب جميع المواد
    const fetchMaterials = async () => {
        try {
            const response = await fetch(`${API_URL}/materials`);
            const data = await response.json();
            dispatch({ type: ACTIONS.FETCH_MATERIALS, payload: data });
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    // إضافة مادة جديدة
    const addMaterial = async (material) => {
        try {
            const response = await fetch(`${API_URL}/materials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(material),
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.ADD_MATERIAL, payload: data.material });
        } catch (error) {
            console.error('Error adding material:', error);
        }
    };

    // تحديث مادة
    const updateMaterial = async (id, material) => {
        try {
            const response = await fetch(`${API_URL}/materials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(material),
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.UPDATE_MATERIAL, payload: data.material });
        } catch (error) {
            console.error('Error updating material:', error);
        }
    };

    // حذف مادة
    const deleteMaterial = async (id) => {
        try {
            await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
            dispatch({ type: ACTIONS.DELETE_MATERIAL, payload: id });
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    // البحث عن مواد بواسطة الاسم
    const searchMaterialsByName = async (name) => {
        try {
            const response = await fetch(`${API_URL}/materials/search?name=${name}`);
            const data = await response.json();
            dispatch({ type: ACTIONS.SEARCH_MATERIALS, payload: data });
        } catch (error) {
            console.error('Error searching materials:', error);
        }
    };




    // استخدام useEffect لجلب المواد عند تحميل التطبيق
    useEffect(() => {
        fetchMaterials();
    }, []);

    return (
        <MaterialContext.Provider value={{ state, fetchMaterials, addMaterial, updateMaterial, deleteMaterial, searchMaterialsByName }}>
            {children}
        </MaterialContext.Provider>
    );
};

// تصدير الـ Context
export const useMaterialContext = () => {
    return React.useContext(MaterialContext);
};
