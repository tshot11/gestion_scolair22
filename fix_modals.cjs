const fs = require('fs');

// Fix CoursesView
let code = fs.readFileSync('src/components/views/CoursesView.jsx', 'utf8');
code = code.replace(/import React from "react";/, 'import React, { useState } from "react";');
code = code.replace(/export function CoursesView\(\) \{/, 
  'export function CoursesView() {\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [newCourse, setNewCourse] = useState({ nom: "", classe_id: "", enseignant_id: "", coefficient: 1, volume_horaire: 1, syllabus_url: "" });');
// Fix data push
code = code.replace(/data\.cours\.push\(\{[\s\S]*?\}\);/, '/* Removed mutating push */');

fs.writeFileSync('src/components/views/CoursesView.jsx', code);

// Fix ClassesView
let classesCode = fs.readFileSync('src/components/views/ClassesView.jsx', 'utf8');
classesCode = classesCode.replace(/import React from "react";/, 'import React, { useState } from "react";');
classesCode = classesCode.replace(/export function ClassesView\(\) \{/,
  'export function ClassesView() {\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [newClass, setNewClass] = useState({ nom: "", niveau: "", local: "", titulaire_id: "" });');
// Fix data push
classesCode = classesCode.replace(/data\.classes\.push\(\{[\s\S]*?\}\);/, '/* Removed mutating push */');

fs.writeFileSync('src/components/views/ClassesView.jsx', classesCode);

