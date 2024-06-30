import { type ReactNode, useEffect, useState } from 'react';
import { Button, Container, Fieldset, Group, Image, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Permission, Question, User } from '@prisma/client';
// import { createNewApplication } from '@/src/services/applications';
import { ActionType, MultipleChoiceQuestion, QuestionProps } from '@/lib/types';
import { getPermissionData } from '@/src/services/permissions';
import { createNewApplication } from '@/src/services/applications';

function MultipleChoice({ question, selectedValue, onSelect }: QuestionProps) {
  return (
    <Stack align="flex-start" p={10}>
      {question.question_data.options.map((option) => (
        <Button
          key={`${question.id}-${option}`}
          onClick={() => onSelect(question.id, option)}
          color={selectedValue === option ? 'blue' : 'gray'}
        >
          {option}
        </Button>
      ))}
    </Stack>
  );
}

function TrueFalse({ question, selectedValue, onSelect }: QuestionProps) {
  return (
    <Stack align="flex-start" p={10}>
      <Button
        key={`${question.id}-true`}
        onClick={() => onSelect(question.id, 'True')}
        color={selectedValue === 'True' ? 'blue' : 'gray'}
      >
        True
      </Button>
      <Button
        key={`${question.id}-false`}
        onClick={() => onSelect(question.id, 'False')}
        color={selectedValue === 'False' ? 'blue' : 'gray'}
      >
        False
      </Button>
    </Stack>
  );
}

export function ExamForm({
  permId,
  type,
  user_id,
}: {
  permId: Permission['id'];
  type: ActionType;
  user_id: User['id'];
}) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setQuestions(await getQuestions(permId));
        const permissions = await getPermissionData();
        const permission = permissions.find((p) => p.id === permId);
        if (permission) {
          setQuestions(permission.questions);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
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
    default:
      color = 'gray';
      buttonText = 'Close';
  }

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
        {questions.map((question) => {
          function Element({ children }: { children: ReactNode }) {
            return (
              <Fieldset key={question.id} m={10}>
                <Text c={form.errors[question.id] ? 'red' : ''} p={10}>
                  {question.text}
                </Text>
                {question.image_url ? (
                  <Image
                    src={question.image_url}
                    p={10}
                    width="80%"
                    height="auto"
                    alt="Question image"
                  />
                ) : null}

                {children}
              </Fieldset>
            );
          }

          switch (question.type) {
            case 'MULTIPLE_CHOICE':
              return (
                <Element key={question.id}>
                  <MultipleChoice
                    question={question as MultipleChoiceQuestion}
                    selectedValue={selectedValues[question.id] || ''}
                    onSelect={handleSelect}
                  />
                </Element>
              );
            case 'TRUE_FALSE':
              return (
                <Element key={question.id}>
                  <TrueFalse
                    question={question as MultipleChoiceQuestion}
                    selectedValue={selectedValues[question.id] || ''}
                    onSelect={handleSelect}
                  />
                </Element>
              );
            default:
              return <p key={question.id}>{question.type} is not handled</p>;
          }
        })}

        <Group justify="flex-end" mt="md">
          <Button type="submit" color={color}>
            {buttonText}
          </Button>
        </Group>
      </form>
    </Container>
  );
}
