// Define state variables
var incidentType: string = "";
var description: string = "";
var location: Location | null = null;
var dateTime: Date = new Date();
var photoEvidence: ImageBitmap = null;
var incidentCategory: string = "";

// This function is called when the app navigates to this view (using a link)
async function init() {
    // Initialize any data here that should be available when the view is shown
    console.log("Incident Form View Loaded");
    
    // // Initialize variables
    // incidentType = "";
    // description = "";
    // location = null;
    dateTime = new Date()
    view.dateTime = dateTime
    
    let appState = await LocalDB.app_state.first();
    if (appState && appState.current_location) {
        view.location = appState.current_location;
        console.log("Loaded stored location:", view.location);
    } else {
        console.warn("No stored location found.");
    }

}

// This function is called when the user returns to this view from another view
async function resume(from: ResumeFrom) {
    console.log("HELLO - Returned from:", from.path);
    dateTime = new Date()
    view.dateTime = dateTime
    // from.back       (true/false) if true, the user pressed the "Back" button to return to this view
    // from.dismissed  (true/false) if true, the app dismissed to return to this view
    // from.path       contains the path of the view that the user returned from
    // if any data needs to be refreshed when the user returns to this view, you can do that here:
}

// Manually update incidentType when dropdown changes
function updateIncidentType(value: string) {
    console.log("IncidentType changed, new value:", value);
    incidentType = value;
}

// Manually update incidentType when dropdown changes
function updateIncidentCategory(value: string) {
    console.log("IncidentCategory changed, new value:", value);
    incidentCategory = value;
}

// Manually update description when text input changes
function updateDescription(value: string) {
    console.log("Description changed, new value:", value);
    description = value;
}


// Function to update location when coordinates are captured
function updateLocation(value: Location) {
    console.log("Location updated:", value);
    location = value;
}

// Function to update Date-time when the input changes
function updateDate(value: Date) {
    console.log("Date updated:", value);
    dateTime = value;
}

// Function to update Date-time when the input changes
function updatePhoto(value: ImageBitmap | null) {
    console.log("Photo updated:", value);
    photoEvidence = value;
}

// Reset the form / clear
function clearForm() {
    console.log("Form cleared!");
    // Reset UI-bound values
    view.incidentType = "";
    view.description = "";
    view.dateTime = null
    view.incidentCategory = "";
    view.photoEvidence = null;

    // Reset TypeScript variables to match the cleared UI
    incidentType = "";
    description = "";
    dateTime = null
    incidentCategory = "";
    photoEvidence = null;
}

// Handle form submission
async function onSubmit() {
    // Validate required fields
    console.log("incidentType:", incidentType)
    if (!incidentType) {
        await journey.dialog.error({ title: "Please select an Incident Type.", message: "Incident Type is a required field" });
        return;
    }
    if (!description || description.trim() === "") {
        await journey.dialog.simple({ title: "Please enter a description.", message: "Description is a required field" });
        return;
    }
    
        // Save the report in the database
    const newIncident = DB.incident.create({
        incidentType,
        incidentCategory,
        description,
        dateTime, // Current date and time
        location,
        photoEvidence,
    })
    
    console.log("Incident report saved to database with ID: ", newIncident.id );
    await newIncident.save();

    // Log submitted data for debugging
    console.log("Incident Submitted:", {
        incidentType: incidentType,
        description: description,
        location: location,
        photo: photoEvidence
    });

    // Show success message
    await journey.dialog.confirm({ title: "Incident report submitted successfully!", message: "Your report has been submitted." });
    clearForm();
}
