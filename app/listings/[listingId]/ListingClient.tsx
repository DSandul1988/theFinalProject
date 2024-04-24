"use client";
import axios from "axios";
import { Range } from "react-date-range";
import { Reservation } from "@prisma/client";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { catego } from "@/app/Components/NavigationBar/Categories";
import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@/app/Components/Container";
import ListingHead from "@/app/Components/listings/ListingHead";
import ListingInfo from "@/app/Components/listings/ListingInfo";
import useLogin from "@/app/hooks/useLogin";
import { useRouter } from "next/navigation";
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
} from "date-fns";
import toast from "react-hot-toast";
import ListingReservation from "@/app/Components/listings/ListingReservation";
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};
interface Review {
  id: string;
  content: string;
  userName: string | null;
  createdAt: Date;
}
interface ListingClientProps {
  ratings: number;
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
  content: Review[];
}

const ListingClient: React.FC<ListingClientProps> = ({
  ratings,
  listing,
  currentUser,
  reservations = [],
  content,
}) => {
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const listingId = listing.id;
  const router = useRouter();
  const loginModal = useLogin();

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      loginModal.handleOpen;
    }
    setIsLoading(true);
    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("Redirected to payment");
        setDateRange(initialDateRange);
        router.push(`/payment/${listingId}`);
      })
      .catch(() => {
        toast.error("something wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, router, currentUser, listing?.id, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount =
        differenceInCalendarDays(dateRange.endDate, dateRange.startDate) + 1;
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return catego.find((item) => item.label === listing.category);
  }, [listing.category]);
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imgSrc}
            locationValue={listing.location}
            id={listing.id}
            currentUser={currentUser}
            ratings={ratings}
            listingId={listing.id}
          />
          <div
            className="grid grid-cols-1
          md:grid-cols-7
          md:gap-10
          mt-6"
          >
            <ListingInfo
              listingId={listing.id}
              content={content}
              user={listing.user}
              guestCount={listing.guestCount}
              description={listing.description}
              roomCount={listing.roomCount}
              bathroomCount={listing.bathroomCount}
              location={listing.location}
              category={category}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
