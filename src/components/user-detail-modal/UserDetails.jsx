import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import {
  Award,
  CalendarIcon,
  Flame,
  MapPinIcon,
  Target,
  X,
  User,
  Hourglass,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import moment from "moment";
import avatar from "../../assets/avatar.jpg";

export function UserDetailsModal({ isOpen, onClose, data }) {
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  const { darkMode } = useSelector((state) => state.darkMode);
  const profilePictureUrl = data?.profilePicture
    ? isValidUrl(data?.profilePicture)
      ? data?.profilePicture
      : `{${import.meta.env.VITE_APP_API_URL}/uploads/images/${
          data?.profilePicture
        }`
    : avatar;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      <Dialog.Content
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md",
          "dark:bg-gray-800 dark:text-muted"
        )}
      >
        <Dialog.Description className="">
          <Card
            className="bg-[#f9f9f9] shadow-md rounded-[4px] overflow-hidden"
            style={{
              maxWidth: "800px", // Set your desired max width
              maxHeight: "300px", // Set your desired max height
              minWidth: "600px", // Set your desired min width
              minHeight: "430px", // Set your desired min height
            }}
          >
            <div className="flex h-full">
              <div className="w-[200px] bg-white py-5 px-4 space-y-[6px] text-[13px] border-r border-gray-200">
                <h2 className="font-semibold text-[15px] mb-4">User Details</h2>
                <div className="text-[#2d87f3] font-medium">Profile</div>
                {/* <div className="text-gray-600">Membership Status</div> */}
                {/* <div className="text-gray-600">Payment History</div> */}
              </div>
              <div className="flex-1 p-5 relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        "rounded-full transition-colors p-1 duration-300 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground",
                        "dark:text-gray-100 dark:bg-gray-900 dark:hover:text-gray-100 dark:hover:bg-gray-400"
                      )}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </button>
                <div className="flex flex-col items-start mt-10 mb-5">
                  <div className="w-[70px] h-[70px] bg-gray-200 rounded-full mr-4 overflow-hidden flex items-center justify-center">
                    <img
                      src={profilePictureUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    {/* <div className="text-[11px] text-gray-500">ubaidziad #881288</div> */}
                    <h3 className="text-[17px] font-semibold mt-[2px]">
                      {data?.userName}
                    </h3>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-blue-100 my-5 "></div>
                <div className="space-y-[10px] text-[13px]">
                  <div className="flex items-center">
                    <CalendarIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                    <div className="flex items-center justify-between w-full">
                      <div className="text-gray-500">Date Joined:</div>
                      <div className="mt-[2px]">
                        {moment(data?.createdAt).format("MMM D, YYYY")}
                      </div>
                    </div>
                  </div>
                  {data?.dob && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                      <div className="flex items-center justify-between w-full">
                        <div className="text-gray-500">Date of Birth:</div>
                        <div className="mt-[2px]">
                          {moment(data?.dob).format("MM/DD/YYYY")}
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.country && (
                    <div className="flex items-center">
                      <MapPinIcon className="w-[18px] h-[18px] mr-3 text-gray-400" />
                      <div className="flex items-center justify-between w-full">
                        <div className="text-gray-500">Country:</div>
                        <div className="mt-[2px]">{data?.country}</div>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-[2px] bg-blue-100 my-5 "></div>
                  <div className="flex items-center">
                    <Hourglass className="w-[18px] h-[18px] mr-3 text-gray-400" />
                    <div className="flex items-center justify-between w-full">
                      <div className="text-gray-500">Age:</div>
                      <div className="mt-[2px]">{data?.age}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-[18px] h-[18px] mr-3 text-gray-400" />
                    <div className="flex items-center justify-between w-full">
                      <div className="text-gray-500">Vocation:</div>
                      <div className="mt-[2px]">{data?.vocation}</div>
                    </div>
                  </div>
                  {/* <div className="flex items-center">
                                        <Award className="w-[18px] h-[18px] mr-3 text-gray-400" />
                                        <div className='flex items-center justify-between w-full'>
                                            <div className="text-gray-500">Total App points:</div>
                                            <div className="mt-[2px]">192</div>
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </Card>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
