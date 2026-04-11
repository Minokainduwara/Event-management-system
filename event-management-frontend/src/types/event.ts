export interface Event {
    id: number;
    title: string;
    description: string;
    category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Academic';
    date: string;
    time: string;
    venue: string;
    organizer: string;
    maxAttendees: number;
    registeredCount: number;
    imageUrl: string;
    status: 'upcoming' | 'completed' | 'ongoing';
}

export const categoryColors: Record<Event['category'], { bg: string; text: string }> = {
    Technical:  { bg: 'bg-blue-100',   text: 'text-blue-800'   },
    Cultural:   { bg: 'bg-purple-100', text: 'text-purple-800' },
    Sports:     { bg: 'bg-green-100',  text: 'text-green-800'  },
    Workshop:   { bg: 'bg-teal-100',   text: 'text-teal-800'   },
    Academic:   { bg: 'bg-orange-100', text: 'text-orange-800' },
};

export const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        title: 'Inter-University Hackathon 2025',
        description: 'A 24-hour coding challenge where teams build innovative solutions to real-world problems.',
        category: 'Technical',
        date: '2025-05-15',
        time: '09:00 AM',
        venue: 'Engineering Block, Lab 3',
        organizer: 'Dr. Sarah Johnson',
        maxAttendees: 200,
        registeredCount: 142,
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
        status: 'upcoming',
    },
    {
        id: 2,
        title: 'Cultural Night 2025',
        description: 'An evening of music, dance, and art celebrating the diversity of university life.',
        category: 'Cultural',
        date: '2025-05-22',
        time: '06:00 PM',
        venue: 'Main Auditorium',
        organizer: 'Prof. Amara Silva',
        maxAttendees: 500,
        registeredCount: 342,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        status: 'upcoming',
    },
    {
        id: 3,
        title: 'Annual Sports Meet',
        description: 'University-wide sports competition across cricket, football, badminton and athletics.',
        category: 'Sports',
        date: '2025-06-01',
        time: '08:00 AM',
        venue: 'University Sports Ground',
        organizer: 'Coach Rajan Perera',
        maxAttendees: 300,
        registeredCount: 215,
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
        status: 'upcoming',
    },
    {
        id: 4,
        title: 'AI & ML Workshop',
        description: 'Hands-on workshop covering Python, neural networks, and real-world ML model deployment.',
        category: 'Workshop',
        date: '2025-05-10',
        time: '10:00 AM',
        venue: 'Computer Science Lab 1',
        organizer: 'Dr. Sarah Johnson',
        maxAttendees: 60,
        registeredCount: 58,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
        status: 'upcoming',
    },
    {
        id: 5,
        title: 'Research Symposium 2025',
        description: 'Annual academic symposium for undergraduate and postgraduate research paper presentations.',
        category: 'Academic',
        date: '2025-06-10',
        time: '09:30 AM',
        venue: 'Conference Hall A',
        organizer: 'Dr. Priya Mendis',
        maxAttendees: 150,
        registeredCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
        status: 'upcoming',
    },
    {
        id: 6,
        title: 'Web Development Bootcamp',
        description: 'A 2-day intensive bootcamp on React, Node.js, and full-stack web development.',
        category: 'Workshop',
        date: '2025-05-28',
        time: '09:00 AM',
        venue: 'IT Department, Room 204',
        organizer: 'Dr. Sarah Johnson',
        maxAttendees: 80,
        registeredCount: 67,
        imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
        status: 'upcoming',
    },
];
