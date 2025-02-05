import { useEffect, useState } from "react";
import { MultiValue } from "react-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import {
  CardWithFormTypes,
  FormTypes,
  Questions,
  StandUpConfigTypes,
} from "@/types/CardWithFormTypes";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import MultitSelect from "./MultitSelect";
import { daysOfWeek, times12hr, timezones } from "@/utils/staticDropdowns";
import { createTeam } from "@/services/api";
import axios from "axios";


const initialForm: FormTypes = {
  name: "",
  members: [],
  timezone: "",
  standUpConfig: {
    questions: [],
    reminderTimes: [],
    standUpDays: [],
    standUpTimes: [],
  },
};

const CardWithForm = ({
  title,
  description,
  className,
  onCancel,
}: CardWithFormTypes) => {
  const [form, setForm] = useState<FormTypes>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableMembers, setAvailableMembers] = useState<
    { id: string; name: string }[]
  >([{ id: "", name: "" }]);

  const handleAddQuestion = () => {
    // Generate the ID as the next index in the questions array
    const newId = form.standUpConfig.questions.length;

    // Create the new question object with the ID
    const newQuestion: Questions = {
      id: String(newId), // Convert to string if needed
      text: "",
      type: "text",
      options: [],
    };

    // Update the form state with the new question
    setForm({
      ...form,
      standUpConfig: {
        ...form.standUpConfig,
        questions: [...form.standUpConfig.questions, newQuestion],
      },
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = form.standUpConfig.questions.filter(
      (_, i) => i !== index
    );
    setForm({
      ...form,
      standUpConfig: {
        ...form.standUpConfig,
        questions: newQuestions,
      },
    });
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Questions,
    value: string
  ) => {
    const newQuestions = form.standUpConfig.questions.map((question, i) =>
      i === index
        ? {
            ...question,
            [field]: field === "options" ? value.split(",") : value,
          }
        : question
    );
    setForm({
      ...form,
      standUpConfig: {
        ...form.standUpConfig,
        questions: newQuestions,
      },
    });
  };

  const handleSingleSelect = (value: string) => {
    setForm({
      ...form,
      timezone: value,
    });
  };

  const handleMultipleSelect = (
    newValue: MultiValue<{ value: string; label: string }>,
    field: keyof FormTypes | keyof StandUpConfigTypes // Field to update
  ) => {
    // Extract values from selected options
    const selectedValues = newValue.map((option) => option.value);

    // Update the form state dynamically
    if (field in form) {
      // Update top-level form fields (e.g., members)
      setForm({
        ...form,
        [field]: selectedValues,
      });
    } else if (field in form.standUpConfig) {
      // Update nested standUpConfig fields (e.g., reminderTimes, standUpDays, etc.)
      setForm({
        ...form,
        standUpConfig: {
          ...form.standUpConfig,
          [field]: selectedValues,
        },
      });
    }
  };
  const reminderOptions = times12hr.map((reminder) => ({
    value: reminder,
    label: reminder,
  }));
  // Format available members for react-select
  const memberOptions =
    availableMembers &&
    availableMembers.map((member) => ({
      value: member.id,
      label: member.name,
    }));

  const standupDays = daysOfWeek.map((day) => ({
    value: day,
    label: day,
  }));

  const standupTimes = times12hr.map((reminder) => ({
    value: reminder,
    label: reminder,
  }));

   const handleSubmit = async (event: React.FormEvent) => {
     event.preventDefault();
     setIsSubmitting(true); // Start loading

     try {
       const response = await createTeam(form);
       console.log("response", response.data);
       setForm(initialForm); // Reset form on success
     } catch (err) {
       console.error(`Error submitting form`, err);
     } finally {
       setIsSubmitting(false); // End loading regardless of success/failure
     }
   };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await axios.get("http://localhost:5000/api/members");
        // console.log("members:", members.data.users);
        setAvailableMembers(members.data.users);
        // console.log("available members:", availableMembers);
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchMembers();
  }, []);
  return (
    <section className="fixed inset-0 h-screen flex items-center justify-center z-50 w-full p-5 ">
      <div className="fixed inset-0 flex bg-black bg-opacity-50 items-center justify-center z-50 w-full p-5 pt-32 sm:pt-5 ">
        <Card
          className={`w-full sm:max-w-[600px] overflow-y-scroll max-h-[600px] ${
            className || ""
          }`}
        >
          {title ? (
            <CardHeader>
              <CardTitle className="font-bold flex items-center justify-between">
                {title}{" "}
                {onCancel && (
                  <span className="cursor-pointer" onClick={onCancel}>
                    <X className="text-slate-500 hover:text-black transition-all duration-300 ease-in" />
                  </span>
                )}
              </CardTitle>
              {description && (
                <CardDescription className="font-light text-xs">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
          ) : null}

          <CardContent className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <Label>Team Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>

              {/* Members Multi-Select Field */}
              <div>
                <Label>Members</Label>
                <MultitSelect
                  options={memberOptions}
                  handleSelect={handleMultipleSelect}
                  field="members"
                  selectedValues={form.members}
                />
              </div>

              {/* Timezone Field */}
              <div>
                <Label>Timezone</Label>
                <ShadcnSelect
                  value={form.timezone}
                  onValueChange={(value) => handleSingleSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((item, index) => (
                      <SelectItem value={`${item}`} key={index}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </ShadcnSelect>
              </div>

              <div>
                <Label>Stanup Days</Label>
                <MultitSelect
                  selectedValues={form.standUpConfig.standUpDays}
                  handleSelect={handleMultipleSelect}
                  options={standupDays}
                  field="standUpDays"
                />
              </div>
              <div>
                <Label>Standup Times</Label>
                <MultitSelect
                  selectedValues={form.standUpConfig.standUpTimes}
                  handleSelect={handleMultipleSelect}
                  options={standupTimes}
                  field="standUpTimes"
                />
              </div>

              <div>
                <Label>Reminder Times</Label>
                <MultitSelect
                  selectedValues={form.standUpConfig.reminderTimes}
                  handleSelect={handleMultipleSelect}
                  options={reminderOptions}
                  field="reminderTimes"
                />
              </div>

              <div className="space-y-4">
                <div className="pb-2 pt-4 border-b-2">
                  <p className="text-sm font-bold">
                    {" "}
                    Configure Standup Questions
                  </p>
                </div>
                {form.standUpConfig.questions.map((question, index) => (
                  <div key={index}>
                    <div className="flex items-end space-x-2 ">
                      <div className="space-y-2 w-3/4">
                        <Label>{`Question ${index}`}</Label>
                        <Input
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(index, "text", e.target.value)
                          }
                          placeholder="Write something here"
                        />
                      </div>
                      <ShadcnSelect
                        value={question.type}
                        onValueChange={(value) =>
                          handleQuestionChange(index, "type", value)
                        }
                      >
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="multiple-choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="checkbox">Check Box</SelectItem>
                          <SelectItem value="radio">Radio</SelectItem>
                        </SelectContent>
                      </ShadcnSelect>
                      <Button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="hover:bg-green-primary bg-green-secondary"
                      >
                        Remove
                      </Button>
                    </div>
                    {question.type === "multiple-choice" ||
                    question.type === "checkbox" ||
                    question.type === "radio" ? (
                      <div className="pt-3 flex items-center gap-3">
                        <Label>Options:</Label>
                        <Input
                          placeholder="Enter options with commas separating"
                          value={question.options}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "options",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
                <Button
                  type="button"
                  className="hover:bg-green-primary bg-green-secondary"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </Button>
              </div>
              <div className="w-full flex justify-end gap-4 items-center">
                <Button
                  type="submit"
                  variant="default"
                  className="py-6 px-8 hover:bg-green-primary bg-green-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  className="py-6 px-8 text-red-600 bg-opacity-25 hover:text-red-600 bg-red-100"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default CardWithForm;
