
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type StatItem = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  link: string;
};

interface DashboardStatsProps {
  stats: StatItem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-lg p-6 shadow-sm`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-semibold text-charcoal">{stat.value}</h3>
            </div>
            <div className="p-2 rounded-full bg-white/80">
              {stat.icon}
            </div>
          </div>
          <Link 
            to={stat.link} 
            className="mt-4 inline-flex items-center text-sm text-mutedTeal hover:text-mutedTeal/80"
          >
            View details
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
