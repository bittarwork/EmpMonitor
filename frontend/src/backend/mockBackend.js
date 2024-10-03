// mockBackend.js
export const mockLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // افتراض أن البريد الإلكتروني وكلمة المرور صحيحة
            if (email === 'john@example.com' && password === 'password123') {
                resolve({
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    token: 'fake-jwt-token',
                });
            } else {
                reject('Invalid email or password');
            }
        }, 1000); // تأخير محاكاة الشبكة
    });
};

export const mockLogout = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Logged out successfully');
        }, 500); // تأخير محاكاة الشبكة
    });
};
