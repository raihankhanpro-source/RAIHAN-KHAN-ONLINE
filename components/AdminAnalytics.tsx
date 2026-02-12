
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Post, Comment, Language } from '../types';
import { TRANSLATIONS } from '../constants';
// Added Eye icon to the imports from lucide-react
import { Users, FileText, MessageSquare, TrendingUp, Eye } from 'lucide-react';

interface AnalyticsProps {
  posts: Post[];
  comments: Comment[];
  lang: Language;
}

const COLORS = ['#00f3ff', '#ff00ff', '#00ff00', '#ffff00', '#ff8000'];

const AdminAnalytics: React.FC<AnalyticsProps> = ({ posts, comments, lang }) => {
  const t = TRANSLATIONS[lang];

  // Mock data for trends
  const userGrowth = [
    { name: 'Mon', users: 120 },
    { name: 'Tue', users: 150 },
    { name: 'Wed', users: 110 },
    { name: 'Thu', users: 180 },
    { name: 'Fri', users: 220 },
    { name: 'Sat', users: 280 },
    { name: 'Sun', users: 240 },
  ];

  const sourceData = [
    { name: 'Direct', value: 400 },
    { name: 'Search', value: 300 },
    { name: 'Social', value: 300 },
    { name: 'Referral', value: 200 },
  ];

  const geoData = [
    { name: 'Bangladesh', value: 1200 },
    { name: 'UAE', value: 800 },
    { name: 'USA', value: 600 },
    { name: 'UK', value: 400 },
    { name: 'Other', value: 200 },
  ];

  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  const pendingComments = comments.filter(c => c.status === 'pending').length;
  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: totalViews, icon: <Eye className="text-cyan-400" />, color: 'from-cyan-500/20' },
          { label: 'Active Users', value: 1458, icon: <Users className="text-magenta-400" />, color: 'from-magenta-500/20' },
          { label: 'Pending Comments', value: pendingComments, icon: <MessageSquare className="text-yellow-400" />, color: 'from-yellow-500/20' },
          { label: 'Total Posts', value: posts.length, icon: <FileText className="text-green-400" />, color: 'from-green-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} to-transparent backdrop-blur-md`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-orbitron uppercase">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-orbitron font-bold">{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl glass-panel border border-white/10">
          <h3 className="font-orbitron font-bold text-sm mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            USER ACTIVITY (7 DAYS)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Line type="monotone" dataKey="users" stroke="#00f3ff" strokeWidth={3} dot={{ r: 4, fill: '#00f3ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl glass-panel border border-white/10">
          <h3 className="font-orbitron font-bold text-sm mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-magenta-400" />
            TOP PERFORMING POSTS
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPosts.map(p => ({ name: p.title[lang].substring(0, 15) + '...', views: p.views }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                <Bar dataKey="views" fill="#ff00ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-xl glass-panel border border-white/10">
          <h3 className="font-orbitron font-bold text-sm mb-4">TRAFFIC SOURCES</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {sourceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/10">
          <h3 className="font-orbitron font-bold text-sm mb-4">GEOGRAPHIC DISTRIBUTION</h3>
          <div className="space-y-4">
            {geoData.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.name}</span>
                  <span className="text-cyan-400">{item.value} users</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500" 
                    style={{ width: `${(item.value / 1200) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
