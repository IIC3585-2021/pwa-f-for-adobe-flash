// Registering our Service worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
    .then(function (registration) {
        //console.log(registration.pushManager.subscribe({userVisibleOnly: true}))
        // registration.pushManager.subscribe(
        //     //---always show notification when received---
        //     {
        //         userVisibleOnly: true,
        //         // applicationServerKey: urlB64ToUint8Array(window.vapidPublicKey)
        //         applicationServerKey: window.vapidPublicKey
        //     }
        // )
            // .then(function (subscription) {
            //     console.log(subscription);
            //     console.log(subscription.toJSON())
            //     console.log('Push notification subscribed.');
            //     sendSubscriptionIDToServer(subscription);
            // })
            // .catch(function (error) {
            //     console.error('Push notification subscription error: ', error);
            // });
    });
}
//---check if push notification permission has been denied by the user---
if (Notification.permission === 'denied') {
    alert('User has blocked push notification.');    }
//---check if push notification is supported or not---
if (!('PushManager' in window)) {
    alert('Sorry, Push notification is ' + 'not supported on this browser.');
}

//---extract the subscription id and send it
// over to the REST service---
function sendSubscriptionIDToServer(subscription) {
    let subscriptionid = subscription.endpoint.split('fcm/send/')[1];
    console.log("Subscription ID", subscriptionid);
    fetch('./subscribers', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { subscriptionid : subscriptionid })
    });
}

//---subscribe to push notification---
function subscribeToPushNotification() {
    navigator.serviceWorker.ready
    .then(function(registration) {
        if (!registration.pushManager) {
            alert('This browser does not support push notification.');
            return false;
        }
        //---to subscribe push notification using pushmanager---
        registration.pushManager.subscribe(
            //---always show notification when received---
            { userVisibleOnly: true }
        )
        .then(function (subscription) {
            console.log('Push notification subscribed.');
            console.log(subscription);
            //------add the following statement------
            sendSubscriptionIDToServer(subscription);
           //---------------------------------------
            updatePushNotificationStatus(true);
        })
        .catch(function (error) {
            updatePushNotificationStatus(false);
            console.error('Push notification subscription error: ', error);
        });
    })
}

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}