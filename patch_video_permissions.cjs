const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

// Replace the end call logic
const oldEndCall = `    if (!isParent && activeMeeting) {
      setData(prev => ({
        ...prev,
        activeMeetings: (prev.activeMeetings || []).filter(m => m.id !== activeMeeting.id)
      }));
    }`;

const newEndCall = `    if (activeMeeting && activeMeeting.hostId === currentUser?.id) {
      setData(prev => ({
        ...prev,
        activeMeetings: (prev.activeMeetings || []).filter(m => m.id !== activeMeeting.id)
      }));
    }`;

content = content.replace(oldEndCall, newEndCall);

// Remove the {!isParent && (  wrapping the creation card
// Let's just find the exact block and replace it.
content = content.replace(/{!isParent && \(/g, '{true && ('); 
// Using {true && ( preserves the indentation/closing tags easily without complex regex.

fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
console.log("VideoConference permissions patched!");
