import * as FileSystem from 'expo-file-system';

export async function makeServer(name: string, jarUrl: string) {
    await downloadServer(jarUrl, name);
}

const downloadServer = async (jarUrl: string, server_name: string) => {
    const url = jarUrl;
    const name = "server.jar"
    const dirUri = FileSystem.documentDirectory + `servers/${server_name}/`;
    const fileUri = dirUri + name;

    try {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });

        const downloadResumable = FileSystem.createDownloadResumable(
            jarUrl,
            fileUri
        );

        const downloadResult = await downloadResumable.downloadAsync();
        const uri = downloadResult?.uri;
        console.log('downloaded to: ', uri);
    } catch (e) {
        console.log('Failed to download: ', e);
    }
}

export async function deleteAllServers() {
    const serversDir = FileSystem.documentDirectory + 'servers/';

    try {
        const dirInfo = await FileSystem.getInfoAsync(serversDir);

        if (dirInfo.exists) {
            await FileSystem.deleteAsync(serversDir, { idempotent: true });
            console.log('Deleted entire servers/ directory.');
        } else {
            console.log('No servers/ directory to delete.');
        }
    } catch (e) {
        console.error('Failed to delete servers/ directory:', e);
    }
}
