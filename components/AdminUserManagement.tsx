
import React from 'react';
import { User, Language } from '../types';
import { 
  Users, Shield, Trash2, UserCog, UserCheck, 
  UserMinus, Search, Mail, Calendar, ShieldCheck,
  Lock, Unlock, AlertTriangle
} from 'lucide-react';

interface AdminUserManagementProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  currentUser: User | null;
  lang: Language;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ 
  users, onUpdateUser, onDeleteUser, currentUser, lang 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (user: User, newRole: User['role']) => {
    if (user.id === currentUser?.id) {
      return;
    }
    onUpdateUser({ ...user, role: newRole });
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser?.id) {
      return;
    }
    const newStatus = user.status === 'disabled' ? 'active' : 'disabled';
    
    const confirmMessage = user.status === 'disabled' 
      ? `NEURAL REACTIVATION: Restore unit ${user.name} to operational status? Their quantum signature will rejoin the network.`
      : `NEURAL DEACTIVATION: Sever connection to unit ${user.name}? Their access to the mainframe will be terminated immediately.`;
    
    if (confirm(confirmMessage)) {
      onUpdateUser({ ...user, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      return;
    }
    const user = users.find(u => u.id === id);
    const confirmMessage = user 
      ? `CRITICAL: Permanently decommission neural identity "${user.name}" (${user.email})? This action cannot be reversed and all quantum signatures will be purged from the mainframe.`
      : "DANGER: This action will permanently decommission this neural identity from the mainframe. Proceed?";
    
    if (confirm(confirmMessage)) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="space-y-6 animate-reveal">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-orbitron font-black uppercase tracking-widest flex items-center gap-3">
            <Users className="text-cyan-400 w-6 h-6" /> Identity Matrix
          </h2>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">
            Global access control & biometric validation logs
          </p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-cyan-500/50 w-full md:w-80 transition-all font-medium"
          />
        </div>
      </header>

      <div className="glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-6 py-5 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Neural Identity</th>
                <th className="px-6 py-5 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Protocol Level</th>
                <th className="px-6 py-5 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Signal Status</th>
                <th className="px-6 py-5 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-white/[0.02] transition-colors group ${user.status === 'disabled' ? 'opacity-40 grayscale' : ''}`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:border-cyan-500/30 transition-all" 
                        />
                        {user.role === 'admin' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-2 border-[#030303] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <ShieldCheck className="w-2.5 h-2.5 text-black" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-orbitron tracking-tighter">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                          <Mail className="w-2.5 h-2.5" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      disabled={user.id === currentUser?.id}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value as User['role'])}
                      className={`bg-black/60 border rounded-xl px-4 py-2 text-[10px] font-orbitron font-black uppercase transition-all focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                        user.role === 'admin' ? 'border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 
                        user.role === 'editor' ? 'border-magenta-500/50 text-magenta-400' : 
                        'border-white/10 text-slate-400'
                      }`}
                    >
                      <option value="user" className="bg-zinc-900">User</option>
                      <option value="editor" className="bg-zinc-900">Editor</option>
                      <option value="admin" className="bg-zinc-900">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      disabled={user.id === currentUser?.id}
                      onClick={() => handleToggleStatus(user)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-orbitron font-black uppercase transition-all tracking-widest disabled:cursor-not-allowed ${
                        user.status === 'disabled' 
                        ? 'border-red-500/30 text-red-500 bg-red-500/5' 
                        : 'border-green-500/30 text-green-500 bg-green-500/5'
                      }`}
                    >
                      {user.status === 'disabled' ? (
                        <><Lock className="w-2.5 h-2.5" /> Deactivated</>
                      ) : (
                        <><Unlock className="w-2.5 h-2.5" /> Operational</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        disabled={user.id === currentUser?.id}
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          user.status === 'disabled' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white' 
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500 hover:text-black'
                        } disabled:opacity-30 disabled:pointer-events-none`}
                        title={user.status === 'disabled' ? "Activate Signal" : "Sever Signal"}
                      >
                        {user.status === 'disabled' ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                      </button>
                      <button 
                        disabled={user.id === currentUser?.id}
                        onClick={() => handleDelete(user.id)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                        title="Decommission Unit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                      <Users className="w-20 h-20 text-slate-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-orbitron font-black uppercase tracking-[0.5em]">Zero Identities Found</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Adjust query parameters for re-scan</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 flex gap-6 items-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
          <Shield className="text-cyan-400 w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest">Administrator Directive</p>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter mt-1">
            "Disabled" units are immediately blocked from neural network authentication. "Decommissioned" units are purged from the identity matrix forever. Handle with care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
