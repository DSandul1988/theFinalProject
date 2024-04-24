import { Listing, Reservation, User } from "@prisma/client";
import { Conversation, Message } from "@prisma/client";
import { Session } from "next-auth";
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};
export interface Review {
  id: string;
  content: string;
  userName: string | null; // Assuming the review includes the user's name
  createdAt: Date;
}

export interface ReviewsContextType {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}
export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};
export type FullMessageType = Message & {
  sender: User;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
declare module "next-auth" {
  // Extend the session's user type
  interface Session {
    user?: {
      // Include the default properties
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // Add your custom properties here
      isManager?: boolean;
    } & Partial<SafeUser>; // Extend with SafeUser to include any custom fields from SafeUser
  }
}
