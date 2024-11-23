import React, { useEffect, useState } from 'react';

const MaterialStatistics = () => {
    const [materials, setMaterials] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [highestPriceMaterial, setHighestPriceMaterial] = useState({});
    const [mostQuantityMaterial, setMostQuantityMaterial] = useState({});

    useEffect(() => {
        // جلب البيانات من الـ API
        fetch(`${process.env.REACT_APP_API_URL}/materials`)
            .then((response) => response.json())
            .then((data) => {
                setMaterials(data);
                calculateStatistics(data);
            })
            .catch((error) => console.error('Error fetching data: ', error));
    }, []);

    const calculateStatistics = (data) => {
        let totalQuantity = 0;
        let totalValue = 0;
        let highestPrice = { price: 0 };
        let mostQuantity = { quantity: 0 };

        data.forEach((material) => {
            // التأكد من أن الحقول موجودة وصحيحة قبل استخدامها
            const materialPrice = material.price || 0;
            const materialQuantity = material.quantity || 0;

            totalQuantity += materialQuantity;
            totalValue += materialPrice * materialQuantity;

            if (materialPrice > highestPrice.price) {
                highestPrice = material;
            }

            if (materialQuantity > mostQuantity.quantity) {
                mostQuantity = material;
            }
        });

        setTotalQuantity(totalQuantity);
        setTotalValue(totalValue);
        setHighestPriceMaterial(highestPrice);
        setMostQuantityMaterial(mostQuantity);
    };

    const formatCurrency = (value) => {
        return value ? value.toLocaleString() : '0';
    };

    return (
        <div className="bg-gray-50 p-6 mb-10 rounded-lg" dir="rtl">
            <h1 className="text-3xl font-bold text-center">إحصائيات المواد</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-blue-700">إجمالي الكمية</h2>
                    <p className="text-lg text-blue-900">{formatCurrency(totalQuantity)} وحدة</p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-green-700">إجمالي القيمة</h2>
                    <p className="text-lg text-green-900">{formatCurrency(totalValue)} ليرة سورية</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-yellow-700">أعلى المواد سعرًا</h2>
                    <p className="text-lg text-yellow-900">{highestPriceMaterial.name || 'غير محدد'}</p>
                    <p className="text-lg text-yellow-900">{formatCurrency(highestPriceMaterial.price)} ليرة سورية</p>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-purple-700">أكثر المواد كمية</h2>
                    <p className="text-lg text-purple-900">{mostQuantityMaterial.name || 'غير محدد'}</p>
                    <p className="text-lg text-purple-900">{formatCurrency(mostQuantityMaterial.quantity)} وحدة</p>
                </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold text-gray-700">تفاصيل المواد</h2>
                <table className="min-w-full mt-4 table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-right">اسم المادة</th>
                            <th className="px-4 py-2 text-right">السعر</th>
                            <th className="px-4 py-2 text-right">الكمية</th>
                            <th className="px-4 py-2 text-right">إجمالي القيمة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material) => (
                            <tr key={material._id} className="border-b hover:bg-gray-200">
                                <td className="px-4 py-2">{material.name}</td>
                                <td className="px-4 py-2">{formatCurrency(material.price)} ليرة سورية</td>
                                <td className="px-4 py-2">{formatCurrency(material.quantity)} وحدة</td>
                                <td className="px-4 py-2">
                                    {formatCurrency(material.price * material.quantity)} ليرة سورية
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialStatistics;
