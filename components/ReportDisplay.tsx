
import React from 'react';
import { Report } from '../types';

interface ReportDisplayProps {
  report: Report;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="bg-brand-card border border-brand-border p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{report.title}</h2>
        <p className="text-lg text-gray-400 font-light leading-relaxed max-w-3xl">
          {report.summary}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {report.metrics.map((metric, index) => (
          <div key={index} className="bg-brand-card border border-brand-border p-6 rounded-3xl hover:border-brand-red/40 transition-all hover:shadow-xl hover:shadow-brand-red/5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">{metric.label}</p>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-white">{metric.value}</span>
              <div className={`p-2 rounded-xl ${
                metric.trend === 'up' ? 'bg-green-500/10 text-green-500' : 
                metric.trend === 'down' ? 'bg-brand-red/10 text-brand-red' : 
                'bg-gray-500/10 text-gray-500'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {metric.trend === 'up' ? <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="3"/> :
                   metric.trend === 'down' ? <path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" strokeWidth="3"/> :
                   <path d="M5 12h14" strokeWidth="3"/>}
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-tighter">
          <span className="w-8 h-1 bg-brand-red mr-3"></span>
          Estrategias de Implementación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.actionItems.map((item, index) => (
            <div key={index} className="group p-5 bg-brand-dark border border-brand-border rounded-2xl flex items-start hover:border-brand-red/30 transition-all">
              <span className="text-brand-red font-mono text-lg mr-4 opacity-50 font-black">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDisplay;
