import TutorialCard from "./product-feature-card";

const tutorials = [
  {
    id: "1",
    imageUrl: "/assets/images/marketplace.png",
    title: "Creating High-Quality Product Listings That Convert",
    description:
      "Creating effective product listing the cornerstone of successful selling on African Market Hub. ",
  },
  {
    id: "2",
    imageUrl: "/assets/images/marketplace.png",
    title: "Creating High-Quality Product Listings That Convert",
    description:
      "Creating effective product listing the cornerstone of successful selling on African Market Hub. ",
  },
  {
    id: "3",
    imageUrl: "/assets/images/marketplace.png",
    title: "Creating High-Quality Product Listings That Convert",
    description:
      "Creating effective product listing the cornerstone of successful selling on African Market Hub. ",
  },
];

export function TrainingTutorials() {
  return (
    <div className="grid grid-cols-2 gap-x-[15px] gap-y-4 lg:gap-8 lg:grid-cols-3">
      {tutorials.map((prod) => (
        <TutorialCard {...prod} key={prod.id} />
      ))}
    </div>
  );
}
