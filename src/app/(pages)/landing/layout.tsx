export default function LandingLayout(
    { children }: { children: React.ReactNode }
) {
    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    );
}