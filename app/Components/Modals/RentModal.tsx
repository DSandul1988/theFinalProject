"use client";
import { catego } from "../NavigationBar/Categories";
import useRent from "@/app/hooks/useRent";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import CategoryInput from "../Inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import LocationFinder from "../Inputs/LocationFinder";
import Map from "@/app/Components/Map";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });
  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/Components/Map"), {
        ssr: false,
      }),
    [location]
  );
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const rent = useRent();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const router = useRouter();
  const getBack = () => {
    setStep((value) => value - 1);
  };
  const getForeward = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return getForeward();
    }
    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rent.handleClose;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const Label = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="So what category your place fits in ?"
        subtitle="Pick a category"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {catego.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
              }}
              selected={category === item.label}
              label={item.label}
              photo={item.photo.src}
              width={item.photo.width}
              height={item.photo.height}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where are you 
     located?"
          subtitle="Help your guests find you "
        />
        <LocationFinder
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Tell about your home" subtitle="Describe your place" />
        <Counter
          title="Number of guests"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
          subtitle={""}
        />
        <Counter
          title="Number of rooms"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
          subtitle={""}
        />
        <Counter
          title="Number of toilets"
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
          subtitle={""}
        />
      </div>
    );
  }
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="add a photo " />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="How you  describe your place" subtitle="" />
        <Input
          id="title"
          label="title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How Much for your house"
          subtitle="How much per night"
        />
        <Input
          id="price"
          label="price"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          formatPrice={true}
          type="number"
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={rent.isOpen}
      body={bodyContent}
      onClose={rent.handleClose}
      submit={handleSubmit(onSubmit)}
      title="Rent your home"
      label={Label}
      secondLabel={secondLabel}
      secondAction={step === STEPS.CATEGORY ? undefined : getBack}
    />
  );
};
export default RentModal;
