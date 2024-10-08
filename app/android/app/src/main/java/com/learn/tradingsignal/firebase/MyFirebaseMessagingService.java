package com.learn.tradingsignal.firebase;

import android.content.Intent;
import android.text.TextUtils;

import com.learn.tradingsignal.MainActivity;
import com.learn.tradingsignal.util.Pref;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/**
 * Created by dragank on 9/7/2016.
 */
public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";
    private static final String ANDROID_ID = "com.learn.android.firebase.MyFirebaseMsgService";

    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        String url = remoteMessage.getData().get("URL");

        if (!TextUtils.isEmpty(url)) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra(Intent.EXTRA_TEXT, url);
            intent.setType("text/plain");
            startActivity(intent);
        }
    }

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        Pref.setValue(this, Pref.FIREBASE_TOKEN, s);
    }
}