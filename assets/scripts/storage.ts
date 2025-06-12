import AsyncStorage from '@react-native-async-storage/async-storage';

const COUNTER_KEY = 'server_counter';

export const saveInfo = async (info: {
    domain: string;
    type: string;
    version: string;
    name: string;
    jar_url: string
}) => {
    const key = await getNextServerKey()
    await AsyncStorage.setItem(key, JSON.stringify(info));

    console.log(`Successfully saved:`, info, ` in key: ${key}`)
}



export const getNextServerKey = async (): Promise<string> => {
    try {
        const current = await AsyncStorage.getItem(COUNTER_KEY);
        const currentNumber = current ? parseInt(current, 10) : 0;
        const nextNumber = currentNumber + 1;
        await AsyncStorage.setItem(COUNTER_KEY, nextNumber.toString());
        return `server_${nextNumber}`; // your new key
    } catch (e) {
        console.error('Failed to get next server key:', e);
        return `server_1`; // fallback
    }
};

export const loadInfo = async (key: string) => {
    const jsonValue = await AsyncStorage.getItem(`server_${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
}

export const getAllServers = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const serverKeys = keys.filter(k => k.startsWith('server_'));
    const items = await AsyncStorage.multiGet(serverKeys);

    return items.map(([key, value]) => ({
        id: key.replace('server_', ''),
        ...(value ? JSON.parse(value) : {})
    }))
        .sort((a, b) => a.id - b.id);
}

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        console.log("Cleared Storage");
    } catch (e) {
        console.error("Failed to clear Storage, " + e);
    }
}