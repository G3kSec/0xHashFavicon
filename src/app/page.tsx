"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Globe, Shield, Upload, Trash2, History, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FaviconHasher() {
const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar historial al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("favicon_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Guardar en historial
  const addToHistory = (item: any) => {
    const newEntry = { 
      id: Date.now(), 
      hash: item.hash, 
      icon: item.faviconUrl, 
      target: item.target || "Uploaded File",
      timestamp: new Date().toLocaleTimeString()
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10); // Guardar últimos 10
    setHistory(updatedHistory);
    localStorage.setItem("favicon_history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("favicon_history");
  };

  const handleHashUrl = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/hash", { method: "POST", body: JSON.stringify({ url }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const finalResult = { ...data, target: url };
      setResult(finalResult);
      addToHistory(finalResult);
    } catch (err: any) {
      setError(err.message || "Failed to fetch favicon");
    } finally {
      setLoading(false);
    }
  };

  const handleHashFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const finalResult = { ...data, faviconUrl: previewUrl, target: selectedFile.name };
      setResult(finalResult);
      addToHistory(finalResult);
    } catch (err: any) {
      setError(err.message || "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const openLink = (link: string) => window.open(link, "_blank");
  return (
    <main className="min-h-screen flex flex-col bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: HERRAMIENTA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white">
              0xHashFavicon <span className="text-neutral-500 font-light text-2xl ml-2">by G3kSec</span>
            </h1>
            <p className="text-neutral-400 text-sm font-medium">Favicon Fingerprinting for Asset Discovery</p>
          </div>

          <Card className="bg-neutral-900 border-neutral-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Target Input</CardTitle>
              <CardDescription className="text-neutral-500">
                Select a method to extract the MurmurHash3 signature.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-950">
                  <TabsTrigger value="url" className="text-white hover:bg-neutral-700 hover:text-white cursor-pointer">URL Target</TabsTrigger>
                  <TabsTrigger value="upload" className="text-white hover:bg-neutral-700 hover:text-white cursor-pointer">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://example.com/favicon.ico" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-neutral-950 border-neutral-700 text-white"
                      onKeyDown={(e) => e.key === "Enter" && handleHashUrl()}
                    />
                    <Button onClick={handleHashUrl} disabled={loading} className="bg-white text-black hover:bg-neutral-200">
                      {loading ? "..." : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </TabsContent>

              <TabsContent value="upload" className="mt-4 space-y-4">
                <div className="flex gap-2 items-center">
                  <Input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => {
                      if(e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                      accept=".ico,.png,.jpg,.jpeg,.svg"
                      className="bg-neutral-950 border-neutral-700 text-neutral-400 file:bg-neutral-800 file:text-white file:border-0 file:rounded-md file:mr-4 file:px-2 file:text-sm cursor-pointer"
                  />
                  <Button 
                    onClick={handleHashFile} 
                    disabled={loading || !selectedFile} 
                    className="bg-white text-black hover:bg-neutral-200 font-bold transition-all"
                  >
                    {loading ? "..." : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </TabsContent>
              </Tabs>

              {result && (
                <div className="pt-6 border-t border-neutral-800 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <img src={result.faviconUrl} alt="Icon" className="w-12 h-12 rounded bg-white/5 p-2 border border-neutral-800" />
                    <div className="flex-1">
                      <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">MurmurHash3</label>
                      <div className="text-emerald-400 font-mono text-xl truncate">{result.hash}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="cursor-pointer border-neutral-700 hover:bg-neutral-800 hover:text-white h-auto py-4 flex flex-col items-center gap-1"
                      onClick={() => openLink(`https://www.shodan.io/search?query=http.favicon.hash:${result.hash}`)}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <Globe className="w-4 h-4 text-blue-400" /> SHODAN
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">query: http.favicon.hash</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="cursor-pointer border-neutral-700 hover:bg-neutral-800 hover:text-white h-auto py-4 flex flex-col items-center gap-1"
                      onClick={() => openLink(`https://fofa.info/result?qbase64=${btoa(`icon_hash="${result.hash}"`)}`)}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <Shield className="w-4 h-4 text-yellow-400" /> FOFA
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">query: icon_hash</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" /> Recent Scans
            </h2>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs text-neutral-600 hover:text-red-400  cursor-pointer">
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-neutral-800 rounded-lg text-neutral-600 text-sm">
                No scans yet
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg flex items-center gap-3 group hover:border-neutral-700 transition-colors">
                  <img src={item.icon} alt="" className="w-8 h-8 rounded bg-white/5 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-neutral-500 truncate font-mono">{item.target}</p>
                    <p className="text-sm font-mono text-white group-hover:text-emerald-400 transition-colors">{item.hash}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 hover:text-black cursor-pointer" onClick={() => navigator.clipboard.writeText(item.hash)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
      <footer className="w-full py-8 mt-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 text-neutral-500">
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-mono tracking-tighter">
              <span className="text-neutral-300 font-bold">0xHashFavicon</span> 
              <span className="mx-2 text-neutral-700">|</span> 
              Developed by <span className="text-neutral-400 hover:text-emerald-400 transition-colors">G3kSec</span>
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest">
            <a href="https://www.linkedin.com/in/lucianogriffa" target="_blank" className="text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/G3kSec" target="_blank" className="text-neutral-400 hover:text-white transition-colors">GitHub</a>
            <p className="text-neutral-700 font-bold">&copy; {new Date().getFullYear()}</p>
          </div>

        </div>
      </footer>
    </main>
  );
}