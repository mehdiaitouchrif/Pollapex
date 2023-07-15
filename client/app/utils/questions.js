import DateChoice from "../components/questionComponents/date";
import DisabledInput from "../components/questionComponents/disabledInput";
import MultipleChoice from "../components/questionComponents/multipleChoice";
import RatingChoice from "../components/questionComponents/rating";
import SingleChoice from "../components/questionComponents/singleChoice";
import TimeChoice from "../components/questionComponents/time";

export const returnQuestionJSX = (questionType) => {
  switch (questionType) {
    case "text":
    case "paragraph":
    case "phone":
    case "email":
      return <DisabledInput questionType={questionType} />;

    case "multipleChoice":
      return <MultipleChoice />;

    case "singleChoice":
      return <SingleChoice />;

    case "time":
      return <TimeChoice />;

    case "date":
      return <DateChoice />;

    case "rating":
      return <RatingChoice />;

    default:
      return;
  }
};
