const MAP_KEY = "a648b8e37301ef6f754277e5185f3c9b"
const WEATHER_API_KEY = "467f86dd1c4ce99e62259330eccb7740"

// This function is called when the app navigates to this view (using a link)
async function init() {
    // initialize any data here that should be available when the view is shown
    // Get today's date in YYYY-MM-DD format
    let today = new Day();

    // Get start & end of today
    let startOfDay = today.startOfDay(); // 00:00:00
    let endOfDay = today.endOfDay(); // 23:59:59

    // Count incidents reported today
    let todayIncidents = await DB.incident.where("dateTime >= ? and dateTime <= ?", startOfDay, endOfDay).count();
    console.log("todayIncidents: ", todayIncidents)
    view.todayIncidentCount = Math.floor(todayIncidents);

    await fetchWildfires();
    await fetchAirQuality();

    console.log("Incidents reported today:", todayIncidents);
}

// This function is called when the user returns to this view from another view
async function resume(from: ResumeFrom) {
    // from.back       (true/false) if true, the user pressed the "Back" button to return to this view
    // from.dismissed  (true/false) if true, the app dismissed to return to this view
    // from.path       contains the path of the view that the user returned from
    // if any data needs to be refreshed when the user returns to this view, you can do that here:
    console.log("Re-triggering GPS update...");
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const reportIncident = () => {
    navigate.link("incidentform")
}

async function fetchWildfires() {
    try {
        const csvUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${MAP_KEY}/VIIRS_SNPP_NRT/world/2`;
        let response = await fetch(csvUrl);
        let csvData = await response.text();
        console.log("responseresponseresponseresponse: ", response)
        console.log("csvDatacsvDatacsvDatacsvData: ", csvData)

        // Split CSV into lines
        let lines = csvData.split("\n");

        if (lines.length < 2) {
            view.wildfireAlerts = "No Active Wildfires";
            return;
        }

        // Extract header and data rows
        let headers = lines[0].split(",");
        let dataRows = lines.slice(1).map(row => row.split(","));

        // Extract relevant columns (latitude, longitude, brightness, time)
        let wildfireLocations = dataRows.map(row => ({
            latitude: parseFloat(row[0]),
            longitude: parseFloat(row[1]),
            brightness: parseFloat(row[2]), // Temperature of fire
            time: row[5] + " " + row[6] // Date + Time
        }));

        // Count total wildfires
        let wildfireCount = wildfireLocations.length;

        // Find most severe fire (highest brightness)
        let mostSevere = wildfireLocations.reduce((max, fire) => fire.brightness > max.brightness ? fire : max, wildfireLocations[0]);

        // Format data for display
        view.wildfireAlerts = `${wildfireCount} Active Wildfires 🔥`;
        view.mostSevereFire = `🔥 Brightest Fire: ${mostSevere.brightness}K @ (${mostSevere.latitude}, ${mostSevere.longitude})`;

        console.log("Wildfire Count:", wildfireCount);
        console.log("Most Severe Fire:", mostSevere);
    } catch (error) {
        console.error("Error fetching wildfire data:", error);
        view.wildfireAlerts = "Error Fetching Data";
    }
}

async function fetchAirQuality() {
    try {
        // Show loading state
        view.airQuality = "⏳ Loading...";

        // ✅ Try to get fresh location first
        let location = view.currentLocation;

        // ✅ Check if we have a stored location in LocalDB
        let appState = await LocalDB.app_state.first();
        if (!appState) {
            appState = await LocalDB.app_state.create();
        }

        // ✅ If fresh location is empty, use last stored location
        if (!location || !location.latitude || !location.longitude) {
            location = appState.current_location;
            view.currentLocation = appState.current_location;
        }

        if (!location || !location.latitude || !location.longitude) {
            view.airQuality = "⚠️ Location Not Available";
            return;
        }

        // ✅ Store the latest location locally (not synced to backend)
        appState.current_location = location;
        await appState.save();

        // Dynamic GPS location
        const { latitude, longitude } = location;

        const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data && data.list && data.list.length > 0) {
            let aqi = data.list[0].main.aqi;
            view.airQuality = interpretAQI(aqi);
        } else {
            view.airQuality = "Data Unavailable";
        }

        console.log("Air Quality Data:", view.airQuality);
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        view.airQuality = "Error Fetching Data";
    }
}

// Convert Air Quality Index (AQI) to understandable Text
function interpretAQI(aqi: number) {
    switch (aqi) {
        case 1: return "🟢 Good";
        case 2: return "🟡 Fair";
        case 3: return "🟠 Moderate";
        case 4: return "🔴 Poor";
        case 5: return "🟣 Very Poor";
        default: return "Unknown";
    }
}



function buttonPress() {
    // TODO implement
}