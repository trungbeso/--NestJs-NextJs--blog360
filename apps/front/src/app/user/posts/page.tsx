type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const UserPostPage = async ({ searchParams }: Props) => {
  const { page } = await searchParams;

  return (
    <div>
      <h1>User Post Page - Page {page || 1}</h1>
    </div>
  );
};

export default UserPostPage;
