export default async function handler(req, res) {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.Weather_API_Key;

    if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
    }

    try {
        let url;
        if (city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        } else if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        } else {
            return res.status(400).json({ error: "City or coordinates required" });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch weather data" });
    }
}