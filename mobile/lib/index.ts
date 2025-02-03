// Here you can define shared TypeScript functions that you can reference from your app's views.
//
// For example, you can define a utility function such as the 'createPushNotification' function below.
// You can then import this module by adding
// import * as mymodule from "~/lib/index"
// to the top of your view TS and call this function from the view using
// mymodule.createPushNotification(user, message)

export async function createPushNotification(user, message) {
    var pushNotification = DB.push_notification.create();
    pushNotification.message = message;
    pushNotification.created_at = new Date();
    pushNotification.user(user);
    await pushNotification.save();
}
