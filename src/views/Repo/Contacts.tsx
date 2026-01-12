import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, GraduationCap, BookOpen, Mail, Phone, Globe, ChevronRight } from 'lucide-react';
import { ChatPanel } from '../../components/Chat/ChatPanel';

interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  type: 'company' | 'education' | 'publisher';
  email?: string;
  phone?: string;
  website?: string;
}

// Mock contact data
const CONTACTS: Contact[] = [
  // Companies
  { id: 'c1', name: 'Sarah Mitchell', role: 'Director of Operations', organization: 'Wood Works', type: 'company', email: 'sarah@woodworks.com', phone: '(512) 555-0101' },
  { id: 'c2', name: 'James Chen', role: 'Project Manager', organization: 'Hensel Phelps', type: 'company', email: 'jchen@henselphelps.com', phone: '(512) 555-0102' },
  { id: 'c3', name: 'Maria Santos', role: 'Sustainability Lead', organization: 'Skanska', type: 'company', email: 'msantos@skanska.com' },
  { id: 'c4', name: 'David Park', role: 'Research Partner', organization: 'Gensler', type: 'company', email: 'dpark@gensler.com', website: 'gensler.com' },
  { id: 'c5', name: 'Rachel Foster', role: 'Technical Director', organization: 'AECOM', type: 'company', email: 'rfoster@aecom.com' },

  // Education
  { id: 'e1', name: 'Dr. William Hayes', role: 'Professor of Architecture', organization: 'UT Austin', type: 'education', email: 'whayes@utexas.edu', phone: '(512) 471-0001' },
  { id: 'e2', name: 'Dr. Lisa Wong', role: 'Research Director', organization: 'Texas A&M', type: 'education', email: 'lwong@tamu.edu' },
  { id: 'e3', name: 'Dr. Michael Torres', role: 'Dean of Design', organization: 'UTSA', type: 'education', email: 'mtorres@utsa.edu', phone: '(210) 458-0001' },
  { id: 'e4', name: 'Amanda Richards', role: 'Graduate Coordinator', organization: 'Rice University', type: 'education', email: 'arichards@rice.edu' },

  // Publishers
  { id: 'p1', name: 'Jennifer Adams', role: 'Senior Editor', organization: 'Texas Architect', type: 'publisher', email: 'jadams@texasarchitect.org', website: 'texasarchitect.org' },
  { id: 'p2', name: 'Robert Kim', role: 'Contributing Editor', organization: 'Architect Magazine', type: 'publisher', email: 'rkim@architectmagazine.com' },
  { id: 'p3', name: 'Catherine Bell', role: 'Features Editor', organization: 'Dezeen', type: 'publisher', email: 'cbell@dezeen.com', website: 'dezeen.com' },
];

type FilterType = 'all' | 'company' | 'education' | 'publisher';

const FILTER_CONFIG: { type: FilterType; label: string; icon: typeof Building2 }[] = [
  { type: 'all', label: 'All', icon: Building2 },
  { type: 'company', label: 'Companies', icon: Building2 },
  { type: 'education', label: 'Education', icon: GraduationCap },
  { type: 'publisher', label: 'Publishers', icon: BookOpen },
];

const TYPE_ICONS = {
  company: Building2,
  education: GraduationCap,
  publisher: BookOpen,
};

export default function Contacts() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set());

  const toggleContact = (contactId: string) => {
    setExpandedContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const filteredContacts = useMemo(() => {
    if (filter === 'all') return CONTACTS;
    return CONTACTS.filter(c => c.type === filter);
  }, [filter]);

  return (
    <div className="px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Contacts</h1>
        <p className="text-gray-400">Research partners and collaborators</p>
      </div>

      <div className="flex gap-8">
        {/* Left column - Contacts (2/3) - scrolls with page */}
        <div className="flex-1 lg:w-2/3 space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-2">
            {FILTER_CONFIG.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === type
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'
                }`}
              >
                {type !== 'all' && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-500">{filteredContacts.length} contacts</span>
          </div>

          {/* Contact List */}
          <div className="space-y-2">
            {filteredContacts.map((contact, index) => {
              const isExpanded = expandedContacts.has(contact.id);
              const TypeIcon = TYPE_ICONS[contact.type];

              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-card border border-card rounded-xl overflow-hidden"
                >
                  {/* Collapsed row - always visible */}
                  <button
                    onClick={() => toggleContact(contact.id)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-800/30 transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </motion.div>

                    {/* Type icon */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                      <TypeIcon className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Name and org */}
                    <div className="flex-1 text-left min-w-0">
                      <span className="text-white font-medium">{contact.name}</span>
                      <span className="text-gray-500 mx-2">-</span>
                      <span className="text-gray-400">{contact.organization}</span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-gray-800 ml-11">
                          {/* Role */}
                          <p className="text-sm text-gray-400 mb-3">{contact.role}</p>

                          {/* Contact details */}
                          <div className="space-y-2">
                            {contact.email && (
                              <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                                <span>{contact.email}</span>
                              </a>
                            )}
                            {contact.phone && (
                              <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                <span>{contact.phone}</span>
                              </a>
                            )}
                            {contact.website && (
                              <a
                                href={`https://${contact.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                              >
                                <Globe className="w-4 h-4" />
                                <span>{contact.website}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column - Chat (1/3) - stays fixed */}
        <div className="hidden lg:block lg:w-1/3 shrink-0">
          <div className="fixed top-24 right-12 w-[calc((100vw-6rem-2rem)*0.333)] h-[calc(100vh-120px)]">
            <ChatPanel
              title="Ask"
              subtitle="Contact assistant"
              placeholder="Search contacts..."
              initialMessage="Hello! I can help you find contact information. Who are you looking for?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
