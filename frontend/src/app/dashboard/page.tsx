import DashboardCard from "../../components/DashboardCard";

export default function DashboardPage() {
  // Example data, replace with real data as needed
  const cards = [
    { title: "Total Expenses", value: "$500" },
    { title: "Budget Status", value: "Under Budget" },
    { title: "Recent Transactions", value: "12" },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <DashboardCard key={card.title} title={card.title} value={card.value} />
        ))}
      </div>
    </main>
  );
}
