import * as React from "react";
import { CiClock2 } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";

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
    <div className="flex justify-between items-center p-6 bg-white border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8">
          <VscAccount className="size-9 bg-[#D6EBF3] text-[#447F98] transition-colors duration-200 rounded-2xl " />
        </div>
        <div>
          <h3 className="font-medium">{clientName}</h3>
          <p className="text-xs text-gray-600">
            {service} • {specialist}
          </p>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <CiClock2 className="h-4 w-4 mr-1 text-gray-500" />
        {time}
      </div>
    </div>
  );
};
