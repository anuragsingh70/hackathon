# Explorer AI - User Manual

Welcome to Explorer AI! This guide will help you get the most out of our survival knowledge chatbot.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Using the Chat Interface](#using-the-chat-interface)
3. [Viewing Chat History](#viewing-chat-history)
4. [Location Services](#location-services)
5. [Voice Features](#voice-features)
6. [Tips & Tricks](#tips--tricks)
7. [FAQ](#faq)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Browser Version

1. Open your web browser
2. Navigate to: `http://localhost:8000`
3. The chat interface will load automatically

### Desktop Version

1. Double-click the Explorer AI application icon
2. The app window will open with the full interface
3. You can now start asking questions

## Using the Chat Interface

### How to Ask Questions

1. **Click** the message input field at the bottom of the screen
2. **Type** your survival-related question (e.g., "How do I build a shelter?")
3. **Press** Enter or click the Send button
4. Explorer AI will respond with relevant information from its knowledge base

### Conversation Tips

- **Be Specific**: More detailed questions yield better answers
  - ✅ "How do I make a fire without matches in a wet environment?"
  - ❌ "How do I make fire?"

- **Ask Follow-up Questions**: You can continue asking related questions
  - "What materials work best for kindling?"
  - "How do I protect my fire from wind?"

- **Use Natural Language**: Ask questions the way you would normally speak
  - "I'm lost in the forest, what should I do?"
  - "How do I find clean water?"

### Common Topics

Explorer AI has knowledge about:

- **Shelter Building**: Techniques, materials, weather protection
- **Fire Management**: Starting, maintaining, and safety
- **Water Finding**: Sources, purification, storage
- **Food**: Identification, foraging, hunting basics
- **Navigation**: Compass use, landmarks, stars
- **First Aid**: Basic treatment, wound care
- **Signaling**: Rescue signals, communication methods
- **Weather**: Predicting, protection, seasonal issues

## Viewing Chat History

### Accessing History

- Your conversations are automatically saved
- View previous messages within the current session
- Scroll up in the chat window to see earlier messages

### History Management

- **Auto-saved**: All messages are saved locally on your device
- **Persistent**: History is maintained between sessions (on desktop app)
- **Clear History**: Use the settings menu to clear all conversations (if available)

### Exporting Conversations

For desktop app users:
- Look for the "Export" button in the menu
- Save your chat history as a file for backup

## Location Services

### Enabling Location Services

1. Click the **Location** button (usually a pin icon)
2. Grant permission when your browser asks
3. The app will determine your approximate location

### What Location Services Do

- Help find nearby emergency services
- Provide location-specific survival tips
- Adjust recommendations based on climate/geography
- Include local resource information

### Privacy Note

Location data is:
- Processed locally on your device
- Not stored permanently
- Only used to enhance recommendations
- Handled according to your browser's privacy settings

## Voice Features

### Desktop App Voice Input

Explorer AI's desktop app supports voice capture for hands-free operation.

#### Using Voice Input

1. **Activate**: Click the microphone icon or press the voice shortcut
2. **Speak Clearly**: State your question in a normal voice
3. **Complete**: The app will process your speech when you finish
4. **Review**: Read the transcribed text before sending
5. **Send**: Confirm or edit before sending to the bot

#### Voice Tips

- Speak clearly and at a normal pace
- Minimize background noise
- Use natural phrasing
- Wait for the mic to turn red before speaking
- Stop speaking when the mic turns blue

### Text-to-Speech

Some responses may include audio playback:
- Click the speaker icon to hear responses read aloud
- Adjust volume using system controls
- Useful while multitasking or traveling

## Tips & Tricks

### Pro Tips

1. **Save Important Answers**: Copy critical survival information to a text file for offline access

2. **Build a Checklist**: Use response information to create survival kits
   - Shelter materials needed
   - Fire-starting supplies
   - First aid items

3. **Chain Questions**: Ask follow-ups to build a comprehensive survival plan
   - "What are the top 5 priorities when lost?"
   - "What should I do first?"
   - "What materials are nearby that I can use?"

4. **Learning Mode**: Use the app as a learning tool
   - Ask "What are the basics of..."
   - Request step-by-step guides
   - Ask about common mistakes to avoid

5. **Scenario Practice**: Present hypothetical situations
   - "I'm stranded in a desert with just a backpack. What should I do?"
   - "I'm lost in a forest at night..."
   - "What if there are wild animals nearby?"

### Keyboard Shortcuts (Desktop App)

- **Ctrl+Enter**: Send message
- **Ctrl+H**: Open history
- **Ctrl+L**: Request location
- **Ctrl+M**: Toggle microphone
- **Ctrl+C**: Clear current message
- **Escape**: Close dialogs

## FAQ

### Q: Can I use this offline?

**A:** The browser version requires an internet connection. The desktop app can work with a cached knowledge base if configured. Check your installation for offline mode.

### Q: How accurate is the information?

**A:** Explorer AI uses curated survival knowledge. For life-threatening situations, always follow official emergency protocols and contact emergency services (911 in the US).

### Q: Can I ask about non-survival topics?

**A:** Explorer AI is specialized for survival knowledge. It may not provide accurate information on unrelated topics. Ask survival-specific questions for best results.

### Q: How do I report incorrect information?

**A:** If you find an inaccuracy, contact the development team through the project's GitHub repository with details about the issue.

### Q: Is my chat history private?

**A:** 
- **Browser Version**: History stored locally in your browser
- **Desktop App**: History stored on your device only
- **Server Version**: Check your deployment's privacy policy
- Data is not sent to third parties

### Q: Can I delete individual messages?

**A:** Currently, you can clear all history at once. Future versions may support selective deletion.

### Q: What if the app crashes?

**A:** Your chat history is saved locally and will be restored when you restart the app. Report crashes with details to help us improve.

## Troubleshooting

### Common Issues

#### The chat doesn't respond

**Solutions:**
1. Wait a few seconds for processing
2. Check your internet connection
3. Ensure the backend server is running: `python backend\server.py`
4. Check browser console for error messages (F12)
5. Restart the app

#### Location services aren't working

**Solutions:**
1. Grant permission when the browser asks
2. Check your device's location settings
3. Try disabling and re-enabling location services
4. Clear browser cache and cookies
5. Try a different browser

#### Voice input isn't recognized

**Solutions:**
1. Check microphone permissions in system settings
2. Test microphone in system settings
3. Close other apps using the microphone
4. Reduce background noise
5. Speak more clearly and slowly
6. Update your browser

#### Chat history disappeared

**Solutions:**
1. Check browser storage isn't full
2. Ensure you're not in Private/Incognito mode
3. Don't clear browser data (or it will delete history)
4. Export history regularly for backup
5. Check if history was manually cleared

#### App is slow or laggy

**Solutions:**
1. Close other applications
2. Refresh the page (Ctrl+R or Cmd+R)
3. Clear browser cache
4. Check internet connection speed
5. Restart the backend server
6. Try a different browser

#### Backend connection errors

**Solutions:**
1. Ensure backend is running: `python backend\server.py`
2. Check if port 8001 is in use: `netstat -ano | findstr :8001` (Windows)
3. Verify firewall isn't blocking localhost:8001
4. Check backend console for error messages
5. Verify all files are present in `backend/data/`

### Getting More Help

1. **Check the README**: See [readme.md](readme.md) for technical setup
2. **Review Contributing Guidelines**: See [CONTRIBUTING.md](CONTRIBUTING.md) for known issues
3. **Contact Support**: Open an issue on the project repository with:
   - Device/OS information
   - Browser/App version
   - Exact error message
   - Steps to reproduce

---

**Need Help?** Refer to the [Contribution Guidelines](CONTRIBUTING.md) or check the main [README](readme.md) for technical support.

**Have Feedback?** We'd love to hear how to improve Explorer AI!
