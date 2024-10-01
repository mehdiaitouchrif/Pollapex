import { AiOutlineCloseCircle } from "react-icons/ai";
import { camelCaseToTitleCase } from "@/utils/helpers";

const QuestionTypeRenderer = ({
  index,
  question,
  addChoice,
  deleteChoice,
  handleChoiceChange,
}) => {
  switch (question.type) {
    case "text":
    case "paragraph":
    case "phone":
    case "email":
      return (
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="title"
            disabled
            id="title"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="title"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {camelCaseToTitleCase(question.type)} answer type
          </label>
        </div>
      );
    case "multipleChoice":
    case "singleChoice":
      return (
        <div>
          {question.choices.map((op, idx) => (
            <div key={idx} className="flex gap-4 items-center my-4">
              <input
                disabled
                type="checkbox"
                checked={false}
                className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="relative z-0 w-full group mb-3 flex items-center gap-4">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={op}
                  onChange={(e) =>
                    handleChoiceChange(index, idx, e.target.value)
                  }
                  required
                />
                <AiOutlineCloseCircle
                  size={24}
                  className="cursor-pointer hover:text-red-700 mt-4"
                  onClick={() => deleteChoice(index, idx)}
                />
              </div>
            </div>
          ))}

          <button
            className="bg-black text-white rounded shadow py-2 px-4 my-4"
            onClick={() => addChoice(index)}
          >
            Add option
          </button>
        </div>
      );
    case "time":
      return (
        <div className="my-4">
          <input
            type="time"
            id="time"
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      );
    case "date":
      return (
        <div className="my-4">
          <input
            type="date"
            id="date"
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Month, day, year"
          />
        </div>
      );
    case "rating":
      return (
        <div className="flex items-center justify-center gap-4 my-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-10 w-10 rounded-full border-black border-2 flex items-center justify-center text-center hover:bg-gray-50 cursor-not-allowed"
            >
              {index + 1}
            </div>
          ))}
        </div>
      );
    default:
      return;
  }
};

export default QuestionTypeRenderer;
