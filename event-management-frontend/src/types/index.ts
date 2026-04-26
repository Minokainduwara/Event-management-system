export type Category = {
    categoryId: number;
    categoryName: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  };
  
  export type Event = {
    eventId?: number;
    eventTitle: string;
    description: string;
    eventDate: string;
    location: string;
    status: string;
    maxParticipants: number | null;
    image?: string;
    category: {
      categoryId: number;
    };
  };
  
  export type Announcement = {
    title: string;
    message: string;
    createdBy: {
      userId: number;
    };
  };