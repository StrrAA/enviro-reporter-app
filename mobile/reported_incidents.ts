// Mock data for reported incidents
let mockIncidents = [
    {
        id: "1",
        incidentType: "Environmental",
        incidentCategory: "Tornado",
        description: "Large tornado spotted near downtown.",
        dateTime: "2024-02-03T14:30:00Z",
        location: { latitude: 40.7128, longitude: -74.0060 },
        photoEvidence: "photo1.jpg"
    },
    {
        id: "2",
        incidentType: "Construction",
        incidentCategory: "Equipment Malfunction",
        description: "Crane failure on a construction site.",
        dateTime: "2024-02-03T09:15:00Z",
        location: { latitude: 34.0522, longitude: -118.2437 },
        photoEvidence: "photo2.jpg"
    }
];

// This function is called when the app navigates to this view (using a link)
async function init() {
    // initialize any data here that should be available when the view is shown
    console.log("Reported Incidents View Loaded");
    
    // Check if we already have mock data
    let existingIncidents = await DB.incident.all().count();
    if (existingIncidents === 0) {
        console.log("No incidents found, inserting mock data...");
        await insertMockData();
    }

    // Retrieve incidents from the database and bind them to the query
    view.incidents = DB.incident.all();
}

// This function is called when the user returns to this view from another view
async function resume(from: ResumeFrom) {
    // from.back       (true/false) if true, the user pressed the "Back" button to return to this view
    // from.dismissed  (true/false) if true, the app dismissed to return to this view
    // from.path       contains the path of the view that the user returned from
    // if any data needs to be refreshed when the user returns to this view, you can do that here:
}

// Function to get all reported incidents
function getIncidents() {
    return mockIncidents;
}

// Function to insert mock data into the database
async function insertMockData() {
    await DB.incident.create({
        incidentType: "Environmental",
        incidentCategory: "Tornado",
        description: "Large tornado spotted near downtown.",
        dateTime: new Date("2024-02-03T14:30:00Z"),
        location: { latitude: 40.7128, longitude: -74.0060 }
    }).save();

    await DB.incident.create({
        incidentType: "Construction",
        incidentCategory: "Equipment Malfunction",
        description: "Crane failure on a construction site.",
        dateTime: new Date("2024-02-03T09:15:00Z"),
        location: { latitude: 34.0522, longitude: -118.2437 }
    }).save();
    

    console.log("Mock data inserted.");
}

// Function to delete an incident
async function deleteIncident(id: string) {
    console.log("Incident ID: ", id)
    // Confirm deletion with the user
    let confirmDelete = await journey.dialog.confirm({
        title: "Delete Incident?",
        message: "Are you sure you want to delete this incident?",
        okButton: "Delete",
        cancelButton: "Cancel"
    });

    if (!confirmDelete) {
        return;
    }

    // ✅ Retrieve the incident using .first()
    let incident = await DB.incident.first({ id: id });
    if (!incident) {
        console.log("Incident not found. ID: ", id);
        return;
    }

    // ✅ Delete the incident using .destroy()
    await incident.destroy();
    console.log("Incident deleted:", id);

    // Refresh the table
    view.incidents = DB.incident.all();
}
