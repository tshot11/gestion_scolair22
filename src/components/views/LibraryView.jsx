import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Book, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  FileText, 
  Video, 
  ShoppingCart,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';

export function LibraryView() {
  const { data, showToast, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pdf, video, memory
  
  const libraryItems = [
    { id: 1, title: 'Mathématiques - 1ère Primaire', type: 'pdf', author: 'École d\'Excellence', size: '2.4 MB', price: 0, required: true },
    { id: 2, title: 'Histoire du Congo (Manuel)', type: 'book', author: 'Isidore Ndaywel', price: 15, required: false },
    { id: 3, title: 'Expériences de Physique', type: 'video', author: 'Prof. Kabasele', duration: '45 min', price: 0, required: false },
    { id: 4, title: 'Mémoire: L\'impact du numérique', type: 'memory', author: 'Ancien Élève', size: '1.8 MB', price: 0, required: false }
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.author.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    return matchSearch && matchType;
  });

  const handleBuy = (item) => {
    if (item.price === 0) {
      showToast(`\${item.title} a été ajouté à vos documents hors ligne !`);
    } else {
      showToast(`Demande d'achat pour \${item.title} (\${item.price}$) envoyée à la comptabilité.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Book className="w-8 h-8 text-rose-400" />
            Bibliothèque & Médias
          </h1>
          <p className="text-sm text-slate-400 mt-1">Documentation, syllabus, mémoires et manuels scolaires.</p>
        </div>
        {(currentUser?.role_id === 'admin' || currentUser?.role_id === 'enseignant') && (
          <button 
            onClick={() => showToast('Fenêtre d\'upload en cours de développement...')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition"
          >
            <Upload className="w-4 h-4" />
            Ajouter un document
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un livre, syllabus ou mémoire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
          >
            <option value="all">Tous les types</option>
            <option value="pdf">Syllabus (PDF)</option>
            <option value="book">Manuels (Achat)</option>
            <option value="video">Cours Vidéo</option>
            <option value="memory">Mémoires des anciens</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col hover:border-rose-500/50 transition-colors group">
            <div className="h-32 bg-slate-900 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
              {item.type === 'video' && <Video className="w-12 h-12 text-slate-600" />}
              {item.type === 'pdf' && <FileText className="w-12 h-12 text-slate-600" />}
              {item.type === 'book' && <Book className="w-12 h-12 text-slate-600" />}
              {item.type === 'memory' && <Award className="w-12 h-12 text-slate-600" />}
              
              <div className="absolute top-2 right-2 flex gap-1">
                {item.required && <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Requis</span>}
                {item.price > 0 && <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Payant</span>}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.author}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">
                {item.price === 0 ? 'Gratuit' : `\${item.price} $`}
              </span>
              <button 
                onClick={() => handleBuy(item)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition \${
                  item.price === 0 ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {item.price === 0 ? <Download className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                {item.price === 0 ? 'Ouvrir' : 'Acheter'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
