"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { isFuture, parse } from "date-fns";
interface PaymentInfo {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvvCode: string;
}

interface PaymentDetailsProps {
  reservation: SafeReservation;
  user: SafeUser;
  listing: SafeListing;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  reservation,
  user,
  listing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue to your useForm destructuring
    watch,
  } = useForm<PaymentInfo>();
  const [cardType, setCardType] = useState("");

  const router = useRouter();

  const cardNumberValue = watch("cardNumber");
  const validateExpiryDate = (value: string) => {
    const currentDate = new Date();
    const expiryDate = parse(value, "MM/yy", new Date());
    return isFuture(expiryDate) && expiryDate > currentDate;
  };
  const cardholderName = watch("cardholderName");
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const expiryValue = e.target.value.replace(/[^0-9/]/g, "").slice(0, 5);
    setValue("expiryDate", expiryValue, { shouldValidate: true });
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue("cardholderName", nameValue);
  };
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cvvValue = e.target.value.replace(/\D/g, "").slice(0, 4); // Keep only digits, max length 4
    setValue("cvvCode", cvvValue, { shouldValidate: true });
  };
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "cardNumber") {
        const cardValue = value.cardNumber || ""; // Ensure cardValue is always a string
        // Your logic to set the card type based on the card number
        if (/^4/.test(cardValue)) {
          // Corrected usage without optional chaining
          setCardType("Visa");
        } else if (
          /^5[1-5]/.test(cardValue) || // Corrected usage without optional chaining
          /^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(
            cardValue
          ) // Corrected usage
        ) {
          setCardType("MasterCard");
        } else {
          setCardType("");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (paymentDetails: PaymentInfo) => {
    // Combine payment details with user and reservation IDs
    const submissionData = {
      ...paymentDetails,
      userId: user.id,
      reservationId: reservation.id,
      amount: listing.price,
    };

    try {
      // First API call to submit payment information
      const response = await axios.post("/api/payment", submissionData);
      console.log(response.data);
      // If the payment submission is successful, proceed to update the reservation status
      if (response.status === 200) {
        // Check if the response is OK
        // Assuming the endpoint to update the reservation is "/api/reservations/updatePaidStatus"
        // and it expects an object with reservationId and isPaid properties
        const updateResponse = await axios.post(
          "/api/reservations/PaidStatus",
          {
            reservationId: submissionData.reservationId,
            isPaid: true,
          }
        );
        console.log(updateResponse.data);

        // Handle the successful update here, for example, showing a success message
        router.push("/trips");
      }
    } catch (error) {
      console.error("Error submitting payment or updating reservation status");
      // Handle error here, for example, showing an error message
    }
  };
  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded w-1/2"
      >
        <div className="mb-4">
          <label
            htmlFor="cardholderName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cardholder Name:
          </label>
          <input
            type="text"
            className={`shadow appearance-none border ${errors.cardholderName ? "border-red-500" : "rounded"} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            {...register("cardholderName", {
              required: "Cardholder name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name must only contain letters and spaces",
              },
            })}
            onChange={handleNameChange}
            // Directly using the value from watch to keep the input controlled
            value={cardholderName}
          />
          {errors.cardholderName && (
            <p className="text-red-500 text-xs italic">
              {errors.cardholderName.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="cardNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Card Number:
          </label>
          <input
            value={cardNumberValue} // Ensures the input displays the current form state value
            onChange={(e) => {
              let filteredValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
              // Determine maximum length based on detected card type
              let maxLength = 16; // Default maximum length
              if (/^3[47]/.test(filteredValue)) {
                // Example pattern for American Express cards
                maxLength = 15;
              }
              filteredValue = filteredValue.slice(0, maxLength); // Enforce maximum length

              setValue("cardNumber", filteredValue, { shouldValidate: true });

              // Update cardType based on the filteredValue
              if (/^4/.test(filteredValue)) {
                setCardType("Visa");
              } else if (
                /^5[1-5]/.test(filteredValue) ||
                /^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(
                  filteredValue
                )
              ) {
                setCardType("MasterCard");
              } else {
                setCardType("");
              }
            }}
            type="text"
            inputMode="numeric" // Suggests a numeric input mode for mobile devices
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <div className="mb-4">
            {cardType === "Visa" && (
              <img src="../public/images/Logo.png" alt="Visa Logo" />
            )}
            {cardType === "MasterCard" && (
              <img src="/path/to/mastercard-logo.png" alt="MasterCard Logo" />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="expiryDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Expiry Date (MM/YY):
          </label>
          <input
            {...register("expiryDate", {
              required: "Expiry date is required",
              validate: validateExpiryDate || "Invalid expiry date",
            })}
            type="text"
            placeholder="MM/YY"
            className={`shadow appearance-none border ${errors.expiryDate ? "border-red-500" : "rounded"} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            onChange={handleExpiryChange}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-xs italic">
              {errors.expiryDate.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="cvvCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CVV Code:
          </label>
          <input
            {...register("cvvCode", {
              required: "CVV is required",
              pattern: {
                value: /^[0-9]{3,4}$/,
                message: "Invalid CVV",
              },
            })}
            type="text"
            className={`shadow appearance-none border ${errors.cvvCode ? "border-red-500" : "rounded"} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            onChange={handleCvvChange}
          />
          {errors.cvvCode && (
            <p className="text-red-500 text-xs italic">
              {errors.cvvCode.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentDetails;
