import * as Updates from 'expo-updates';

async function checkForUpdates() {
    try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            alert('Cập nhật mới đã được tải xuống. Ứng dụng sẽ khởi động lại.');
            await Updates.reloadAsync();
        }
    } catch (e) {
        console.error(e);
        alert('Đã xảy ra lỗi khi kiểm tra cập nhật.');
    }
}

