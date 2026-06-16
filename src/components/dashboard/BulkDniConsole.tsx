import { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Download, 
  Trash2, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  Search,
  ChevronRight
} from 'lucide-react';


interface QueryResult {
  id: string;
  dni: string;
  nombreCompleto: string;
  fecha: string;
  estado: string;
}

export function BulkDniConsole() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Single Query States
  const [singleId, setSingleId] = useState('');
  const [singleDni, setSingleDni] = useState('');
  const [queryingSingle, setQueryingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState<QueryResult | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);

  // Bulk Query States
  const [bulkText, setBulkText] = useState('');
  const [parsedBulk, setParsedBulk] = useState<Array<{ id: string; dni: string }>>([]);
  const [processingBulk, setProcessingBulk] = useState(false);
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0);
  const [bulkStats, setBulkStats] = useState({ success: 0, error: 0 });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from CSV on mount
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/search/bulk-dni');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching CSV history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle single DNI query submission
  const handleSingleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleId.trim() || !singleDni.trim()) {
      setSingleError('Ambos campos son requeridos');
      return;
    }
    if (!/^\d{8}$/.test(singleDni.trim())) {
      setSingleError('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    setQueryingSingle(true);
    setSingleError(null);
    setSingleResult(null);

    try {
      const res = await fetch('/api/search/bulk-dni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: singleId.trim(), dni: singleDni.trim() })
      });
      const result = await res.json();

      if (result.success && result.data && result.data[0]) {
        const item = result.data[0];
        setSingleResult(item);
        if (item.estado.startsWith('ERROR')) {
          setSingleError(item.estado);
        } else {
          // Success
          setSingleId('');
          setSingleDni('');
          fetchHistory(); // Refresh table
        }
      } else {
        setSingleError(result.message || 'Error desconocido al consultar.');
      }
    } catch (err: any) {
      setSingleError(err.message || 'Error de conexión.');
    } finally {
      setQueryingSingle(false);
    }
  };

  // Safe client-side parsing of text input/file
  const parseBulkInput = (text: string) => {
    const lines = text.split('\n');
    const queries: Array<{ id: string; dni: string }> = [];
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      const parts = line.split(/[,\t;]/);
      if (parts.length >= 2) {
        const id = parts[0].replace(/^["']|["']$/g, '').trim();
        const dni = parts[1].replace(/^["']|["']$/g, '').trim();
        
        let finalId = id;
        let finalDni = dni;
        // Auto-fix if columns are reversed
        if (/^\d{8}$/.test(id) && !/^\d{8}$/.test(dni)) {
          finalId = dni;
          finalDni = id;
        }
        if (finalDni) {
          queries.push({ id: finalId, dni: finalDni });
        }
      } else if (/^\d{8}$/.test(line)) {
        // Only DNI supplied, generate ID
        queries.push({ id: `CONSULTA-${queries.length + 1}`, dni: line });
      }
    }
    setParsedBulk(queries);
  };

  // Handle file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkText(text);
      parseBulkInput(text);
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setBulkText(text);
        parseBulkInput(text);
      };
      reader.readAsText(file);
    }
  };

  // Process bulk queries sequentially with 800ms throttle
  const handleProcessBulk = async () => {
    if (parsedBulk.length === 0) return;

    setProcessingBulk(true);
    setCurrentProgressIndex(0);
    setBulkStats({ success: 0, error: 0 });

    const total = parsedBulk.length;

    // We process sequentially on the server.
    // However, to provide a beautiful UI with progress updates, we will query them in batches of 1
    // or send them in chunks. Sending them 1-by-1 from client-side makes the progress bar extremely smooth,
    // and we can handle delays on the client. Or we can send everything and let the server process them.
    // Let's call the API 1-by-1 from the client side!
    // Why? It shows real-time progress for each DNI, lets the user see which DNI failed instantly,
    // and easily updates the history table on-the-fly.
    
    for (let i = 0; i < total; i++) {
      setCurrentProgressIndex(i);
      const item = parsedBulk[i];

      try {
        const res = await fetch('/api/search/bulk-dni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, dni: item.dni })
        });
        const result = await res.json();
        
        if (result.success && result.data && result.data[0]) {
          const finishedItem = result.data[0];
          if (finishedItem.estado === 'SUCCESS') {
            setBulkStats(prev => ({ ...prev, success: prev.success + 1 }));
          } else {
            setBulkStats(prev => ({ ...prev, error: prev.error + 1 }));
          }
        } else {
          setBulkStats(prev => ({ ...prev, error: prev.error + 1 }));
        }
      } catch (err: unknown) {
        setBulkStats(prev => ({ ...prev, error: prev.error + 1 }));
        console.error('Error processing bulk query:', err);
      }

      // 800ms delay between inquiries
      if (i < total - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setCurrentProgressIndex(total);
    setProcessingBulk(false);
    setBulkText('');
    setParsedBulk([]);
    fetchHistory(); // Refresh full table
  };

  // Download entire CSV
  const handleDownloadCsv = () => {
    window.location.href = '/api/search/download-csv';
  };

  // Clear history on the server CSV
  const handleClearHistory = async () => {
    if (!confirm('¿Está seguro de que desea eliminar todas las consultas guardadas en el CSV? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const res = await fetch('/api/search/bulk-dni', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setHistory([]);
      } else {
        alert('No se pudo borrar el historial.');
      }
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  // Table filtering
  const filteredHistory = history.filter(item => {
    const query = searchFilter.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.dni.includes(query) ||
      item.nombreCompleto.toLowerCase().includes(query) ||
      item.estado.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top action/stats bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">Consola de Consultas CSV</h2>
            <p className="text-xs text-zinc-500 font-medium">ELDNI.com Extractor & Guardado Masivo</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadCsv}
            disabled={history.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-800 text-white font-bold text-sm border border-primary/20 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Descargar CSV ({history.length})
          </button>
          <button 
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:hover:bg-transparent text-red-500 disabled:text-zinc-600 font-bold text-sm border border-red-500/10 disabled:border-transparent transition-all cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
            title="Borrar archivo CSV"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side - Query Form / File Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Tabs */}
            <div className="flex border-b border-white/5">
              <button 
                onClick={() => !processingBulk && setActiveTab('single')}
                disabled={processingBulk}
                className={`flex-1 py-4 text-sm font-bold tracking-tight transition-all border-b-2 select-none cursor-pointer ${
                  activeTab === 'single' 
                    ? 'text-primary border-primary bg-white/5' 
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                } disabled:cursor-not-allowed`}
              >
                Consulta Individual
              </button>
              <button 
                onClick={() => !processingBulk && setActiveTab('bulk')}
                disabled={processingBulk}
                className={`flex-1 py-4 text-sm font-bold tracking-tight transition-all border-b-2 select-none cursor-pointer ${
                  activeTab === 'bulk' 
                    ? 'text-primary border-primary bg-white/5' 
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                } disabled:cursor-not-allowed`}
              >
                Registro Masivo
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'single' ? (
                /* Single Query Form */
                <form onSubmit={handleSingleQuery} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">ID de Registro</label>
                    <input 
                      type="text" 
                      placeholder="Ej. EMP-023 o ID-Juan"
                      value={singleId}
                      onChange={(e) => setSingleId(e.target.value)}
                      disabled={queryingSingle}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-sm placeholder:text-zinc-600 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Número DNI</label>
                    <input 
                      type="text" 
                      maxLength={8}
                      placeholder="Ej. 45678901"
                      value={singleDni}
                      onChange={(e) => setSingleDni(e.target.value.replace(/\D/g, ''))}
                      disabled={queryingSingle}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-sm placeholder:text-zinc-600 disabled:opacity-50 font-mono tracking-widest"
                    />
                  </div>

                  {singleError && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{singleError}</span>
                    </div>
                  )}

                  {singleResult && singleResult.estado === 'SUCCESS' && (
                    <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Consultado con Éxito y Guardado</p>
                        <p className="mt-1 font-mono text-[10px] text-zinc-400">{singleResult.nombreCompleto}</p>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={queryingSingle}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {queryingSingle ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Buscando en Eldni...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Consultar y Registrar
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Bulk Query Area */
                <div className="space-y-4">
                  {/* File Upload Dropzone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-primary bg-primary/5 text-white' 
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-zinc-400'
                    } ${processingBulk ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.txt"
                      className="hidden"
                    />
                    <FileSpreadsheet className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-zinc-300">Arrastre un CSV o TXT aquí</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Formato: `ID, DNI` por línea</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-950 px-2 text-zinc-500 font-bold tracking-widest text-[9px]">O pega texto directo</span>
                    </div>
                  </div>

                  {/* Copy Paste Textarea */}
                  <div className="space-y-2">
                    <textarea 
                      rows={5}
                      placeholder="Ejemplo:&#10;ID-1, 10223344&#10;ID-2, 20334455"
                      value={bulkText}
                      disabled={processingBulk}
                      onChange={(e) => {
                        setBulkText(e.target.value);
                        parseBulkInput(e.target.value);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-xs placeholder:text-zinc-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Display stats if parsed */}
                  {parsedBulk.length > 0 && !processingBulk && (
                    <div className="p-3.5 bg-zinc-800/30 border border-white/5 rounded-xl flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <FileText className="w-4 h-4 text-primary" />
                        {parsedBulk.length} consultas detectadas
                      </span>
                      <button 
                        onClick={() => {
                          setBulkText('');
                          setParsedBulk([]);
                        }}
                        className="text-[10px] hover:text-red-400 font-bold uppercase transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}

                  {/* Processing Status Card */}
                  {processingBulk && (
                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium">
                          Procesando {currentProgressIndex} de {parsedBulk.length}
                        </span>
                        <span className="text-zinc-500 font-mono">
                          {Math.round((currentProgressIndex / parsedBulk.length) * 100)}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(currentProgressIndex / parsedBulk.length) * 100}%` }}
                        />
                      </div>

                      {/* Secondary Stats */}
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-green-500">Éxitos: {bulkStats.success}</span>
                        <span className="text-red-400">Errores: {bulkStats.error}</span>
                        <span className="text-zinc-500 animate-pulse">
                          Faltan: {Math.max(0, (parsedBulk.length - currentProgressIndex) * 0.8).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleProcessBulk}
                    disabled={parsedBulk.length === 0 || processingBulk}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {processingBulk ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando en Secuencia...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Procesar consultas masivas
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - History Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col h-[540px]">
            {/* Search filter headers */}
            <div className="p-4 border-b border-white/5 bg-white/2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Filtrar por DNI, ID o Nombre..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-zinc-300 focus:outline-none focus:border-primary/50 transition-all font-medium text-xs placeholder:text-zinc-600"
                />
              </div>
              
              <button 
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white uppercase font-bold tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingHistory && history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Cargando CSV...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
                  <FileText className="w-12 h-12 text-zinc-700 mb-2" />
                  <p className="text-sm font-bold">Sin resultados en el CSV</p>
                  <p className="text-xs text-zinc-500 mt-1">Realice consultas o cargue un archivo para ver registros.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredHistory.map((item, index) => {
                    const isSuccess = item.estado === 'SUCCESS';
                    return (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-white/1 transition-all group">
                        <div className="space-y-1 pr-4 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[9px] font-black bg-zinc-800 text-zinc-400 border border-white/5 rounded font-mono">
                              {item.id}
                            </span>
                            <span className="font-mono text-xs text-white font-bold tracking-wider">
                              {item.dni}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-zinc-400 truncate max-w-sm sm:max-w-md">
                            {isSuccess ? item.nombreCompleto : <span className="text-red-400 italic">No disponible</span>}
                          </p>
                          <p className="text-[9px] text-zinc-600 font-bold">
                            {new Date(item.fecha).toLocaleString('es-PE')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isSuccess ? (
                            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-green-500/10 border border-green-500/20 text-green-400 uppercase tracking-widest">
                              SUCCESS
                            </span>
                          ) : (
                            <span 
                              className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-widest cursor-help"
                              title={item.estado}
                            >
                              ERROR
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer summary */}
            <div className="p-4 border-t border-white/5 bg-white/1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex justify-between items-center">
              <span>Registrados: {history.length}</span>
              {filteredHistory.length !== history.length && (
                <span>Filtrados: {filteredHistory.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
