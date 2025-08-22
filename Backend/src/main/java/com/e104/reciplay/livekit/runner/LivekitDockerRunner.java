package com.e104.reciplay.livekit.runner;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class LivekitDockerRunner {

    @Value("${livekit.docker.autorun.enabled:false}")
    private boolean isAutoRunEnabled;

    @Value("${livekit.docker.run-command}")
    private String dockerRunCommand;

    @EventListener(ApplicationReadyEvent.class)
    public void runDockerContainer() {
        if (isAutoRunEnabled) {
            try {
                // Stop and remove any existing container with the same name
                executeCommand("docker", "stop", "livekit-server");
                executeCommand("docker", "rm", "livekit-server");

                // Dynamically get the absolute path of livekit.yaml
                String yamlPath = new File("livekit.yaml").getAbsolutePath();
                // Replace the placeholder with the actual path
                String finalCommand = dockerRunCommand.replace("{livekit.yaml.path}", yamlPath);

                // Start the new container
                System.out.println("Starting LiveKit container with command: " + finalCommand);
                executeCommand(finalCommand.split(" "));
                System.out.println("LiveKit container started successfully.");

                // Start streaming logs in a background thread
                streamLogs();

            } catch (IOException | InterruptedException e) {
                System.err.println("Failed to start LiveKit container: " + e.getMessage());
                Thread.currentThread().interrupt();
            }
        }
    }

    private void executeCommand(String... command) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        process.waitFor();
    }

    private void streamLogs() {
        Thread logThread = new Thread(() -> {
            try {
                ProcessBuilder processBuilder = new ProcessBuilder("docker", "logs", "-f", "livekit-server");
                processBuilder.redirectErrorStream(true);
                Process process = processBuilder.start();

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[livekit-server] " + line);
                    }
                }
            } catch (IOException e) {
                System.err.println("Error streaming LiveKit logs: " + e.getMessage());
            }
        });
        logThread.setDaemon(true); // Ensure thread doesn't block application shutdown
        logThread.start();
    }
}
