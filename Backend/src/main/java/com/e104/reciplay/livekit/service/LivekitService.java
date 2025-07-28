package com.e104.reciplay.livekit.service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LivekitService {

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public String createToken(String roomName, String participantName) {
        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));
        return token.toJwt();
    }

    public void handleWebhook(String authHeader, String body) {
        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        try {
            WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
            // TODO: Add business logic (e.g., DB updates, etc.)
        } catch (Exception e) {
            System.err.println("Error validating webhook event: " + e.getMessage());
        }
    }
}
