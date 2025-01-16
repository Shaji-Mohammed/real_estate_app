import {Alert} from "react-native";
import {useEffect, useState, useCallback} from "react";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
    fn,
    params = {} as P,
    skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (fetchParams: P) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fn(fetchParams);
            setData(result);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "An Unknown Error Occured";
            setError(errorMsg);
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    }, [fn]);

    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, []);

    const refetch = async (newParams: P) => await fetchData(newParams);
    return {data, loading, error, refetch};
}
