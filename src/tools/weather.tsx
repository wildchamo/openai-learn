export const getWeather = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
	const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

	const data = await response.json();

	return data;
};
