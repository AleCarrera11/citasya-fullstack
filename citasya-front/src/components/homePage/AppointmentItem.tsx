import * as React from "react";

interface AppointmentItemProps {
  clientName: string;
  service: string;
  specialist: string;
  time: string;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({
  clientName,
  service,
  specialist,
  time
}) => {
  return (
    <article className="relative flex-wrap gap-5 px-10 py-4 w-full min-h-[77px] max-md:px-5 max-md:max-w-full bg-green-300/20 border-b border-neutral-200 border-shadow-md">
      <div className="flex relative flex-col">
        <h4 className="self-start text-xl tracking-tight leading-none text-black">
          {clientName}
        </h4>
        <p className="text-sm tracking-tight leading-6 text-neutral-600">
          {service} / {specialist}
        </p>
      </div>
      <time className="relative my-auto text-xl tracking-tight leading-none text-black">
        {time}
      </time>
    </article>
  );
};
