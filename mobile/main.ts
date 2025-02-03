// This function is called when the app navigates to this view (using a link)
async function init() {
    // initialize any data here that should be available when the view is shown
}

// This function is called when the user returns to this view from another view
async function resume(from: ResumeFrom) {
    // from.back       (true/false) if true, the user pressed the "Back" button to return to this view
    // from.dismissed  (true/false) if true, the app dismissed to return to this view
    // from.path       contains the path of the view that the user returned from
    // if any data needs to be refreshed when the user returns to this view, you can do that here:
}
