import ResendEmailComponent from "@/components/resend-email";

export default async function ResendEmailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <ResendEmailComponent userId={userId} />
  );
}