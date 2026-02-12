// src/app/components/AnalyticsDashboard.tsx
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, BarChart3 } from 'lucide-react';
import { supabaseService, AnalysisResult } from '../services/SupabaseService';

const COLORS = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
};

export function AnalyticsDashboard() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalMutations: 0,
    avgMutationsPerPatient: 0,
    highRiskPatients: 0
  });

  const [geneFrequency, setGeneFrequency] = useState<{ gene: string; count: number }[]>([]);
  const [mutationTrends, setMutationTrends] = useState<{ date: string; mutations: number }[]>([]);
  const [pathogenicityDistribution, setPathogenicityDistribution] = useState<{ name: string; value: number }[]>([]);
  const [cancerTypeDistribution, setCancerTypeDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (results && results.length > 0) {
      calculateStatistics();
      calculateGeneFrequency();
      calculateMutationTrends();
      calculatePathogenicityDistribution();
      calculateCancerTypeDistribution();
    }
  }, [results]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from Supabase first
      const supabaseResults = await supabaseService.getAnalysisResults();
      
      if (supabaseResults && supabaseResults.length > 0) {
        setResults(supabaseResults);
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('analysis-results');
        if (stored) {
          const parsedResults = JSON.parse(stored);
          setResults(parsedResults);
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
      // Try localStorage as fallback
      try {
        const stored = localStorage.getItem('analysis-results');
        if (stored) {
          const parsedResults = JSON.parse(stored);
          setResults(parsedResults);
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatistics = () => {
    const totalMutations = results.reduce((sum, r) => sum + r.mutationsFound, 0);
    const highRisk = results.filter(r => 
      r.pathogenicity.toLowerCase().includes('high')
    ).length;

    setStats({
      totalAnalyses: results.length,
      totalMutations,
      avgMutationsPerPatient: results.length > 0 ? totalMutations / results.length : 0,
      highRiskPatients: highRisk
    });
  };

  const calculateGeneFrequency = () => {
    const geneMap = new Map<string, number>();

    results.forEach(result => {
      result.mutatedGenes?.forEach(gene => {
        geneMap.set(gene, (geneMap.get(gene) || 0) + 1);
      });
    });

    const frequency = Array.from(geneMap.entries())
      .map(([gene, count]) => ({ gene, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 genes

    setGeneFrequency(frequency);
  };

  const calculateMutationTrends = () => {
    const dateMap = new Map<string, number>();

    results.forEach(result => {
      const date = result.analysisDate 
        ? new Date(result.analysisDate).toLocaleDateString()
        : new Date().toLocaleDateString();
      
      dateMap.set(date, (dateMap.get(date) || 0) + result.mutationsFound);
    });

    const trends = Array.from(dateMap.entries())
      .map(([date, mutations]) => ({ date, mutations }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setMutationTrends(trends);
  };

  const calculatePathogenicityDistribution = () => {
    const pathMap = new Map<string, number>();

    results.forEach(result => {
      const category = result.pathogenicity.includes('High') 
        ? 'High Risk'
        : result.pathogenicity.includes('Moderate')
        ? 'Moderate Risk'
        : result.pathogenicity.includes('Low')
        ? 'Low Risk'
        : 'Unknown';
      
      pathMap.set(category, (pathMap.get(category) || 0) + 1);
    });

    const distribution = Array.from(pathMap.entries())
      .map(([name, value]) => ({ name, value }));

    setPathogenicityDistribution(distribution);
  };

  const calculateCancerTypeDistribution = () => {
    const typeMap = new Map<string, number>();

    results.forEach(result => {
      const type = result.cancerType || 'Unknown';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    const distribution = Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }));

    setCancerTypeDistribution(distribution);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600 dark:text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
        <BarChart3 className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Data Available</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Run some analyses to see your analytics dashboard with mutation trends and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Comprehensive mutation analysis insights and trends across all patients
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalAnalyses}</span>
          </div>
          <p className="text-indigo-100 font-medium">Total Analyses</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalMutations}</span>
          </div>
          <p className="text-purple-100 font-medium">Total Mutations</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.avgMutationsPerPatient.toFixed(1)}</span>
          </div>
          <p className="text-blue-100 font-medium">Avg Mutations/Patient</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{stats.highRiskPatients}</span>
          </div>
          <p className="text-red-100 font-medium">High Risk Patients</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gene Frequency Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Most Frequently Mutated Genes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geneFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis 
                dataKey="gene" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#1e293b' }}
              />
              <Bar 
                dataKey="count" 
                fill={COLORS.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pathogenicity Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Risk Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pathogenicityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pathogenicityDistribution.map((entry, index) => {
                  const colorMap: Record<string, string> = {
                    'High Risk': COLORS.danger,
                    'Moderate Risk': COLORS.warning,
                    'Low Risk': COLORS.success,
                    'Unknown': COLORS.info
                  };
                  return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS.primary} />;
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mutation Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Mutation Detection Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mutationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="mutations" 
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cancer Type Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Cancer Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cancerTypeDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#64748b" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                tick={{ fontSize: 10, fill: '#64748b' }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill={COLORS.info}
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Most Common Mutation</p>
            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
              {geneFrequency.length > 0 ? geneFrequency[0].gene : 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">High Risk Rate</p>
            <p className="text-lg font-bold text-red-700 dark:text-red-400">
              {stats.totalAnalyses > 0 
                ? `${((stats.highRiskPatients / stats.totalAnalyses) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}