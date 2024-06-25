import { useEffect, useState } from 'react';
import { Button, Container, Fieldset, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Permission, Question, User } from '@prisma/client';
import { getQuestions } from '@/src/app/services/permissions';
import { createNewApplication } from '@/src/app/services/applications';

type actionType = 'view' | 'edit' | 'send' | 'delete' | 'denied';

// interface MultipleChoiceProps {
//   id: number;
//   name: string;
//   options: string[];
//   correctAnswers: string;
// }

interface MultipleChoiceComponentProps {
  question: Question;
  selectedValue: string;
  onSelect: (id: string, value: string) => void;
  error: any;
}

function MultipleChoice({
  question,
  selectedValue,
  onSelect,
  error,
}: MultipleChoiceComponentProps) {
  return (
    <Fieldset m={10}>
      <p style={{ color: error ? 'red' : '' }}>
        {question.text}
        {error && '*'}
      </p>
      <Stack align="flex-start">
        {question.options.map((option) => (
          <Button
            key={option}
            onClick={() => onSelect(question.id, option)}
            color={selectedValue === option ? 'blue' : 'gray'}
          >
            {option}
          </Button>
        ))}
      </Stack>
    </Fieldset>
  );
}

export function ExamForm({
  permId,
  type,
  user_id,
}: {
  permId: string;
  type: actionType;
  user_id: User['id'];
}) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setQuestions(await getQuestions(permId));
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [permId]);

  let color;
  let buttonText;
  switch (type) {
    case 'edit':
      color = 'yellow';
      buttonText = 'Edit';
      break;
    case 'send':
      color = 'blue';
      buttonText = 'Submit';
      break;
    case 'delete':
      color = 'red';
      buttonText = 'Delete';
      break;
  }

  // FIXME: replace with database questions
  const initialValues: { [key: string]: string } = {};
  questions.forEach((question) => {
    initialValues[question.id] = '';
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...initialValues,
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      for (const key in values) {
        if (!values[key]) {
          errors[key] = 'This field is required';
        }
      }
      return errors;
    },
  });

  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});

  const handleSelect = (id: Question['id'], value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    form.setFieldValue(`${id}`, value);
  };

  return (
    <Container>
      <form
        onSubmit={form.onSubmit((values) =>
          createNewApplication(user_id, permId, Object.values(values)).then(() => {
            window.location.reload();
          })
        )}
      >
        {questions.map((question) => (
          <MultipleChoice
            key={question.id}
            question={question}
            selectedValue={selectedValues[question.id] || ''}
            onSelect={handleSelect}
            error={form.errors[question.id]}
          />
        ))}

        <Group justify="flex-end" mt="md">
          <Button type="submit" color={color}>
            {buttonText}
          </Button>
        </Group>
      </form>
    </Container>
  );
}
