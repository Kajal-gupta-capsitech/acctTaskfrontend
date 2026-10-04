const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function getChartAccounts() {
    const response = await fetch(
        `${API_BASE_URL}/api/ChartAccount`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch chart of accounts");
    }

    return response.json();
}