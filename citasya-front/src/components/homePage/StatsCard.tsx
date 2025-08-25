import * as React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  variant: "confirmed" | "pending" | "cancelled";
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, variant }) => {
  const getCardStyles = () => {
    switch (variant) {
      case "confirmed":
        return "text-white bg-green-300/60";
      case "pending":
        return "rounded-3xl bg-green-300/20 text-neutral-700";
      case "cancelled":
        return "text-white bg-yellow-700/60";
      default:
        return "";
    }
  };

  const getValueStyles = () => {
    switch (variant) {
      case "pending":
        return "text-gray-900";
      default:
        return "";
    }
  };

  return (
    <article className={`flex flex-col grow px-12 pt-8 pb-20 w-full text-center rounded-3xl max-md:px-5 max-md:mt-10 ${getCardStyles()}`}>
      <h3 className="text-2xl font-medium tracking-wide leading-none">
        {title}
      </h3>
      <p className={`self-center mt-7 text-6xl font-bold leading-tight max-md:text-4xl ${getValueStyles()}`}>
        {value}
      </p>
    </article>
  );
};
