interface IParams {
  listingId?: string;
}

const ReviewPage = async ({ params }: { params: IParams }) => {
  const { listingId } = params;
  return <div>This is a review page </div>;
};

export default ReviewPage;
