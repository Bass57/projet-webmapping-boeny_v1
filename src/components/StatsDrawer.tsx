import React, { useState } from 'react';
import { 
  X, 
  BarChart2, 
  TrendingDown, 
  TrendingUp, 
  Flame, 
  Trees, 
  ShieldCheck, 
  Droplets, 
  AlertTriangle,
  Award,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart 
} from 'recharts';
import { 
  ENVIRONMENTAL_METRICS, 
  DISTRICTS_DATA, 
  PROTECTED_AREAS_DATA, 
  MANGROVE_ZONES_DATA 
} from '../data/boenyData';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict: (district: any) => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDistrict
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'districts' | 'biodiversity'>('trends');

  if (!isOpen) return null;

  // Pie chart data for mangroves by district
  const mangrovePieData = DISTRICTS_DATA
    .filter(d => d.mangroveAreaHa > 0)
    .map(d => ({
      name: d.name,
      value: d.mangroveAreaHa
    }));

  const COLORS = ['#059669', '#0d9488', '#0284c7', '#0891b2', '#10b981'];

  // Fire chart by district
  const districtFireData = DISTRICTS_DATA.map(d => ({
    name: d.name,
    feux: d.fireHotspots2024,
    pression: d.pressureIndex,
    foret: d.forestCoverPct
  })).sort((a, b) => b.feux - a.feux);

  // Total protected area surface
  const totalPASurface = PROTECTED_AREAS_DATA.reduce((acc, curr) => acc + curr.surfaceHa, 0);
  const totalMangroves = MANGROVE_ZONES_DATA.reduce((acc, curr) => acc + curr.areaHa, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-3xl backdrop-blur-2xl bg-[#0c1618]/90 border-l border-white/15 h-full flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-sm">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Tableau de Bord Environnemental de Boeny
              </h2>
              <p className="text-xs text-slate-400">
                Statistiques territoriales, dynamique forestière & pressions écologiques
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global KPI Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-white/5 border-b border-white/10 backdrop-blur-sm">
          <div className="backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aires Protégées</span>
            </div>
            <div className="text-lg font-bold text-white">
              {(totalPASurface / 1000).toFixed(0)} <span className="text-xs font-normal text-slate-400">k ha</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">6 parcs & complexes</div>
          </div>

          <div className="backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Droplets className="w-3.5 h-3.5 text-teal-400" />
              <span>Mangroves</span>
            </div>
            <div className="text-lg font-bold text-white">
              {(totalMangroves / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">k ha</span>
            </div>
            <div className="text-[10px] text-teal-400 mt-0.5">Grand filtre de Bombetoka</div>
          </div>

          <div className="backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Feux (2024)</span>
            </div>
            <div className="text-lg font-bold text-white">
              1 575 <span className="text-xs font-normal text-slate-400">points</span>
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">Pic en Ambato-Boeny</div>
          </div>

          <div className="backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Reboisement '24</span>
            </div>
            <div className="text-lg font-bold text-white">
              1 890 <span className="text-xs font-normal text-slate-400">ha</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +19% vs 2023
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 px-4 bg-white/5 backdrop-blur-md text-xs font-semibold">
          <button
            onClick={() => setActiveTab('trends')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'trends'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Évolution Pluriannuelle (2018-2025)
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'districts'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Comparatif des 6 Districts
          </button>
          <button
            onClick={() => setActiveTab('biodiversity')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'biodiversity'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Aires Protégées & Espèces Critiques
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: TRENDS */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Chart 1: Feux vs Déforestation */}
              <div className="backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400" />
                      Alertes Feux (VIIRS/MODIS) vs Déforestation (ha)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Corrélation entre les feux de brousse annuels et les pertes de couvert forestier
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ENVIRONMENTAL_METRICS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#f43f5e" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(12, 22, 24, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '1rem', backdropFilter: 'blur(16px)', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar yAxisId="left" dataKey="fireCount" name="Alertes Feux (points)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="forestLossHa" name="Perte Forestière (ha)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Reboisement vs Santé Mangroves */}
              <div className="backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Trees className="w-4 h-4 text-emerald-400" />
                      Reboisement (ha) & Santé des Mangroves (Indice 0-100)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Progression des campagnes de restauration écologique et résilience des palétuviers
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ENVIRONMENTAL_METRICS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#10b981" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" domain={[50, 100]} fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(12, 22, 24, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '1rem', backdropFilter: 'blur(16px)', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar yAxisId="left" dataKey="reforestedHa" name="Surfaces Reboisées (ha)" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="mangroveHealthIndex" name="Santé Mangroves (0-100)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISTRICTS */}
          {activeTab === 'districts' && (
            <div className="space-y-6">
              {/* District Fire Comparison BarChart */}
              <div className="backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-1">
                  Intensité des Feux par District (Année 2024)
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">
                  Ambato-Boeny et Soalala concentrent plus de 70% des détections satellitaires
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtFireData} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-20} textAnchor="end" />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(12, 22, 24, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '1rem', backdropFilter: 'blur(16px)', fontSize: '11px' }} />
                      <Bar dataKey="feux" name="Points Chauds" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table of Districts */}
              <div className="overflow-x-auto rounded-3xl border border-white/10 backdrop-blur-md bg-white/5">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/10 text-slate-300 uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">District</th>
                      <th className="p-3">Superficie</th>
                      <th className="p-3">Forêt (%)</th>
                      <th className="p-3">Mangroves</th>
                      <th className="p-3">Feux '24</th>
                      <th className="p-3">Pression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {DISTRICTS_DATA.map((d) => (
                      <tr 
                        key={d.id}
                        onClick={() => {
                          onSelectDistrict(d);
                          onClose();
                        }}
                        className="hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                          <span>{d.name}</span>
                        </td>
                        <td className="p-3 text-slate-300">{d.surfaceKm2.toLocaleString('fr-FR')} km²</td>
                        <td className="p-3">
                          <span className="font-mono text-emerald-400">{d.forestCoverPct}%</span>
                        </td>
                        <td className="p-3 text-teal-300 font-mono">
                          {d.mangroveAreaHa > 0 ? `${d.mangroveAreaHa.toLocaleString('fr-FR')} ha` : '-'}
                        </td>
                        <td className="p-3 text-rose-400 font-mono font-semibold">{d.fireHotspots2024}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            d.pressureIndex === 'Critique'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : d.pressureIndex === 'Élevée'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {d.pressureIndex}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mangrove Distribution Pie */}
              <div className="backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
                <div className="h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mangrovePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {mangrovePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(12, 22, 24, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '1rem', backdropFilter: 'blur(16px)', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  <h4 className="font-bold text-white mb-2">Répartition des 81 750 ha de Mangroves de Boeny</h4>
                  {mangrovePieData.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-mono text-slate-400">{item.value.toLocaleString('fr-FR')} ha</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIODIVERSITY */}
          {activeTab === 'biodiversity' && (
            <div className="space-y-4">
              <div className="p-3.5 backdrop-blur-md bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-300 leading-relaxed">
                La région Boeny est l'un des trois plus grands foyers d'endémisme pour les forêts denses sèches et les zones humides côtières de Madagascar. Elle abrite des taxons phares en danger critique d'extinction (CR).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROTECTED_AREAS_DATA.map((pa) => (
                  <div key={pa.id} className="backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 space-y-2 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                          {pa.type}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{pa.name}</h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{pa.surfaceHa.toLocaleString('fr-FR')} ha</span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2">{pa.description}</p>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Espèces prioritaires de conservation :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {pa.keySpecies.map(sp => (
                          <span 
                            key={sp.scientificName}
                            className="inline-flex items-center gap-1 text-[10px] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm"
                          >
                            <span className="text-slate-200">{sp.name}</span>
                            <span className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
                              sp.status === 'CR' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/30' : 'bg-amber-500/30 text-amber-300 border border-amber-500/30'
                            }`}>
                              {sp.status}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <span>Source: DREDD Boeny / MNP / NASA FIRMS 2024</span>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 flex items-center gap-2 transition-all font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Imprimer le tableau</span>
          </button>
        </div>

      </div>
    </div>
  );
};
