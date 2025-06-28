import React from 'react';
import { AlertTriangle, Lock, Shield, Clock, Wifi, WifiOff } from 'lucide-react';
import { DomainData, SummaryStats } from '../types';

interface SummaryCardsProps {
  domains: DomainData[];
  onShowDomainList: (modal: { domains: string[]; title: string; protocol: string }) => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ domains, onShowDomainList }) => {
  const calculateStats = (): SummaryStats & { httpOnly: string[] } => {
    const httpOnly: string[] = [];
    const expiringSoon: string[] = [];
    const noCert: string[] = [];
    const now = new Date();

    domains.forEach(domain => {
      const httpStatus = domain.http?.[0];
      const httpsStatus = domain.https?.[0];
      const certStatus = domain.cert?.[0];
      const certDetails = domain.cert_details;

      // HTTP Only (has HTTP but no HTTPS or HTTPS fails)
      if (httpStatus === 200 && (!httpsStatus || httpsStatus !== 200)) {
        httpOnly.push(domain.domain);
      }
      
      // No Certificate
      if (!certStatus) {
        noCert.push(domain.domain);
      }
      
      // Certificates expiring soon
      if (certStatus && domain.cert?.[1]) {
        const expiryDate = new Date(domain.cert[1]);
        const diffDays = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 30 && diffDays > 0) {
          expiringSoon.push(domain.domain);
        }
      }
    });

    return { httpOnly, expiringSoon, noCert };
  };

  const stats = calculateStats();

  const cards = [
    {
      title: 'Certificates Expiring Soon',
      count: stats.expiringSoon.length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      domains: stats.expiringSoon,
      protocol: 'https',
      description: 'Certificates expiring within 30 days'
    },
    {
      title: 'HTTP Only',
      count: stats.httpOnly.length,
      icon: WifiOff,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      domains: stats.httpOnly,
      protocol: 'http',
      description: 'Sites without HTTPS encryption'
    },
    {
      title: 'No Certificate',
      count: stats.noCert.length,
      icon: Shield,
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      domains: stats.noCert,
      protocol: 'http',
      description: 'Sites without SSL certificates'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} backdrop-blur-sm rounded-xl border ${card.borderColor} p-6 hover:bg-white/5 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-lg shadow-md`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${card.textColor}`}>
                {card.count}
              </div>
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{card.description}</p>
            
            {card.count > 0 ? (
              <button
                onClick={() => onShowDomainList({
                  domains: card.domains,
                  title: card.title,
                  protocol: card.protocol
                })}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                View Domains ({card.count})
              </button>
            ) : (
              <div className="w-full px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium text-center">
                ✅ All Clear
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;