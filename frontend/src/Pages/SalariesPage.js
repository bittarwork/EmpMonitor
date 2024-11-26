import React, { useState, useEffect } from "react";
import PaymentModal from "../models/PaymentModal";
import SalaryCard from "../Components/SalaryCard";

const SalariesPage = () => {
    const [salaryData, setSalaryData] = useState(null);
    const [filteredData, setFilteredData] = useState(null); // State for filtered data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSalaryId, setSelectedSalaryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

    const fetchSalaryData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/salary/salaries`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSalaryData(data);
                    setFilteredData(data);
                } else {
                    console.error("Expected an array but received:", data);
                    setSalaryData([]);
                    setFilteredData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching salary data:", error);
                setSalaryData([]);
                setFilteredData([]);
            });
    };
    

    // Fetch salary data on component mount
    useEffect(() => {
        fetchSalaryData();
    }, []); // This ensures data is fetched when the page first loads

    // Handle payment submission and update salary data
    const handlePaymentSubmit = (paymentData) => {
        fetch(`${process.env.REACT_APP_API_URL}/salary/pay`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
        })
            .then((response) => response.json())
            .then(() => {
                fetchSalaryData(); // Re-fetch salary data after payment
                setIsModalOpen(false); // Close the modal after payment
            })
            .catch((error) => {
                console.error("خطأ أثناء معالجة الدفعة:", error);
                alert("حدث خطأ أثناء معالجة الدفعة. يرجى المحاولة لاحقًا.");
            });
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Check if there's a query and filter the data
        if (query) {
            const filtered = salaryData.filter((salary) => {
                // Combine firstName and lastName into a full name string
                const fullName = `${salary.employee.firstName} ${salary.employee.lastName}`.toLowerCase();
                return fullName.includes(query.toLowerCase());
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(salaryData); // Reset filtered data if search query is empty
        }
    };

    // If salary data is not available, show loading message
    if (!salaryData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">جارٍ التحميل...</span>
            </div>
        );
    }

    return (
        <div className="overflow-auto w-full" dir="rtl">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700">معلومات الرواتب</h1>

            {/* Add the Search Box and Refresh Button Side by Side */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="بحث حسب الاسم"
                    className="border p-2 rounded-md w-1/2 md:w-1/3"
                />
                <button
                    onClick={fetchSalaryData}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    تحديث الصفحة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-2">
                {filteredData.map((salary) => (
                    salary.employee && (
                        <SalaryCard
                            key={salary._id}
                            salary={salary}
                            onAddPayment={(salaryId) => {
                                setSelectedSalaryId(salaryId);
                                setIsModalOpen(true);
                            }}
                        />
                    )

                ))}
            </div>
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handlePaymentSubmit}
                salaryId={selectedSalaryId}
            />
        </div>
    );
};

export default SalariesPage;
