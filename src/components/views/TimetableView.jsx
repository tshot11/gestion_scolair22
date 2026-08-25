import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  ChevronRight,
  BookOpen,
} from "lucide-react";
export function TimetableView() {
  const { data, currentUser } = useApp();
  let displayedClasses = data.classes;
  if (currentUser?.role === "ENSEIGNANT") {
    const teacherRecord = data.enseignants.find(
      (t) => t.email === currentUser.email,
    );
    if (teacherRecord) {
      displayedClasses = data.classes.filter(
        (c) =>
          c.prof_id === teacherRecord.id ||
          data.cours.some(
            (cours) =>
              cours.enseignant_id === teacherRecord.id &&
              (cours.classe_id === c.id || !cours.classe_id),
          ),
      );
    } else {
      displayedClasses = [];
    }
  }
  const [selectedClassId, setSelectedClassId] = useState(6);
  const currentClass = data.classes.find((c) => c.id === selectedClassId);
  const classSchedules = data.horaires.filter(
    (h) => h.classe_id === selectedClassId,
  );
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {" "}
      {/* Top Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
            {" "}
            Emploi du Temps Hebdomadaire{" "}
          </h2>{" "}
          <p className="text-xs sm:text-sm text-[#F5F9FF]0">
            {" "}
            Planning des cours et occupation des salles par classe{" "}
          </p>{" "}
        </div>{" "}
        <div className="w-full sm:w-64">
          {" "}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
            className="w-full bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {" "}
            {displayedClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      {/* Timetable Schedule Grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {days.map((day) => {
          const dayItems = classSchedules.filter(
            (h) => h.jour.toLowerCase() === day.toLowerCase(),
          );
          return (
            <div
              key={day}
              className="bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/40 rounded-2xl border border-[#94C5FF]/15/60 p-4 space-y-3"
            >
              {" "}
              <div className="flex items-center justify-between pb-2 border-b border-[#94C5FF]/15/60">
                {" "}
                <span className="text-sm font-bold text-white font-heading">
                  {day}
                </span>{" "}
                <span className="text-xs text-[#F5F9FF]0">
                  {dayItems.length} cours
                </span>{" "}
              </div>{" "}
              {dayItems.length === 0 ? (
                <div className="py-8 text-center text-[#B8C7DF] text-xs">
                  {" "}
                  Aucun cours programmé{" "}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {" "}
                  {dayItems.map((item) => {
                    const course = data.cours.find(
                      (c) => c.id === item.cours_id,
                    );
                    const teacher = data.enseignants.find(
                      (t) => t.id === item.enseignant_id,
                    );
                    const room = data.salles.find(
                      (s) => s.id === item.salle_id,
                    );
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/80 backdrop-blur-md border border-[#94C5FF]/15/60 space-y-1.5"
                      >
                        {" "}
                        <div className="flex items-center justify-between text-xs">
                          {" "}
                          <span className="font-bold text-blue-400 font-mono">
                            {" "}
                            {item.heure_debut} - {item.heure_fin}{" "}
                          </span>{" "}
                          <span className="text-[10px] px-2 py-0.5 rounded-[14px] bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md text-slate-700 border border-[#94C5FF]/15">
                            {" "}
                            {room ? room.code : "Salle"}{" "}
                          </span>{" "}
                        </div>{" "}
                        <div className="text-xs font-bold text-white">
                          {" "}
                          {course ? course.nom : "Matière"}{" "}
                        </div>{" "}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#F5F9FF]0">
                          {" "}
                          <GraduationCap className="w-3 h-3 text-purple-400" />{" "}
                          <span>
                            {teacher
                              ? `${teacher.nom} ${teacher.prenom}`
                              : "Prof"}
                          </span>{" "}
                        </div>{" "}
                      </div>
                    );
                  })}{" "}
                </div>
              )}{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
}
