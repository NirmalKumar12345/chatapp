export default function SearchUserSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex animate-pulse items-center gap-3"
                >
                    <div className="h-12 w-12 rounded-full bg-muted"/>

                    <div className="flex-1 space-y-2">

                        <div className="h-4 w-36 rounded bg-muted"/>

                        <div className="h-3 w-20 rounded bg-muted"/>

                    </div>
                </div>
            ))}
        </div>
    );
}