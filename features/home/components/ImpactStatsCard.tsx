type ImpactStatsCardProps = {
  number: number;
  label: string;
};

export default function ImpactStatsCard({
  number,
  label,
}: ImpactStatsCardProps) {
  return (
    <div className="flex h-fit flex-col items-start border-l border-gray-300 px-2 py-2 md:w-40 md:py-4 md:pl-4">
      <h3 className="text-3xl font-bold -tracking-widest md:text-6xl">
        {number}+
      </h3>

      <p className="text-sm font-semibold md:ml-2">{label}</p>
    </div>
  );
}
