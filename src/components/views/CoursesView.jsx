import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, X } from "lucide-react";
import { School, GraduationCap, Award, BookOpen, Clock } from "lucide-react";
export function CoursesView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ nom: "", classe_id: "", enseignant_id: "", coefficient: 1, volume_horaire: 1, syllabus_url: "" });
  const { data, setData, currentUser, showToast } = useApp();
  let displayedCours = data.cours;
  if (currentUser?.role === "ENSEIGNANT") {
    const teacherRecord = data.enseignants.find(
      (t) => t.email === currentUser.email,
    );
    if (teacherRecord) {
      displayedCours = data.cours.filter(
        (c) => c.enseignant_id === teacherRecord.id,
      );
    } else {
      displayedCours = [];
    }
  }
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.nom) return;
    setData(prev => ({
        ...prev,
        cours: [...prev.cours, {
            id: Math.max(...prev.cours.map(c => c.id), 0) + 1,
            ...newCourse,
            classe_id: newCourse.classe_id ? Number(newCourse.classe_id) : null,
            enseignant_id: newCourse.enseignant_id ? Number(newCourse.enseignant_id) : null,
        }]
    }));
    showToast("Cours ajouté avec succès !");
    setIsAddModalOpen(false);
  };
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {" "}
      <div>
        {" "}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
          {" "}
          Programme des Cours & Matières{" "}
        </h2>{" "}
        <p className="text-xs sm:text-sm text-[#F5F9FF]0">
          {" "}
          Syllabus officiels, pondérations et coefficients de délibération{" "}
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {displayedCours.map((course) => {
          const teacher = data.enseignants.find(
            (t) => t.id === course.enseignant_id,
          );
          const option = data.options.find((o) => o.id === course.option_id);
          return (
            <div
              key={course.id}
              className="bg-blue-500/10 hover:bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15/60 rounded-2xl p-5 transition space-y-3 flex flex-col justify-between"
            >
              {" "}
              <div className="space-y-2.5">
                {" "}
                <div className="flex items-start justify-between gap-3">
                  {" "}
                  <div>
                    {" "}
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                      {" "}
                      {course.code}{" "}
                    </span>{" "}
                    <h3 className="text-sm font-bold text-white font-heading mt-0.5">
                      {" "}
                      {course.nom}{" "}
                    </h3>{" "}
                  </div>{" "}
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-[#94C5FF]/15">
                    {" "}
                    Coeff {course.coefficient}{" "}
                  </span>{" "}
                </div>{" "}
                <p className="text-xs text-[#line-clamp-2">
                  {" "}
                  {course.description}{" "}
                </p>{" "}
              </div>{" "}
              <div className="pt-3 border-t border-[#94C5FF]/15 C5FF]/15 space-y-1.5 text-xs">
                {" "}
                <div className="flex items-center gap-2 text-slate-700">
                  {" "}
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />{" "}
                  <span>
                    Enseignant :{" "}
                    <strong>
                      {teacher
                        ? `${teacher.nom} ${teacher.prenom}`
                        : "Non assigné"}
                    </strong>
                  </span>{" "}
                </div>{" "}
                {option && (
                  <div className="text-[11px] text-[#F5F9FF]0">
                    {" "}
                    Option :{" "}
                    <span className="text-blue-300">{option.nom}</span>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {" "}
          <div className="bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl w-full max-w-md overflow-hidden">
            {" "}
            <div className="p-4 border-b border-[#94C5FF]/15 flex justify-between items-center bg-blue-500/10">
              {" "}
              <h2 className="text-lg font-bold text-white">
                Ajouter un Cours
              </h2>{" "}
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#hover:text-white p-1"
              >
                {" "}
                <X className="w-5 h-5" />{" "}
              </button>{" "}
            </div>{" "}
            <form onSubmit={handleAddCourse} className="p-4 space-y-4">
              {" "}
              <div>
                {" "}
                <label className="text-xs font-bold text-[#block mb-1">
                  Nom du cours
                </label>{" "}
                <input
                  type="text"
                  required
                  value={newCourse.nom}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, nom: e.target.value })
                  }
                  className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Mathématiques, Histoire..."
                />{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <div>
                  {" "}
                  <label className="text-xs font-bold text-[#block mb-1">
                    Pondération / Coeff
                  </label>{" "}
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCourse.coefficient}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        coefficient: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="text-xs font-bold text-[#block mb-1">
                    Heures (Vol. Horaire)
                  </label>{" "}
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCourse.volume_horaire}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        volume_horaire: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="text-xs font-bold text-[#block mb-1">
                  Classe
                </label>{" "}
                <select
                  value={newCourse.classe_id}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, classe_id: e.target.value })
                  }
                  className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {" "}
                  <option value="">-- Tronc commun (Toutes) --</option>{" "}
                  {data.classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="text-xs font-bold text-[#block mb-1">
                  Enseignant
                </label>{" "}
                <select
                  value={newCourse.enseignant_id}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      enseignant_id: e.target.value,
                    })
                  }
                  className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {" "}
                  <option value="">-- Non attribué --</option>{" "}
                  {data.enseignants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom} {t.prenom}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="text-xs font-bold text-[#block mb-1">
                  Lien Syllabus (Optionnel)
                </label>{" "}
                <input
                  type="url"
                  value={newCourse.syllabus_url}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, syllabus_url: e.target.value })
                  }
                  className="w-full bg-[#12305A]/45 A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md border border-[#94C5FF]/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />{" "}
              </div>{" "}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                {" "}
                Créer le cours{" "}
              </button>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
