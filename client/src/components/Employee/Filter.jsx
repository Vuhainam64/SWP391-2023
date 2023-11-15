import { AiOutlineClose } from "react-icons/ai";
import { BsCalendar } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Button, Selection } from "../Styles";

function Filter() {
  return (
    <div className="items-center w-880">
      {/* location  */}
      <div className="items-center p-2 px-4 grid grid-cols-5">
        <div className="col-span-3">
          Class location
          <div className="flex items-center justify-between border border-gray-500 rounded-[4px]">
            <div className="flex">
              <div className="m-1 mx-2 px-1 bg-gray-400 text-white border border-gray-400">
                Ho Chi Minh
              </div>
              <div className="m-1 mx-2 px-1 bg-gray-400 text-white border border-gray-400">
                Da Nang
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-1">
                <AiOutlineClose />
              </div>
              <div className="p-1">
                <MdOutlineKeyboardArrowDown className="text-2xl text-gray-200" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col col-span-2 ml-14">
          Class time frame
          <div className="flex items-center">
            from
            <div className="flex items-center m-1 mx-2 px-1 text-gray-700 border border-gray-500 rounded-[4px]">
              <div className="mx-1 flex items-center">
                <div className="mx-1">--/--/----</div>
                <div className="mx-1">
                  <BsCalendar />
                </div>
              </div>
            </div>
            to
            <div className="flex items-center m-1 mx-2 px-1 text-gray-700 border border-gray-500 rounded-[4px]">
              <div className="mx-1 flex items-center">
                <div className="mx-1">--/--/----</div>
                <div className="mx-1">
                  <BsCalendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* checkbox  */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {/* class time  */}
        <div className="flex items-center pl-4">
          <div className="h-full">Class time</div>
          <div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Morning
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">Noon</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">Night</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Online
              </label>
            </div>
          </div>
        </div>
        {/* status */}
        <div className="flex items-center pl-4">
          <div className="h-full">Status</div>
          <div className="h-full">
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Plaining
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Openning
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Closed
              </label>
            </div>
          </div>
        </div>
        {/* Attendee  */}
        <div className="flex items-center pl-4">
          <div className="h-full">Attendee</div>
          <div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Intern
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Fresher
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Online fee-fresher
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mx-4" />
              <label className="text-sm font-medium text-gray-900">
                Offline fee-fresher
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* selection  */}
      <div className="grid grid-cols-2 gap-4 m-4">
        <div className="flex items-center">
          FSU
          <div className="w-full ml-4 mr-20">
            <Selection />
          </div>
        </div>
        <div className="flex items-center">
          Trainer
          <div className="w-full ml-4 mr-20">
            <Selection />
          </div>
        </div>
      </div>
      {/* button  */}
      <div className="flex flex-row-reverse mt-10 mx-4 my-2">
        <Button text={"Search"} />
        <Button text={"Clear"} />
      </div>
    </div>
  );
}

export default Filter;
