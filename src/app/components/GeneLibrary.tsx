import React from 'react';
import { Dna, AlertCircle, Target, Pill } from 'lucide-react';

interface Gene {
  name: string;
  fullName: string;
  chromosome: string;
  function: string;
  roleInCancer: string;
  hotspots: string[];
  frequency: string;
  therapeuticImplications?: string;
  color: string;
}

export default function GeneLibrary() {
  const genes: Gene[] = [
    {
      name: 'KRAS',
      fullName: 'Kirsten Rat Sarcoma Viral Oncogene',
      chromosome: '12p12.1',
      frequency: '90-95% of PDAC cases',
      function:
        'Proto-oncogene encoding a GTPase that acts as a molecular switch in signal transduction. Cycles between active (GTP-bound) and inactive (GDP-bound) states, regulating cell proliferation, differentiation, and survival through RAF-MEK-ERK and PI3K-AKT pathways.',
      roleInCancer:
        'KRAS mutations are the most common driver mutation in pancreatic cancer, occurring early in disease development. Mutant KRAS remains constitutively active in its GTP-bound state, leading to uncontrolled activation of growth signaling pathways. This promotes cell proliferation, survival, metabolic reprogramming, and immune evasion.',
      hotspots: ['G12D (47%)', 'G12V (34%)', 'G12R (16%)', 'G12C (2%)', 'G13D', 'Q61H'],
      therapeuticImplications: 'KRAS G12C inhibitors (sotorasib, adagrasib) available for specific mutation. Clinical trials ongoing for other KRAS variants. Standard chemotherapy (FOLFIRINOX, gemcitabine) remains primary treatment.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'TP53',
      fullName: 'Tumor Protein p53',
      chromosome: '17p13.1',
      frequency: '50-75% of PDAC cases',
      function:
        'Tumor suppressor gene encoding the "guardian of the genome." p53 responds to cellular stress (DNA damage, oncogene activation, hypoxia) by inducing cell cycle arrest, DNA repair, senescence, or apoptosis. Regulates hundreds of target genes involved in maintaining genomic stability.',
      roleInCancer:
        'TP53 inactivation occurs through missense mutations (which often have dominant-negative effects), nonsense mutations, or deletions. Loss of p53 function eliminates critical DNA damage checkpoints, allowing cells with genomic instability to survive and proliferate. TP53 mutations are associated with aggressive disease, metastasis, and poor prognosis in pancreatic cancer.',
      hotspots: ['R175H', 'R248W', 'R273H', 'R282W', 'Y220C', 'R248Q'],
      therapeuticImplications: 'TP53 status may affect chemotherapy response. Platinum-based agents may be more effective. Research ongoing for p53 reactivation therapies. Combination immunotherapy approaches under investigation.',
      color: 'from-red-400 to-red-600',
    },
    {
      name: 'SMAD4',
      fullName: 'SMAD Family Member 4 (DPC4)',
      chromosome: '18q21.2',
      frequency: '~55% of PDAC cases',
      function:
        'Tumor suppressor gene encoding a central mediator (Co-SMAD) in the transforming growth factor-beta (TGF-β) signaling pathway. SMAD4 forms complexes with receptor-regulated SMADs (R-SMADs) and translocates to the nucleus to regulate transcription of target genes controlling growth inhibition, differentiation, and apoptosis.',
      roleInCancer:
        'SMAD4 loss is unique to pancreatic cancer compared to other tumor types. Inactivation occurs through deletion, mutation, or loss of heterozygosity. Loss of SMAD4 disrupts TGF-β-mediated growth suppression and promotes epithelial-mesenchymal transition (EMT), contributing to increased metastatic potential. SMAD4 loss is associated with widespread metastasis and shorter survival.',
      hotspots: ['R361C', 'R361H', 'D351H', 'P356L', 'Homozygous deletion'],
      therapeuticImplications: 'SMAD4 loss indicates high risk for metastasis and may guide adjuvant therapy decisions. No targeted therapies currently available. Aggressive multimodal treatment recommended.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'CDKN2A',
      fullName: 'Cyclin-Dependent Kinase Inhibitor 2A',
      chromosome: '9p21.3',
      frequency: '~90% of PDAC cases (loss)',
      function:
        'Tumor suppressor gene encoding two proteins: p16INK4a (blocks CDK4/6-cyclin D complexes) and p14ARF (stabilizes p53 by inhibiting MDM2). Controls cell cycle progression at the G1/S checkpoint and maintains p53 stability for stress responses.',
      roleInCancer:
        'CDKN2A is one of the most frequently inactivated genes in pancreatic cancer through homozygous deletion, point mutation, or promoter hypermethylation. Loss of p16INK4a removes a critical brake on cell cycle progression, allowing uncontrolled proliferation. Loss of p14ARF impairs p53 function, compounding genomic instability.',
      hotspots: ['Homozygous deletion (40%)', 'Promoter methylation (40%)', 'Point mutations (10%)'],
      therapeuticImplications: 'CDK4/6 inhibitors (palbociclib, ribociclib) under investigation in clinical trials. Loss of CDKN2A may sensitize to certain chemotherapy combinations.',
      color: 'from-orange-400 to-orange-600',
    },
    {
      name: 'BRCA2',
      fullName: 'Breast Cancer Type 2 Susceptibility Protein',
      chromosome: '13q13.1',
      frequency: '5-10% of PDAC cases (germline)',
      function:
        'Tumor suppressor gene essential for homologous recombination (HR) repair of DNA double-strand breaks. BRCA2 recruits and stabilizes RAD51 at sites of DNA damage, enabling accurate repair through HR. Also involved in replication fork protection and maintenance of genomic stability.',
      roleInCancer:
        'Germline BRCA2 mutations confer increased lifetime risk for pancreatic, breast, ovarian, and prostate cancers. Somatic BRCA2 mutations also occur. BRCA2 deficiency creates "BRCAness" - a state of HR deficiency that makes cells reliant on alternative error-prone repair pathways, leading to increased mutation accumulation and genomic instability.',
      hotspots: ['6174delT (Ashkenazi founder)', '999del5', 'Exon 11 mutations', 'Truncating variants'],
      therapeuticImplications: 'STRONG INDICATION for PARP inhibitors (olaparib, rucaparib) - FDA approved for BRCA-mutant pancreatic cancer. Enhanced sensitivity to platinum-based chemotherapy. Genetic counseling and family screening recommended.',
      color: 'from-green-400 to-green-600',
    },
    {
      name: 'BRCA1',
      fullName: 'Breast Cancer Type 1 Susceptibility Protein',
      chromosome: '17q21.31',
      frequency: '1-3% of PDAC cases (germline)',
      function:
        'Tumor suppressor involved in DNA repair, cell cycle checkpoint control, and transcriptional regulation. Forms the BRCA1-PALB2-BRCA2 complex required for homologous recombination. Also regulates DNA damage response signaling and maintains genome integrity.',
      roleInCancer:
        'Germline BRCA1 mutations increase pancreatic cancer risk 2-3 fold, though less than BRCA2. Creates HR deficiency similar to BRCA2, leading to dependency on PARP-mediated repair mechanisms. Families with BRCA1 mutations often have histories of breast and ovarian cancer.',
      hotspots: ['185delAG', '5382insC', 'Exon deletions', 'Splice site mutations'],
      therapeuticImplications: 'PARP inhibitor eligible. Platinum sensitivity expected. Genetic counseling essential for hereditary cancer syndrome management.',
      color: 'from-teal-400 to-teal-600',
    },
    {
      name: 'STK11',
      fullName: 'Serine/Threonine Kinase 11 (LKB1)',
      chromosome: '19p13.3',
      frequency: '4-6% of PDAC cases',
      function:
        'Tumor suppressor kinase that regulates cellular metabolism, energy homeostasis, and cell polarity. Master regulator of AMPK signaling pathway. Responds to energy stress by modulating metabolism, growth, and proliferation.',
      roleInCancer:
        'STK11 germline mutations cause Peutz-Jeghers syndrome, conferring high cancer risk. Somatic mutations also occur in sporadic pancreatic cancer. STK11 loss leads to metabolic reprogramming, altered immune microenvironment, and resistance to certain therapies.',
      hotspots: ['G163D', 'Frameshift mutations', 'Splice site variants'],
      therapeuticImplications: 'STK11 loss may predict resistance to immune checkpoint inhibitors. Metabolic targeting strategies under investigation.',
      color: 'from-amber-400 to-amber-600',
    },
    {
      name: 'ATM',
      fullName: 'Ataxia Telangiectasia Mutated',
      chromosome: '11q22.3',
      frequency: '2-3% of PDAC cases',
      function:
        'Serine/threonine kinase that serves as a central regulator of the DNA damage response. Activated by DNA double-strand breaks, ATM phosphorylates hundreds of substrates to coordinate cell cycle checkpoints, DNA repair, and apoptosis.',
      roleInCancer:
        'ATM mutations impair DNA damage response and repair, leading to genomic instability. Creates HR deficiency similar to BRCA mutations. Associated with increased cancer susceptibility, particularly in heterozygous carriers.',
      hotspots: ['Truncating mutations', 'Missense in kinase domain', 'Splice variants'],
      therapeuticImplications: 'May respond to PARP inhibitors and platinum therapy. ATM loss can indicate HR deficiency and guide treatment selection.',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pancreatic Cancer Gene Library</h1>
          <p className="text-slate-600">
            Comprehensive reference for genes frequently mutated in pancreatic ductal adenocarcinoma (PDAC)
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">90-95%</div>
            <div className="text-xs text-slate-900">KRAS mutations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">50-75%</div>
            <div className="text-xs text-slate-900">TP53 mutations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">~55%</div>
            <div className="text-xs text-slate-900">SMAD4 loss</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">~90%</div>
            <div className="text-xs text-slate-900">CDKN2A loss</div>
          </div>
        </div>

        {/* Gene Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {genes.map((gene) => (
            <div
              key={gene.name}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${gene.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Dna className="h-8 w-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{gene.name}</h2>
                      <p className="text-sm opacity-90">{gene.fullName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>Chr {gene.chromosome}</span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                    {gene.frequency}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    Normal Function
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {gene.function}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Role in Pancreatic Cancer
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {gene.roleInCancer}
                  </p>
                </div>

                {gene.therapeuticImplications && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-green-600" />
                      Therapeutic Implications
                    </h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {gene.therapeuticImplications}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    Common Mutation Hotspots
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gene.hotspots.map((hotspot, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-mono"
                      >
                        {hotspot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Molecular Progression */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Pancreatic Cancer Progression Model
            </h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">1.</span>
                <span><strong>Early:</strong> KRAS mutations activate growth signaling (PanIN-1)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">2.</span>
                <span><strong>Intermediate:</strong> CDKN2A loss removes cell cycle control (PanIN-2)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">3.</span>
                <span><strong>Late:</strong> TP53 and SMAD4 inactivation (PanIN-3/PDAC)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">4.</span>
                <span><strong>Metastatic:</strong> Additional mutations in DNA repair, chromatin remodeling genes</span>
              </div>
            </div>
          </div>

          {/* Treatment Implications */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Mutation-Guided Therapy
            </h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="font-bold text-green-600">•</span>
                <span><strong>BRCA1/2 mutations:</strong> PARP inhibitors (olaparib), platinum agents</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-green-600">•</span>
                <span><strong>KRAS G12C:</strong> Direct KRAS inhibitors in clinical trials</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-green-600">•</span>
                <span><strong>DNA repair deficiency:</strong> Platinum-based chemotherapy, immunotherapy</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-green-600">•</span>
                <span><strong>SMAD4 loss:</strong> Aggressive multimodal approach, close monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}