"use client";

import { Listing, Reservation } from "@prisma/client";
import { SafeListing, SafeReservation, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import useCountries from "../hooks/useLocation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "./HeartButton";
import { Button } from "./Button";
interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  isPaid?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,

  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  isPaid,
}) => {
  const router = useRouter();
  // Use a custom hook 'useCountries' to retrieve location values.
  const { getValue } = useCountries();
  // Resolve the location details for the listing using the 'getValue' function.
  const location = getValue(data.location);
  // Define a memoized callback function 'handleCancel' to handle cancellation actions.
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Prevent the event from bubbling up to parent elements.
      if (disabled) {
        // Exit the function if the button is disabled.
        return;
      }
      // Invoke the 'onAction' callback with 'actionId' if it's provided.
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );
  // Compute the price to display using 'useMemo' for optimization.
  const price = useMemo(() => {
    // If there's a reservation, return its total price.
    if (reservation) {
      return reservation.totalPrice;
    }
    // Otherwise, return the listing's price.
    return data.price;
  }, [reservation, data.price]); // Dependencies for re-computation

  // Compute the reservation date range string, if applicable.
  const reservationDate = useMemo(() => {
    // If there's no reservation, return null.
    if (!reservation) {
      return null;
    }
    // Format the start and end dates of the reservation.
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    // Return the formatted date range string.
    return `${format(start, "PP")} -${format(end, "PP")}`;
  }, [reservation]);
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)} // Navigate to the listing's page on click.
      className="col-span-1
  cursor-pointer-group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="aspect-square
        w-full
        relative
        overflow-hidden
        rounded-xl"
        >
          <Image
            fill
            alt="Listing"
            src={data.imgSrc}
            className="object-cover 
            h-full 
            w-full group-hover:scale-110 
            transition"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region},{location?.value},{location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">£ {price}</div>
          {!reservation && <div className="font-light"> a night</div>}
        </div>
        {isPaid ? <div className="text-green-500 font-light">Paid</div> : null}
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
