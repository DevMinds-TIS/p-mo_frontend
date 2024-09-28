// src/utils/auth.ts
export const getUserFromToken = (token: string) => {
    if (!token) return null;

    try {
        // Assuming the token is a JWT, you can decode it
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
        return payload.user; // Adjust based on your token structure
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
