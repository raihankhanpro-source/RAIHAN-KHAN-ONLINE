
import React from 'react';
import { User, Language } from '../types';
import { 
  Users, Shield, Trash2, UserCog, UserCheck, 
  UserMinus, Search, Mail, Calendar, ShieldCheck 
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
      alert("You cannot change your own role.");
      return;
    }
    onUpdateUser({ ...user, role: newRole });
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert("Self-termination of super-user accounts is prohibited.");
      return;
    }
    if (confirm("Are you sure you want to delete this user? This action is irreversible.")) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-orbitron font-black uppercase tracking-widest flex items-center gap-3">
            <Users className="text-cyan-400 w-6 h-6" /> Population Control
          </h2>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">Manage network access and protocol levels</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-cyan-500/50 w-full md:w-80 transition-all"
          />
        </div>
      </header>

      <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest">User Identity</th>
                <th className="px-6 py-4 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest">Access Level</th>
                <th className="px-6 py-4 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                        {user.role === 'admin' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-[#030303] flex items-center justify-center">
                            <ShieldCheck className="w-2 h-2 text-black" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{user.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-2.5 h-2.5" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value as User['role'])}
                        className={`bg-black/40 border rounded-lg px-3 py-1.5 text-[10px] font-orbitron font-black uppercase transition-all focus:outline-none cursor-pointer ${
                          user.role === 'admin' ? 'border-cyan-500/50 text-cyan-400' : 
                          user.role === 'editor' ? 'border-magenta-500/50 text-magenta-400' : 
                          'border-white/10 text-slate-400'
                        }`}
                      >
                        <option value="user" className="bg-zinc-900">Protocol: User</option>
                        <option value="editor" className="bg-zinc-900">Protocol: Editor</option>
                        <option value="admin" className="bg-zinc-900">Protocol: Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase tracking-tighter">History: {user.history?.length || 0} Nodes</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-tighter">Favorites: {user.likedPosts?.length || 0} Units</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all group-hover:scale-110"
                      title="Decommission User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                      <Users className="w-12 h-12" />
                      <p className="text-[10px] font-orbitron font-black uppercase tracking-[0.3em]">No Identities Found In This Database</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
