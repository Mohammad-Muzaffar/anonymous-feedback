import PostDetails from "@/components/custom/PostDetails";

export default async function PostPage({ params }: { params: { postId: string } }) {
  // `params.postId` is resolved here
  const postId = params.postId;

  return (
    <div className="container mx-auto py-8">
      {/* Pass resolved postId to your component */}
      <PostDetails postId={postId} />
    </div>
  );
}
