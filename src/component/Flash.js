import React from "react";

class FlashingWindow extends React.Component {
  componentDidMount() {
    // Request permission for notifications
    Notification.requestPermission();

    // Start flashing the window
    this.flashWindow();
  }

  componentWillUnmount() {
    // Stop flashing the window
    this.stopFlashing();
  }

  flashWindow = () => {
    // Show a notification
    const notification = new Notification("Trả lời câu hỏi", {
      body: "Trở về website",
      silent: true, // Prevent sound from playing
    });

    // Flash the window when the notification is clicked
    notification.onclick = () => {
      // Focus on the browser window
      window.focus();

      // Close the notification
      notification.close();
    };

    // Schedule the next flash after a delay
    this.flashTimeout = setTimeout(this.flashWindow, 10000);
  };

  stopFlashing = () => {
    // Clear the flash timeout
    clearTimeout(this.flashTimeout);
  };

  render() {
    return <div>Trả lời câu hỏi</div>;
  }
}

export default FlashingWindow;
