import { useState, useEffect } from 'react';

interface WorkoutTemplate {
    id: string;
    name: string;
    description: string;
    workout_type_name?: string;
    estimated_duration_minutes?: number;
    difficulty_level?: string;
    exercise_count?: number;
}

interface WorkoutSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: WorkoutTemplate) => void;
}

export default function WorkoutSelectionModal({ isOpen, onClose, onSelect }: WorkoutSelectionModalProps) {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<WorkoutTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredTemplates(templates.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.workout_type_name?.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredTemplates(templates);
        }
    }, [searchTerm, templates]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${apiUrl}/workout-templates`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
                setFilteredTemplates(data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Select Workout Template</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <div className="p-6 border-b border-white/10">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-4"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-4"></div>
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            No templates found.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => onSelect(template)}
                                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/50 cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-teal-400 transition-colors">
                                                {template.name}
                                            </h3>
                                            <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                                {template.workout_type_name && (
                                                    <span className="px-2 py-0.5 rounded bg-white/10">
                                                        {template.workout_type_name}
                                                    </span>
                                                )}
                                                {template.difficulty_level && (
                                                    <span>• {template.difficulty_level}</span>
                                                )}
                                                {template.estimated_duration_minutes && (
                                                    <span>• {template.estimated_duration_minutes} min</span>
                                                )}
                                            </div>
                                        </div>
                                        <button className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
