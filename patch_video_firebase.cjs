const fs = require('fs');
let content = fs.readFileSync('src/components/views/VideoConferenceView.jsx', 'utf8');

const importAdd = `import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { db, doc, setDoc } from "../../firebase";
`;
content = content.replace(`import React, { useState, useEffect, useRef } from "react";\nimport { useApp } from "../../context/AppContext";\n`, importAdd);

const handleCreateReplace = `  const handleCreate = async (e) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
       showToast("Veuillez entrer un titre pour la réunion.", "error");
       return;
    }
    const newId = Math.random().toString(36).substring(2, 9);
    
    const newMeeting = {
       id: newId,
       title: meetingTitle,
       createdAt: new Date().toISOString(),
       hostId: currentUser?.id,
       hostName: currentUser?.first_name || currentUser?.role_id || "Professeur"
    };
    
    const newList = [newMeeting, ...(data?.activeMeetings || [])];
    
    setData(prev => ({
       ...prev,
       activeMeetings: newList
    }));
    
    await setDoc(doc(db, "meetings", "active"), { list: newList });

    setActiveMeeting(newMeeting);
    setInCall(true);
    showToast("Création de la salle de réunion...");
  };`;
  
content = content.replace(/  const handleCreate = \(e\) => \{[\s\S]*?showToast\("Création de la salle de réunion\.\.\."\);\n  \};/, handleCreateReplace);

const handleEndCallReplace = `  const handleEndCall = async () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    
    if (activeMeeting && activeMeeting.hostId === currentUser?.id) {
      const newList = (data?.activeMeetings || []).filter(m => m.id !== activeMeeting.id);
      setData(prev => ({
        ...prev,
        activeMeetings: newList
      }));
      await setDoc(doc(db, "meetings", "active"), { list: newList });
    }
    
    setActiveMeeting(null);
    setInCall(false);
    showToast("Appel terminé.");
  };`;
  
content = content.replace(/  const handleEndCall = \(\) => \{[\s\S]*?showToast\("Appel terminé\."\);\n  \};/, handleEndCallReplace);

fs.writeFileSync('src/components/views/VideoConferenceView.jsx', content);
console.log("VideoConference patched for firebase!");
