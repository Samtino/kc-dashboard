import { Button, Container, Fieldset, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Permission } from '@prisma/client';
import { useState } from 'react';

type actionType = 'view' | 'edit' | 'send' | 'delete' | 'denied';

interface MultipleChoiceProps {
  id: number;
  name: string;
  options: string[];
  correctAnswers: string;
}

interface MultipleChoiceComponentProps {
  props: MultipleChoiceProps;
  selectedValue: string;
  onSelect: (id: number, value: string) => void;
  error: any;
}

function MultipleChoice({ props, selectedValue, onSelect, error }: MultipleChoiceComponentProps) {
  return (
    <Fieldset m={10}>
      <p style={{ color: error ? 'red' : '' }}>
        {props.name}
        {error && '*'}
      </p>
      <Stack align="flex-start">
        {props.options.map((option) => (
          <Button
            key={option}
            onClick={() => onSelect(props.id, option)}
            color={selectedValue === option ? 'blue' : 'gray'}
          >
            {option}
          </Button>
        ))}
      </Stack>
    </Fieldset>
  );
}

export function ExamForm({ name, type }: { name: Permission['name']; type: actionType }) {
  // FIXME: get questions from the db using the name as the key

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
  const questions: MultipleChoiceProps[] = [
    {
      id: 1,
      name: 'How many strikes will cause you to lose permissions for Company Command?',
      options: ['4', '2', '3'],
      correctAnswers: '2',
    },
    {
      id: 2,
      name: 'True or False: Company Command is permitted to operate outside of a FOB or Operations Base?',
      options: ['True', 'False'],
      correctAnswers: 'False',
    },
    {
      id: 3,
      name: 'True or False: Company Commander should have complete knowledge of ALL Standard Operating Procedures?',
      options: ['True', 'False'],
      correctAnswers: 'True',
    },
    {
      id: 4,
      name: 'Which Frequencies are you required to monitor as Company Commander?',
      options: ['LR 031.000 & SR 160.000', 'LR 080.000 & SR 070.000', 'LR 030.000 & SR 036.000'],
      correctAnswers: 'LR 030.000 & SR 036.000',
    },
  ];

  const initialValues: { [key: number]: string } = {};
  questions.forEach((question) => {
    initialValues[question.id] = '';
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...initialValues,
    },
    validate: (values) => {
      const errors: { [key: number]: string } = {};
      for (const key in values) {
        if (!values[key]) {
          errors[key] = 'This field is required';
        }
      }
      return errors;
    },
  });

  const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});

  const handleSelect = (id: number, value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    form.setFieldValue(`${id}`, value);
  };

  // FIXME: actually do something on submit
  return (
    <Container>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {questions.map((question) => (
          <MultipleChoice
            key={question.id}
            props={question}
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
