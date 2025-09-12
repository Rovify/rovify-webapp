export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-4 px-4">
                {children}
            </main>
        </div>
    );
}

// app/(public)/layout.tsx
// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen">
//       {children}
//     </div>
//   );
// }