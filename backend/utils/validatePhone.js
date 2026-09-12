export const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
};