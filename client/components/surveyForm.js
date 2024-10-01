const SurveyForm = ({ survey, answers, handleInputChange, handleSubmit }) => {
  const renderQuestion = (question) => {
    const { _id, type, choices } = question;

    switch (type) {
      case "multipleChoice":
        return (
          <div key={_id} className="my-2">
            <div className="flex flex-col">
              {choices.map((choice) => (
                <label
                  key={choice}
                  className={`inline-flex items-center transition-all duration-300 mb-1 ${
                    answers
                      .find((item) => item.question === _id)
                      ?.answer.includes(choice)
                      ? "bg-blue-100 animate-selection"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600 h-5 w-5"
                    onChange={(e) =>
                      handleInputChange(_id, [...(answers[_id] || []), choice])
                    }
                  />
                  <span className="ml-2">{choice}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "singleChoice":
        return (
          <div key={_id} className="my-2">
            <div className="flex flex-col">
              {choices.map((choice) => (
                <label
                  key={choice}
                  className={`inline-flex items-center transition-all duration-300 mb-1 ${
                    answers.find((item) => item.question === _id)?.answer ===
                    choice
                      ? "bg-blue-100 animate-selection"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    className="form-radio text-blue-600 h-5 w-5"
                    name={`question_${_id}`}
                    value={choice}
                    onChange={(e) => handleInputChange(_id, choice)}
                  />
                  <span className="ml-2">{choice}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div key={_id} className="my-2">
            <input
              type="date"
              className="mt-2 p-2 border rounded"
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "time":
        return (
          <div key={_id} className="my-2">
            <input
              type="time"
              id="time"
              className="mt-2 p-2 border rounded"
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "phone":
        return (
          <div key={_id} className="my-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                id="phone"
                onChange={(e) => handleInputChange(_id, e.target.value)}
                placeholder="+1 (123) 456-7890"
                className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div key={_id} className="my-2 relative z-0">
            <input
              type="text"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              name="text"
              id="text"
              placeholder=" "
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
            <label
              htmlFor="text"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Short text
            </label>
          </div>
        );

      case "paragraph":
        return (
          <div key={_id} className="my-2 relative z-0">
            <textarea
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              rows="4"
              id="paragraph"
              onChange={(e) => handleInputChange(_id, e.target.value)}
            ></textarea>
            <label
              htmlFor="paragraph"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Paragraph
            </label>
          </div>
        );

      case "email":
        return (
          <div key={_id} className="mb-4">
            <input
              type="email"
              className="mt-2 p-2 border rounded w-full"
              onChange={(e) => handleInputChange(_id, e.target.value)}
            />
          </div>
        );

      case "rating":
        return (
          <div
            key={_id}
            className="mb-4 flex items-center justify-center md:justify-between"
          >
            <p className="pl-4 hidden md:block">Negative</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-2xl bg-gray-200 hover:bg-gray-300 ${
                    answers.find((item) => item.question == _id)?.answer ==
                    rating
                      ? "text-white bg-blue-500"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`question_${_id}`}
                    value={rating}
                    checked={
                      answers.find((item) => item.question === _id)?.answer ===
                      rating
                    }
                    onChange={(e) => handleInputChange(_id, rating)}
                  />
                  {rating}
                </label>
              ))}
            </div>
            <p className="pr-4 hidden md:block">Positive</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {survey.questions.map((question, idx) => (
        <div
          key={question._id}
          className="bg-white py-3 rounded-lg shadow-sm border border-gray-200 my-4"
        >
          <p className="font-semibold py-2 px-4">
            {idx + 1}. {question.question}{" "}
            {!question.optional && <span className="text-red-700">*</span>}
          </p>
          <div className="py-2 px-4 border-t border-gray-200 text-sm text-gray-600 font-normal">
            {renderQuestion(question)}
          </div>
        </div>
      ))}
      {survey.questions?.length > 0 && (
        <button
          type="submit"
          className="inline-block py-2 px-6 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default SurveyForm;
