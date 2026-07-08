import { useDispatch } from "react-redux";
import { register, login, getMe } from '../service/auth.api';
import { setUser, setLoading, setError } from '../auth.slice';



export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister(formData) {
        try {
            dispatch(setLoading(true));
            const data = await register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });

        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'));
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
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Login failed'));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch user data'));
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