import { useDispatch } from "react-redux";
import { register, login, getMe } from '../service/auth.api';
import { setUser, setLoading, setError } from '../auth.slice';

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });

            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin(formData) {
        try {
            dispatch(setLoading(true));
            const data = await login({
                email: formData.email,
                password: formData.password,
            });
            dispatch(setUser(data));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Login failed'));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch user data'));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }
}