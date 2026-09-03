import React from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  Trees, 
  Droplets, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon,
  Calendar,
  Building
} from 'lucide-react';
import { DISTRICTS_DATA, PROTECTED_AREAS_DATA, MANGROVE_ZONES_DATA } from '../data/boenyData';

interface EnvironmentalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentalReportModal: React.FC<EnvironmentalReportModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="backdrop-blur-2xl bg-[#0c1618]/90 border border-white/15 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rapport Officiel de Synthèse
                </span>
                <span className="text-xs text-slate-400">Édition 2024-2025</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                Bilan Environnemental Territorial — Région Boeny (Madagascar)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs flex items-center gap-1.5 transition-all"
              title="Imprimer le document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans print:text-black print:bg-white">
          
          {/* Metadata banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-[11px]">
            <div>
              <span className="text-slate-400 block">Territoire cible :</span>
              <strong className="text-white font-medium">Région Boeny (31 046 km²)</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Autorités de tutelle :</span>
              <strong className="text-white font-medium">DREDD Boeny & Madagascar National Parks</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Statut général de pression :</span>
              <strong className="text-rose-400 font-medium">Élevé à Critique (Zones pastorales & côtières)</strong>
            </div>
          </div>

          {/* Section 1: Résumé Exécutif */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              1. Résumé Exécutif & Contexte Territorial
            </h3>
            <p>
              La région Boeny, située sur la façade occidentale de Madagascar face au canal de Mozambique, abrite un capital naturel et une biodiversité d'importance planétaire. Caractérisée par un climat tropical sec marqué par une saison sèche rigoureuse de 7 mois, la région concentre des écosystèmes majeurs : la forêt dense sèche décidue (Parc National d'Ankarafantsika), les spectaculaires karsts du Tsingy de Namoroka, les mangroves estuariennes de Bombetoka et de Katsepy, ainsi que le complexe lagunaire RAMSAR de Mahavavy-Kinkony.
            </p>
            <p>
              Néanmoins, la région subit une trilogie de pressions anthropiques majeures : les <strong className="text-rose-300 font-semibold">feux de brousse récurrents</strong> (1 575 alertes en 2024), l'<strong className="text-amber-300 font-semibold">ensablement sévère</strong> des périmètres rizicoles de Marovoay par les latérites de la Betsiboka, et le <strong className="text-cyan-300 font-semibold">charbonnage intensif</strong> pour approvisionner l'agglomération de Mahajanga.
            </p>
          </div>

          {/* Section 2: Forêts & Aires Protégées */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
              <Trees className="w-4 h-4" />
              2. Forêts Denses Sèches & Réseau des Aires Protégées
            </h3>
            <p>
              Le réseau des aires protégées de Boeny couvre plus de <strong className="text-white">582 000 hectares</strong> sous gestion de Madagascar National Parks (MNP) et de gestionnaires délégués comme Asity Madagascar et le Muséum National d'Histoire Naturelle (MNHN Antrema).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2">
              <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <span className="font-bold text-slate-100 block">Parc National d'Ankarafantsika (136 513 ha)</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bastion du Sifaka de Coquerel (<em>Propithecus coquereli</em>) et du Pygargue de Madagascar (<em>Haliaeetus vociferoides</em>). Priorité opérationnelle : renforcement des pare-feux coupe-vent le long de la RN4 et contrôle des pâturages illicites.
                </p>
              </div>

              <div className="p-3.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <span className="font-bold text-slate-100 block">Parc National de la Baie de Baly (57 142 ha)</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dernier sanctuaire mondial de la Tortue Angonoka (<em>Astrochelys yniphora</em>, CR). Menacée par les réseaux de braconnage internationaux et les feux criminels d'intimidation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Mangroves & Estuaires */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-teal-400">
              <Droplets className="w-4 h-4" />
              3. Mangroves & Économie du Carbone Bleu
            </h3>
            <p>
              Avec <strong className="text-white">81 750 hectares</strong> de palétuviers recensés, Boeny représente l'une des plus grandes réserves de mangrove de Madagascar. La Baie de Bombetoka (46 200 ha) remplit un rôle écosystémique inestimable de piège à sédiments et de nourricerie de crevettes (<em>Penaeus indicus</em>) et crabes de mangrove (<em>Scylla serrata</em>).
            </p>
            <p>
              Les programmes de restauration participative conduits par la DREDD et le WWF ont permis de reboiser plus de <strong className="text-emerald-300">1 890 hectares</strong> en 2024, accompagnés de la mise en place de structures communautaires de gardiennage (FKM).
            </p>
          </div>

          {/* Section 4: Feux & Érosion */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-rose-400">
              <Flame className="w-4 h-4" />
              4. Feux de Brousse & Dynamique Sédimentaire de la Betsiboka
            </h3>
            <p>
              L'érosion en « Lavaka » sur les hauts plateaux se solde par l'injection annuelle de dizaines de millions de tonnes de latérite rouge dans le fleuve Betsiboka. Cette surcharge sédimentaire comble la plaine de Marovoay, menaçant la sécurité alimentaire nationale (deuxième grenier à riz du pays).
            </p>
            <p>
              Le district d'<strong className="text-white">Ambato-Boeny</strong> demeure le plus vulnérable aux incendies, enregistrant à lui seul 680 foyers satellitaires en 2024, principalement causés par le brûlis de régénération pastorale pour les cheptels de zébus.
            </p>
          </div>

          {/* Section 5: Recommandations Stratégiques */}
          <div className="p-4 backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 rounded-3xl space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-emerald-400" />
              Recommandations Stratégiques 2025-2030 pour la Région Boeny
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-300">
              <li>
                <strong>Institutionnalisation des brigades villageoises anti-feu (KMM) :</strong> Dotation en matériel de battage et consolidation des pare-feux périphériques des aires protégées.
              </li>
              <li>
                <strong>Fixation mécanique et biologique des lavakas :</strong> Utilisation intensive du vétiver et plantation d'arbres fixateurs d'azote sur les bassins versants amont de la Betsiboka et de la Kamoro.
              </li>
              <li>
                <strong>Filière Bois-Énergie Durable :</strong> Développement de massifs d'anacardiers et d'arbres à croissance rapide pour désamorcer la pression de charbonnage sur les mangroves de Mahajanga.
              </li>
              <li>
                <strong>Protection renforcée de la Baie de Baly :</strong> Déploiement de balises satellites et appui aux patrouilles conjointes MNP/Gendarmerie contre le braconnage de l'Angonoka.
              </li>
              <li>
                <strong>Gestion concertée des pêches à Kinkony :</strong> Respect strict du calendrier de fermeture de la pêche pour la régénération du tilapia et des tortues Réré.
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5" />
            <span>Observatoire Régional de l'Environnement de Boeny — DREDD / MNP</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all"
          >
            Fermer le rapport
          </button>
        </div>

      </div>
    </div>
  );
};
